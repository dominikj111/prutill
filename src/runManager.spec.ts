import { raceBuilder, stackBuilder, getLastPromise, getRaceWonPromise } from "./runManager";

describe("singleStackPromiseBuilder provides a stack builder to stack promises", () => {
	it("should resolve lastly added promise", async () => {
		const fn = stackBuilder<number>();
		let result: Promise<number>;

		result = fn(new Promise(() => undefined));
		result = fn(new Promise(() => undefined));
		result = fn(new Promise(() => undefined));
		result = fn(new Promise(r => r(2)));

		expect(await result).toBe(2);

		result = fn(new Promise(r => r(1)));

		expect(await result).toBe(1);
	});

	it("should resolve only the current promise when resolveAllPrevious is false", async () => {
		const fn = stackBuilder<number>(false);
		let _result1: Promise<number>;
		let result2: Promise<number>;

		_result1 = fn(new Promise(() => undefined));
		result2 = fn(new Promise(r => r(2)));

		expect(await result2).toBe(2);

		// result1 should not be resolved with the value from result2
		// We can't directly test an unresolved promise, but we can test that
		// a new promise gets resolved correctly
		const result3 = fn(new Promise(r => r(3)));
		expect(await result3).toBe(3);
	});
});

describe("getLastPromise provides lastly added promises by it's unique key", () => {
	it("wraps builder to return lastly added promise", async () => {
		let resultA: Promise<number>;
		let resultB: Promise<number>;

		resultA = getLastPromise("a", new Promise(() => undefined));
		resultB = getLastPromise("b", new Promise(() => undefined));
		resultB = getLastPromise("b", new Promise(() => undefined));
		resultA = getLastPromise("a", new Promise(() => undefined));

		resultA = getLastPromise("a", new Promise(r => r(1)));

		expect(await resultA).toBe(1);

		resultB = getLastPromise("b", new Promise(() => undefined));
		resultB = getLastPromise("b", new Promise(r => r(2)));

		expect(await resultB).toBe(2);
	});

	it("returns lastly added promise by unique key without storing to the scoped variable", async () => {
		getLastPromise("a", new Promise(() => undefined));

		expect(await getLastPromise("a", new Promise(r => r(1)))).toBe(1);

		const result = await getLastPromise("a", new Promise(r => r(2)));
		expect(result).toBe(2);
	});

	it("should use resolveAllPrevious=false when specified", async () => {
		const _resultA = getLastPromise("test_key", new Promise(() => undefined), false);
		const resultB = getLastPromise("test_key", new Promise(r => r(42)), false);

		expect(await resultB).toBe(42);

		// Clear the stored promise stack for this key
		getLastPromise("test_key", Promise.resolve(0));
	});
});

describe("raceBuilder provides a collection builder to store promises in race", () => {
	it("should resolve with first resolved promise", async () => {
		const fn = raceBuilder<number>();
		let resolve: (_value: number) => void;
		let result: Promise<number>;

		result = fn(new Promise(() => undefined));
		fn(new Promise(r => (resolve = r)));
		fn(new Promise(() => undefined));
		fn(new Promise(() => undefined));

		// @ts-expect-error: resolve is defined
		resolve(3);

		expect(await result).toBe(3);

		result = fn(new Promise(r => r(1)));

		expect(await result).toBe(1);
	});

	it("should handle multiple promises resolving in quick succession", async () => {
		const fn = raceBuilder<number>();
		let resolve1: (_value: number) => void;
		let resolve2: (_value: number) => void;

		const result = fn(new Promise(r => (resolve1 = r)));
		fn(new Promise(r => (resolve2 = r)));

		// @ts-expect-error: resolve1 is defined
		resolve1(1);
		// This second resolve should be ignored since resolving=true at this point
		// @ts-expect-error: resolve2 is defined
		resolve2(2);

		expect(await result).toBe(1);
	});

	it("should handle race condition when multiple promises resolve simultaneously", async () => {
		const fn = raceBuilder<number>();
		let resolve1: (_value: number) => void;
		let resolve2: (_value: number) => void;

		const result = fn(new Promise(r => (resolve1 = r)));
		fn(new Promise(r => (resolve2 = r)));

		// Create a scenario where resolving flag might be true
		// @ts-expect-error: resolve1 is defined
		resolve1(1);

		// Force the resolving flag to be true when this executes
		// by resolving immediately after the first one
		// This should hit the if (resolving) { return; } branch
		// @ts-expect-error: resolve2 is defined
		resolve2(2);

		expect(await result).toBe(1);

		// Reset the state for other tests
		const cleanupResult = fn(new Promise(r => r(99)));
		await cleanupResult;
	});

	it("should only resolve the current promise when resolveAllOthers is false", async () => {
		const fn = raceBuilder<number>(false);
		let resolve: (_value: number) => void;

		const _result1 = fn(new Promise(() => undefined));
		const result2 = fn(new Promise(r => (resolve = r)));

		// @ts-expect-error: resolve is defined
		resolve(42);

		expect(await result2).toBe(42);

		// We can't directly test that result1 remains unresolved
		// But we can test that a new promise works correctly
		const result3 = fn(new Promise(r => r(99)));
		expect(await result3).toBe(99);
	});
});

describe("getRaceWonPromise provides a collection of promises in race by it's unique key", () => {
	it("wraps builder to return promises in race", async () => {
		let resultA: Promise<number>;
		let resultB: Promise<number>;

		let resolveA: (_value: number) => void;
		let resolveB: (_value: number) => void;

		resultA = getRaceWonPromise("a", new Promise(r => (resolveA = r)), true);
		resultB = getRaceWonPromise("b", new Promise(() => undefined));
		resultB = getRaceWonPromise("b", new Promise(() => undefined));
		resultB = getRaceWonPromise("b", new Promise(r => (resolveB = r)));
		resultB = getRaceWonPromise("b", new Promise(() => undefined));
		resultA = getRaceWonPromise("a", new Promise(() => undefined), true);
		resultA = getRaceWonPromise("a", new Promise(() => undefined), true);

		// @ts-expect-error: resolveA is defined
		resolveA(1);

		// @ts-expect-error: resolveB is defined
		resolveB(2);

		expect(await resultA).toBe(1);
		expect(await resultB).toBe(2);
	});

	it("returns single promise in race by unique key without storing to the scoped variable", async () => {
		getRaceWonPromise("a", new Promise(() => undefined));

		expect(await getRaceWonPromise("a", new Promise(r => r(1)))).toBe(1);

		const result = await getRaceWonPromise("a", new Promise(r => r(2)));
		expect(result).toBe(2);
	});

	it("returns promise in race by unique key without storing to the scoped variable", async () => {
		let resolve: (_value: string) => void;

		const result = getRaceWonPromise("a", new Promise(() => undefined));
		getRaceWonPromise("a", new Promise(r => (resolve = r)));

		// @ts-expect-error: resolveA is defined
		resolve("test");

		expect(await result).toBe("test");
	});

	it("should use resolveAllOthers=false when specified", async () => {
		let resolve: (_value: number) => void;

		const _result1 = getRaceWonPromise("test_race_key", new Promise(() => undefined), false);
		const result2 = getRaceWonPromise("test_race_key", new Promise(r => (resolve = r)), false);

		// @ts-expect-error: resolve is defined
		resolve(42);

		expect(await result2).toBe(42);

		// Clear the stored promise race for this key
		getRaceWonPromise("test_race_key", Promise.resolve(0));
	});
});
