<!-- markdownlint-disable MD041 -->

[![GitHub version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.0.1&x2=0)](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=1.0.1&x2=0)
[![Coverage Status](https://coveralls.io/repos/boennemann/badges/badge.svg)](https://coveralls.io/r/boennemann/badges)
[![dependency status](https://deps.rs/crate/autocfg/1.1.0/status.svg)](https://deps.rs/crate/autocfg/1.1.0)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/dwyl/esta/issues)

# What is it?

**Not React.js only** Promise utilities to improve multiple Promise processing.

The orignal inspiration went from the issue in React.js application I had, where the `useEffect` watched multiple variables triggered multiple promises which each of one ran `then` action. If latest promise has been quicker, the earlier less relevant had main effect upon the application state.

Ready to be used in Deno and Node.js. To see more details how to use it, please check related unit tests in `./src/*.spec.ts` and tests in `./tests` folder.

## Deno example

`deno test https://raw.githubusercontent.com/dominikj111/prutill/main/tests/deno.test.ts` or

`deno test https://raw.githubusercontent.com/dominikj111/prutill/main/tests/deno.test.js`

## How to get it on Node.js, Bun?

`npm i prutill`, `bun add prutill`

`bun test` doesn't work as expected with this library as there are Deno tests included and `timedPromise.spec.ts` also doesn't pass due to [bun/issues/3594](https://github.com/oven-sh/bun/issues/3594).

# Problems to solve

As a develoer, I want:

- To make multiple promises, but act on latestly added only.

```ts
import { getLastPromise } from "prutill";

...

React.useEffect(() => {
    getLastPromise("my_data_processing_promise_stack", /* Promise, fetch or anything what returns promise */).then(data => {
        // Do something with data from last promise/update
    });
}, [ state.var_1, state.var_2, state.var_3 ]);

...
```

- To make multiple promises, but act on the quickest one.

```ts
import { getRaceWonPromise } from "prutill";

...

React.useEffect(() => {
    getRaceWonPromise("my_data_processing_promise_race", fetch(...) /* Promise, fetch or anything what returns promise */).then(data => {
        // Do something with data from first resolved promise/update
    });
}, [ state.var_1, state.var_2, state.var_3 ]);

...
```

- To get the resolved promise after spicific time.

```ts
import { TimedPromise } from "prutill";

new TimedPromise(500).then(r => r === 500);
```

# Possible improvements when requested

:black_square_button: Add bundling to import from CDN (vanilla js) -> umd, esm

:black_square_button: Improve Continuous Integration

:black_square_button: Add Changelog, Code of Conduct

:black_square_button: Automatic testing and linting
