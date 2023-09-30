/**
 * A builder of promise wrapper function which acts based on lastly added promise.
 *
 * By default, previously added promises are resolved with the lastly added value,
 * so any previously added promise is resolved with latest value.
 * This may be changed by setting `resolveAllPrevious` to false.
 *
 * This solves the problem where multiple same promises are made,
 * but previously added didn't resolve yet or some previous may be quicker.
 * Especially for React where we creating promises in useEffect hook,
 * but we want to act on single last promise.
 *
 * Example of usage:
 * ```
 * // it build the single stack function wrapper to stack promises
 * const lastPromiseReactor = stackBuilder();
 *
 * // PromiseX is added to the stack and then function acts on it,
 * // once the lastPromiseReactor is called again with different promise,
 * // "then" function will act on the lastly added one
 * lastPromiseReactor(...PromiseX...).then(...);
 * ```
 *
 * @returns A single stack function wrapper.
 */
export function stackBuilder<T>(resolveAllPrevious = true): (_: Promise<T>) => Promise<T> {
	let storedResolveCallbacks: ((_value: T) => void)[] = [];
	let storedPromises: Promise<T>[] = [];

	return async promise => {
		storedPromises.push(promise);

		const promiseWithId = {
			id: storedPromises.length,
			promise,
		};

		return new Promise((resolve, reject) => {
			if (resolveAllPrevious) {
				storedResolveCallbacks.push(resolve);
			}

			// act on any promise
			promiseWithId.promise.then(result => {
				// act on the last promise
				if (promiseWithId.id === storedPromises.length) {
					if (resolveAllPrevious) {
						for (let i = 0; i < storedResolveCallbacks.length; i++) {
							storedResolveCallbacks[i](result);
						}
					} else {
						resolve(result);
					}
					storedPromises = [];
					storedResolveCallbacks = [];
				}
			}, reject);
		});
	};
}

const storedPromiseStacks: Record<string, (_: Promise<unknown>) => Promise<unknown>> = {};

/**
 * Provides builded stackBuilder tied to unique key.
 *
 * @returns A single stack function wrapper by unique key
 */
export function getLastPromise<T>(key: string, promise: Promise<T>, resolveAllPrevious = true): Promise<T> {
	if (storedPromiseStacks[key] === undefined) {
		storedPromiseStacks[key] = stackBuilder<T>(resolveAllPrevious) as (_: Promise<unknown>) => Promise<unknown>;
	}

	return storedPromiseStacks[key](promise) as Promise<T>;
}

/**
 * A builder of promise wrapper function which acts acording to first finished promise.
 *
 * By default, previously added promises are resolved with the first resolved value,
 * so any previously added promise is resolved with this value as well.
 * This may be changed by setting `resolveAllOthers` to false.
 *
 * This solves the problem where multiple same promises are made and some may be quicker.
 * We suppose that first finished promise talk for all added ones and the rest will be finished with same value.
 *
 * Example of usage:
 * ```
 * // it build the single stack function wrapper to stack promises
 * const promiseInRace = raceBuilder();
 *
 * // PromiseX is added to the stack and then function acts on it,
 * // once the promiseInRace is called again with different promise,
 * // "then" function will act based on first finished promise
 * promiseInRace(...PromiseX...).then(...);
 * ```
 *
 * @returns A single stack function wrapper.
 */
export function raceBuilder<T>(resolveAllOthers = true): (_: Promise<T>) => Promise<T> {
	let storedResolveCallbacks: ((_value: T) => void)[] = [];
	let resolving = false;

	return async promise => {
		return new Promise(resolve => {
			if (resolveAllOthers) {
				storedResolveCallbacks.push(resolve);
			}

			promise.then(result => {
				if (resolving) {
					return;
				} else {
					resolving = true;
				}

				if (resolveAllOthers) {
					for (let i = 0; i < storedResolveCallbacks.length; i++) {
						storedResolveCallbacks[i](result);
					}
				} else {
					resolve(result);
				}

				storedResolveCallbacks = [];
				resolving = false;
			});
		});
	};
}

const storedPromiseRaces: Record<string, (_: Promise<unknown>) => Promise<unknown>> = {};

/**
 * Provides builded raceBuilder tied to unique key.
 *
 * @returns A single stack function wrapper by unique key
 */
export function getRaceWonPromise<T>(key: string, promise: Promise<T>, resolveAllOthers = true): Promise<T> {
	if (storedPromiseRaces[key] === undefined) {
		storedPromiseRaces[key] = raceBuilder<T>(resolveAllOthers) as (_: Promise<unknown>) => Promise<unknown>;
	}

	return storedPromiseRaces[key](promise) as Promise<T>;
}
