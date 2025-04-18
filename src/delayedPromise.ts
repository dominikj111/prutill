/**
 * Creates a promise that resolves after a specified delay.
 * Optionally, can pass through a value that will be resolved after the delay.
 *
 * @example
 * // Resolve after 1 second
 * const delayed = new DelayedPromise(1000);
 * await delayed; // resolves after 1 second
 *
 * // Pass through a value after delay
 * const delayedValue = new DelayedPromise(1000, "hello");
 * const value = await delayedValue; // resolves to "hello" after 1 second
 */
class DelayedPromise<T> {
	private promise: Promise<T | undefined>;

	constructor(delay = 0, passThrough?: T) {
		this.promise = new Promise<T | undefined>(resolve => {
			setTimeout(() => {
				resolve(passThrough);
			}, delay);
		});
	}

	then<T>(onFulFilled: (_?: T) => T | undefined): Promise<T | undefined> {
		return this.promise.then(r => onFulFilled(r as T | undefined));
	}
}

export default DelayedPromise;
