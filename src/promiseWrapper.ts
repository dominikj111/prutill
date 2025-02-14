/**
 * Wraps a synchronous or asynchronous function into a Promise.
 * The function is executed immediately and its result is wrapped in a Promise.
 *
 * @param callback - Function to be executed and wrapped in a Promise
 * @returns Promise that resolves with the callback's return value
 */
export function promiseWrapper<T>(callback: () => T | Promise<T>): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		try {
			const result = callback();

			if (result instanceof Promise) {
				result.then(resolve).catch(reject);
			} else {
				resolve(result);
			}
		} catch (error) {
			reject(error);
		}
	});
}
