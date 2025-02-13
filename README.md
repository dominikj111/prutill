[![GitHub version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.1.0&x2=0)](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.1.0&x2=0)
[![codecov](https://codecov.io/gh/dominikj111/prutill/branch/main/graph/badge.svg)](https://codecov.io/gh/dominikj111/prutill)
[![Coverage Status](https://coveralls.io/repos/boennemann/badges/badge.svg)](https://coveralls.io/r/boennemann/badges)
[![dependency status](https://deps.rs/crate/autocfg/1.1.0/status.svg)](https://deps.rs/crate/autocfg/1.1.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

# prutill

A lightweight, environment-agnostic, production-ready Promise utility library for managing concurrent Promise executions
and their side effects.

## Features

- **Last Promise Resolution** - Ensures only the most recent Promise affects your application state
- **Race Promise Resolution** - Acts on the first resolved Promise while managing others
- **Timed Promises** - Create Promises that resolve after a specified timeout
- **Environment Agnostic** - Works in Node.js, Deno, browsers, and bundlers
- **Zero Dependencies** - Lightweight and focused functionality
- **Type Safe** - Written in TypeScript with full type definitions

## Installation

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

## Usage

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

## API Documentation

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

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTION.md) for details.

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

## Status

- Production Ready
- Full Test Coverage
- TypeScript Support
- Cross-Platform Support
