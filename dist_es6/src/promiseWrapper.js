export function promiseWrapper(e){return new Promise(((r,t)=>{try{const n=e();n instanceof Promise?n.then(r).catch(t):r(n)}catch(e){t(e)}}))}
//# sourceMappingURL=promiseWrapper.js.map