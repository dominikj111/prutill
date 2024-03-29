"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimedPromise = exports.getRaceWonPromise = exports.raceBuilder = exports.getLastPromise = exports.stackBuilder = void 0;
var runManager_1 = require("./src/runManager");
Object.defineProperty(exports, "stackBuilder", { enumerable: true, get: function () { return runManager_1.stackBuilder; } });
Object.defineProperty(exports, "getLastPromise", { enumerable: true, get: function () { return runManager_1.getLastPromise; } });
Object.defineProperty(exports, "raceBuilder", { enumerable: true, get: function () { return runManager_1.raceBuilder; } });
Object.defineProperty(exports, "getRaceWonPromise", { enumerable: true, get: function () { return runManager_1.getRaceWonPromise; } });
const timedPromise_1 = require("./src/timedPromise");
exports.TimedPromise = timedPromise_1.default;
//# sourceMappingURL=index.js.map