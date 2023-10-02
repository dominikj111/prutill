class TimedPromise {
    constructor(timeout = 0, passThrough) {
        this.promise = new Promise(resolve => {
            setTimeout(() => {
                resolve(passThrough);
            }, timeout);
        });
    }
    then(onFulFilled) {
        return this.promise.then(r => onFulFilled(r));
    }
}
export default TimedPromise;
//# sourceMappingURL=timedPromise.js.map