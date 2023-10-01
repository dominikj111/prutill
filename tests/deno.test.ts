import { assertEquals } from "https://deno.land/std@0.203.0/assert/assert_equals.ts";
import { getLastPromise } from "../index.ts";

const promiseStackResult = getLastPromise("a", new Promise(() => undefined));
getLastPromise("a", new Promise(() => undefined));
getLastPromise("a", new Promise(r => r(1)));

assertEquals(await promiseStackResult, 1);
assertEquals(await getLastPromise("a", new Promise(r => r(2))), 2);

// eslint-disable-next-line no-console
console.log("√ Module is able to run in Deno");
