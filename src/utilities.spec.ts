import {
	sleep,
	retry,
	withTimeout,
	sequential,
	createDeferred,
	makeCancellable,
	withExtendableTimeout,
} from "./utilities";

describe("utilities", () => {
	describe("sleep", () => {
		it("should resolve after specified time", async () => {
			const start = Date.now();
			await sleep(100);
			const duration = Date.now() - start;
			expect(duration).toBeGreaterThanOrEqual(95); // Allow small timing variance
			expect(duration).toBeLessThan(150); // Should not take too long
		});

		it("should handle zero delay", async () => {
			const start = Date.now();
			await sleep(0);
			const duration = Date.now() - start;
			expect(duration).toBeLessThanOrEqual(50);
		});
	});

	describe("retry", () => {
		it("should retry failed operations", async () => {
			let attempts = 0;

			const fn = () => {
				attempts++;
				if (attempts === 2) throw new Error("Not yet");
				if (attempts <= 1) return Promise.reject("Not yet");
				return Promise.resolve("success");
			};

			const result = await retry(fn, 3, 100);
			expect(result).toBe("success");
			expect(attempts).toBe(3);
		});

		it("should throw if max attempts reached", async () => {
			const fn1 = () => Promise.reject(new Error("Always fails"));
			await expect(retry(fn1, 2, 100)).rejects.toThrow("Always fails");

			const fn2 = () => Promise.reject(-1);
			await expect(retry(fn2, 2, 100)).rejects.toBe(-1);
		});

		it("should work with sync functions", async () => {
			let attempts = 0;
			const fn = () => {
				attempts++;
				if (attempts < 2) throw new Error("Not yet");
				return "sync success";
			};

			const result = await retry(fn, 2, 100);
			expect(result).toBe("sync success");
			expect(attempts).toBe(2);
		});

		it("should handle immediate success", async () => {
			const fn = () => "immediate";
			const result = await retry(fn, 3, 100);
			expect(result).toBe("immediate");
		});
	});

	describe("withTimeout", () => {
		it("should resolve if promise completes within timeout", async () => {
			const promise = sleep(100).then(() => "done");
			const result = await withTimeout(promise, 200);
			expect(result).toBe("done");
		});

		it("should reject if promise takes too long", async () => {
			const promise = sleep(200).then(() => "done");
			await expect(withTimeout(promise, 100)).rejects.toThrow("Operation timed out");
		});

		it("should use custom error message", async () => {
			const promise = sleep(200);
			await expect(withTimeout(promise, 100, "Custom timeout")).rejects.toThrow("Custom timeout");
		});

		it("should handle immediate resolution", async () => {
			const promise = Promise.resolve("instant");
			const result = await withTimeout(promise, 100);
			expect(result).toBe("instant");
		});

		it("should handle promise rejection", async () => {
			const promise = Promise.reject(new Error("Original error"));
			await expect(withTimeout(promise, 100)).rejects.toThrow("Original error");
		});
	});

	describe("sequential", () => {
		it("should process items in sequence", async () => {
			const order: number[] = [];
			const tasks = Array(3)
				.fill(0)
				.map((_, i) => async () => {
					order.push(i);
					await sleep(50);
					return i * 2;
				});

			const results = await sequential(tasks);
			expect(results).toEqual([0, 2, 4]);
			expect(order).toEqual([0, 1, 2]);
		});

		it("should handle empty task list", async () => {
			const results = await sequential([]);
			expect(results).toEqual([]);
		});

		it("should stop on first error", async () => {
			const order: number[] = [];
			const tasks = [
				async () => {
					order.push(1);
					return 1;
				},
				async () => {
					order.push(2);
					throw new Error("Task 2 failed");
				},
				async () => {
					order.push(3);
					return 3;
				},
			];

			await expect(sequential(tasks)).rejects.toThrow("Task 2 failed");
			expect(order).toEqual([1, 2]); // Third task should not execute
		});
	});

	describe("createDeferred", () => {
		it("should allow external resolution", async () => {
			const deferred = createDeferred<string>();
			setTimeout(() => deferred.resolve("done"), 100);
			const result = await deferred.promise;
			expect(result).toBe("done");
		});

		it("should allow external rejection", async () => {
			const deferred = createDeferred<string>();
			setTimeout(() => deferred.reject(new Error("failed")), 100);
			await expect(deferred.promise).rejects.toThrow("failed");
		});

		it("should handle immediate resolution", async () => {
			const deferred = createDeferred<string>();
			deferred.resolve("instant");
			const result = await deferred.promise;
			expect(result).toBe("instant");
		});

		it("should handle immediate rejection", async () => {
			const deferred = createDeferred<string>();
			deferred.reject(new Error("instant fail"));
			await expect(deferred.promise).rejects.toThrow("instant fail");
		});
	});

	describe("makeCancellable", () => {
		it("should resolve normally if not cancelled", async () => {
			const promise = sleep(100).then(() => "done");
			const { promise: cancellable } = makeCancellable(promise);
			const result = await cancellable;
			expect(result).toBe("done");
		});

		it("should reject when cancelled", async () => {
			const promise = sleep(200).then(() => "done");
			const { promise: cancellable, cancel } = makeCancellable(promise);

			setTimeout(cancel, 100);
			await expect(cancellable).rejects.toThrow("Promise was cancelled");
		});

		it("should handle immediate cancellation", async () => {
			const promise = sleep(100).then(() => "done");
			const { promise: cancellable, cancel } = makeCancellable(promise);
			cancel();
			await expect(cancellable).rejects.toThrow("Promise was cancelled");
		});

		it("should handle cancellation of already rejected promise", async () => {
			const promise = Promise.reject(new Error("Original error"));
			const { promise: cancellable, cancel } = makeCancellable(promise);
			cancel();
			await expect(cancellable).rejects.toThrow("Promise was cancelled");
		});
	});

	describe("withExtendableTimeout", () => {
		it("should resolve if completed within timeout", async () => {
			const promise = sleep(100).then(() => "done");
			const { promise: withTimeout } = withExtendableTimeout(promise, 200);
			const result = await withTimeout;
			expect(result).toBe("done");
		});

		it("should reject if timeout reached", async () => {
			const promise = sleep(300).then(() => "done");
			const { promise: withTimeout } = withExtendableTimeout(promise, 100);
			await expect(withTimeout).rejects.toThrow("Operation timed out");
		});

		it("should allow extending timeout", async () => {
			const promise = sleep(300).then(() => "done");
			const { promise: withTimeout, resetTimeout } = withExtendableTimeout(promise, 200);

			// Extend timeout after 150ms
			setTimeout(resetTimeout, 150);

			const result = await withTimeout;
			expect(result).toBe("done");
		});

		it("should use custom error message", async () => {
			const promise = sleep(200);
			const { promise: withTimeout } = withExtendableTimeout(promise, 100, "Custom timeout");
			await expect(withTimeout).rejects.toThrow("Custom timeout");
		});

		it("should handle multiple timeout resets", async () => {
			const promise = sleep(400).then(() => "done");
			const { promise: withTimeout, resetTimeout } = withExtendableTimeout(promise, 200);

			// Reset timeout multiple times
			setTimeout(resetTimeout, 150);
			setTimeout(resetTimeout, 250);
			setTimeout(resetTimeout, 350);

			const result = await withTimeout;
			expect(result).toBe("done");
		});

		it("should handle immediate resolution", async () => {
			const promise = Promise.resolve("instant");
			const { promise: withTimeout } = withExtendableTimeout(promise, 100);
			const result = await withTimeout;
			expect(result).toBe("instant");
		});
	});
});
