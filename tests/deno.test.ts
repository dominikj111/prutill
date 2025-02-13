/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { assertEquals } from "https://deno.land/std@0.203.0/assert/assert_equals.ts";
import { getLastPromise } from "../index-deno.ts";

Deno.test("getLastPromise is available in Deno runtime as TS and works well", async () => {
	const promiseStackResult = getLastPromise("a", new Promise(() => undefined));
	getLastPromise("a", new Promise(() => undefined));
	getLastPromise("a", new Promise(r => r(1)));

	assertEquals(await promiseStackResult, 1);
	assertEquals(await getLastPromise("a", new Promise(r => r(2))), 2);
	assertEquals(await getLastPromise("b", new Promise(r => r(3))), 3);
});
