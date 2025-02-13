// eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
const { getLastPromise } = require("../dist_commonjs");

// eslint-disable-next-line no-undef
test("getLastPromise is available in Node.js runtime and works well", async () => {
	const promiseStackResult = getLastPromise("a", new Promise(() => undefined));
	getLastPromise("a", new Promise(() => undefined));
	getLastPromise("a", new Promise(r => r(1)));

	expect(await promiseStackResult).toBe(1);
	expect(await getLastPromise("a", new Promise(r => r(2)))).toBe(2);
	expect(await getLastPromise("b", new Promise(r => r(3)))).toBe(3);
});
