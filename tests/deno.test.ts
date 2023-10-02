// @ts-expect-error: Deno import
import { assertEquals } from "https://deno.land/std@0.203.0/assert/assert_equals.ts";
// @ts-expect-error: Deno import
import { getLastPromise } from "../index-deno.ts";

// @ts-expect-error: Deno is available, but can't share tsconfig effectivelly between deno and normal application
Deno.test("getLastPromise is available in Deno runtime and works well", async () => {
	const promiseStackResult = getLastPromise("a", new Promise(() => undefined));
	getLastPromise("a", new Promise(() => undefined));
	getLastPromise("a", new Promise(r => r(1)));

	assertEquals(await promiseStackResult, 1);
	assertEquals(await getLastPromise("a", new Promise(r => r(2))), 2);
	assertEquals(await getLastPromise("b", new Promise(r => r(3))), 3);
});
