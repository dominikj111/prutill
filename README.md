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
    TimedPromise,
} from "https://raw.githubusercontent.com/dominikj111/prutill/main/index-deno.ts";
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
import { TimedPromise } from "prutill";

// Resolve after 500ms
new TimedPromise(500).then(() => {
    console.log("500ms passed");
});

// Resolve with value after 1000ms
new TimedPromise(1000, "Hello").then(value => {
    console.log(value); // Outputs: "Hello"
});
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

### TimedPromise<T>

- `constructor(timeout: number, passThrough?: T)`
- `timeout`: Time in milliseconds before the promise resolves
- `passThrough`: Optional value to resolve with

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

## 📈 Status

- Production Ready
- Full Test Coverage
- TypeScript Support
- Cross-Platform Support

---

<div align="center">
Made with ❤️ because I love coding
</div>
