/**
 * Promise utility functions for common async operations
 */

import { promiseWrapper } from "./promiseWrapper";

/**
 * Sleep for a specified number of milliseconds
 */
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry a promise-returning function with specified attempts and delay
 */
export const retry = async <T>(fn: () => T | Promise<T>, attempts: number = 3, delay: number = 1000): Promise<T> => {
	try {
		return await promiseWrapper(fn);
	} catch (error) {
		if (attempts <= 1) throw error;
		await sleep(delay);
		return retry(fn, attempts - 1, delay);
	}
};

/**
 * Add timeout to a promise
 */
export const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string): Promise<T> => {
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => reject(new Error(errorMessage || `Operation timed out after ${timeoutMs}ms`)), timeoutMs);
	});
	return Promise.race([promise, timeoutPromise]);
};

/**
 * Execute promises sequentially
 */
export const sequential = async <T>(promises: (() => Promise<T>)[]): Promise<T[]> => {
	const results: T[] = [];
	for (const createPromise of promises) {
		results.push(await createPromise());
	}
	return results;
};

/**
 * Creates a deferred promise that can be resolved/rejected outside the promise constructor
 */
export const createDeferred = <T>() => {
	let resolve!: (_: T | PromiseLike<T>) => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let reject!: (_reason?: any) => void;

	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
};

/**
 * Wraps a promise to make it cancellable
 */
export const makeCancellable = <T>(promise: Promise<T>) => {
	let isCancelled = false;

	const wrappedPromise = new Promise<T>((resolve, reject) => {
		promise.then(
			value => (isCancelled ? reject(new Error("Promise was cancelled")) : resolve(value)),
			error => (isCancelled ? reject(new Error("Promise was cancelled")) : reject(error)),
		);
	});

	return {
		promise: wrappedPromise,
		cancel: () => {
			isCancelled = true;
		},
	};
};

/**
 * Adds a timeout that can be extended/reset
 */
export const withExtendableTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string) => {
	let timeoutId: number | ReturnType<typeof setTimeout>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let reject!: (_reason?: any) => void;

	const resetTimeout = () => {
		clearTimeout(timeoutId as number);
		timeoutId = setTimeout(
			() => reject(new Error(errorMessage || `Operation timed out after ${timeoutMs}ms`)),
			timeoutMs,
		);
	};

	const promiseRace = Promise.race([
		promise,
		new Promise((_, rej) => {
			reject = rej;
			resetTimeout();
		}),
	]);

	return {
		promise: promiseRace,
		resetTimeout,
	};
};
