# 🚀 prutill

[![npm](https://img.shields.io/npm/v/prutill)](https://www.npmjs.com/package/prutill)
[![dependencies](https://img.shields.io/badge/production%20dependencies-0-brightgreen.svg)](https://github.com/dominikj111/prutill/blob/main/package.json)
[![Coverage Status](https://coveralls.io/repos/boennemann/badges/badge.svg)](https://coveralls.io/r/boennemann/badges)
[![License](https://img.shields.io/github/license/dominikj111/prutill)](https://github.com/dominikj111/prutill/blob/main/LICENSE)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dominikj111/prutill/issues)

> A lightweight, environment-agnostic, production-ready Promise utility library for managing concurrent Promise
> executions and their side effects.

## ✨ Features

- 🌐 **Last Promise Resolution** - Ensures only the most recent Promise affects your application state
- 🏃‍♂️ **Race Promise Resolution** - Acts on the first resolved Promise while managing others
- 🕒 **Timed Promises** - Create Promises that resolve after a specified timeout
- 🔄 **Promise Wrapper** - Wraps synchronous or asynchronous functions into Promises
- 🏗️ **Zero Dependencies** - Lightweight and focused functionality
- 🔒 **Type-Safe** - Written in TypeScript with full type definitions
- 🧪 **Well Tested** - Comprehensive test coverage

## 🛠️ Installation

### Node.js / Bundlers

```bash
# Using npm
npm install prutill

# Using yarn
yarn add prutill

# Using pnpm
pnpm add prutill
```

### Deno

```typescript
import {
    getLastPromise,
    getRaceWonPromise,
    DelayedPromise,
} from "https://raw.githubusercontent.com/dominikj111/prutill/refs/tags/v1.2.0/mod.js";
```

## 📦 Supported Environments

- ✅ Node.js (CommonJS)
- ✅ ES Modules
- ✅ Deno
- ✅ Browsers

## 💡 Usage

### Last Promise Resolution

Useful for scenarios where you only want to act on the most recent Promise, like in React's useEffect:

```typescript
import { getLastPromise } from "prutill";

// React example
useEffect(() => {
    getLastPromise("data-fetch", fetchData()).then(data => {
        // Only the latest fetch will update the state
        setState(data);
    });
}, [dependency1, dependency2]);
```

### Race Promise Resolution

When you want to act on the first resolved Promise:

```typescript
import { getRaceWonPromise } from "prutill";

// Multiple API endpoints example
getRaceWonPromise("fastest-api", fetch("api1")).then(data => {
    // First resolved API response wins
    processData(data);
});
getRaceWonPromise("fastest-api", fetch("api2"));
```

### Timed Promise

Create Promises that resolve after a specific duration:

```typescript
import { DelayedPromise } from "prutill";

// Resolve after 500ms
new DelayedPromise(500).then(() => {
    console.log("500ms passed");
});

// Resolve with value after 1000ms
new DelayedPromise(1000, "Hello").then(value => {
    console.log(value); // Outputs: "Hello"
});
```

### Promise Wrapper

Wrap any synchronous or asynchronous function into a Promise:

```typescript
import { promiseWrapper } from "prutill";

// Wrap a synchronous function
const result1 = await promiseWrapper(() => 42);
console.log(result1); // 42

// Wrap an asynchronous function
const result2 = await promiseWrapper(async () => {
    const response = await fetch("https://api.example.com/data");
    return response.json();
});

// Error handling
try {
    await promiseWrapper(() => {
        throw new Error("Something went wrong");
    });
} catch (error) {
    console.error(error); // Error: Something went wrong
}
```

## 📚 API Documentation

### getLastPromise<T>(key: string, promise: Promise<T>, resolveAllPrevious = true): Promise<T>

- `key`: Unique identifier for the promise stack
- `promise`: Promise to add to the stack
- `resolveAllPrevious`: If true, resolves all previous promises with the latest value

### getRaceWonPromise<T>(key: string, promise: Promise<T>, resolveAllOthers = true): Promise<T>

- `key`: Unique identifier for the promise race
- `promise`: Promise to add to the race
- `resolveAllOthers`: If true, resolves all other promises with the winning value

### DelayedPromise<T>

- `constructor(timeout: number, passThrough?: T)`
- `timeout`: Time in milliseconds before the promise resolves
- `passThrough`: Optional value to resolve with

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

Apache-2.0 © dominikj111

This library is licensed under the Apache License, Version 2.0. You may obtain a copy of the License at
<http://www.apache.org/licenses/LICENSE-2.0>

---

<div align="center">
Made with ❤️ because I love coding
</div>
