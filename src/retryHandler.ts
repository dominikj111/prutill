/**
 * Retry running a promise until it ultimately succeeds or fails
 * @param {Promise} promise - The promise method to run
 * @param {Object} opts - The options: args, validationCheck, retryTimeout, retryAdjustmentFactor, maxAttempts
 * @returns {Promise} The resolve or rejected promise
 */
function retryPromise(promise, opts) {
    if (!opts.validationCheck) throw new Error('Please supply a validation callback function for this action');

    return new Promise((resolve, reject) => {
        const retryOpts = {
            args: opts.args || {},
            validationCheck: opts.validationCheck,
            retryTimeout: opts.retryTimeout || 10000,
            timeoutAdjustment: opts.timeoutAdjustment || 0,
            maxRetryAttempts: opts.maxRetryAttempts || 5,
            currentAttempt: 1,
            resolve,
            reject
        };

        retryAction(promise, retryOpts);
    });
}

function retryAction(action, retryOpts) {
    const maxAttempts = retryOpts.maxRetryAttempts;

    console.log(`Trying "${action.name}" action, attempt ${retryOpts.currentAttempt} of ${maxAttempts}.`);

    action(retryOpts.args)
        .then(retryOpts.validationCheck)
        .then(result => {
            console.log(`Action "${action.name}" successful on attempt ${retryOpts.currentAttempt} of ${maxAttempts}!`);

            retryOpts.resolve(result);
        })
        .catch(err => {
            const failMsg = `Action "${action.name}" attempt ${retryOpts.currentAttempt} of ${maxAttempts} failed: ${err}`;

            if (retryOpts.currentAttempt < maxAttempts) {
                console.log(failMsg);

                retryOpts.retryTimeout = (retryOpts.retryTimeout * retryOpts.timeoutAdjustment) + retryOpts.retryTimeout;
                retryOpts.currentAttempt += 1;

                console.log(`Retrying "${action.name}" action in ${retryOpts.retryTimeout}ms.`);

                setTimeout(() => retryAction(action, retryOpts), retryOpts.retryTimeout);
            } else if (retryOpts.currentAttempt >= maxAttempts) {
                console.error(failMsg);
                console.error(`Action "${action.name}" maximum allowed retries exceeded. Bailing out!`);

                retryOpts.reject(err);
            }
        });
}

module.exports = retryPromise;