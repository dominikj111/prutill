import { promiseWrapper } from "./promiseWrapper";

describe("promiseWrapper", () => {
	it("should wrap synchronous function result in a promise", async () => {
		const result = await promiseWrapper(() => 42);
		expect(result).toBe(42);
	});

	it("should handle async function", async () => {
		const result = await promiseWrapper(async () => {
			return new Promise(resolve => setTimeout(() => resolve(42), 10));
		});
		expect(result).toBe(42);
	});

	it("should propagate synchronous errors", async () => {
		await expect(
			promiseWrapper(() => {
				throw new Error("Test error");
			}),
		).rejects.toThrow("Test error");
	});

	it("should propagate asynchronous errors", async () => {
		await expect(
			promiseWrapper(async () => {
				throw new Error("Async test error");
			}),
		).rejects.toThrow("Async test error");
	});
});
