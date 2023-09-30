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
});
