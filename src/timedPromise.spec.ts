import TimedPromise from "./timedPromise";

describe("TimedPromise provides a Promise object what resolve after timeout", () => {
	beforeAll(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it("should to by resolved after expired time", async () => {
		const resolvedValue = jest.fn();

		const promise = new TimedPromise(500).then(r => resolvedValue(r));

		jest.runAllTimers();
		await promise;

		expect(resolvedValue).toHaveBeenCalledTimes(1);
		expect(resolvedValue).toHaveBeenCalledWith(undefined);
	});

	it("allows to pass through value", async () => {
		const resolvedValue = jest.fn();

		const promise = new TimedPromise(500, "Hello").then(r => resolvedValue(r));

		jest.runAllTimers();
		await promise;

		expect(resolvedValue).toHaveBeenCalledTimes(1);
		expect(resolvedValue).toHaveBeenCalledWith("Hello");
	});
});
