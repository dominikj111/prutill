class TimedPromise<T> {
	private promise: Promise<T | undefined>;

	constructor(timeout = 0, passThrough?: T) {
		this.promise = new Promise<T | undefined>(resolve => {
			setTimeout(() => {
				resolve(passThrough);
			}, timeout);
		});
	}

	then<T>(onFulFilled: (_?: T) => T | undefined): Promise<T | undefined> {
		return this.promise.then(r => onFulFilled(r as T | undefined));
	}
}

export default TimedPromise;
