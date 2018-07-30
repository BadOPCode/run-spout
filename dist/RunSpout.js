"use strict";
/**
 * Run Spout
 * Shawn Rapp - 7/28/2018
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATES = {
    Pause: "pause",
    Run: "run",
    Stop: "stop",
};
var RunSpout = /** @class */ (function () {
    function RunSpout() {
        this.pollingTime = 500;
        this._runStack = {};
        this._state = "stop";
        this.spectate = this.spectate.bind(this);
    }
    RunSpout.prototype.spectate = function () {
        var _this = this;
        if (this._state === exports.STATES.Run) {
            Object.keys(this._runStack).forEach(function (label) {
                if (_this._runStack[label].whenToFire < (new Date()).getTime()) {
                    if (typeof _this._runStack[label].callbackFunction === "function") {
                        _this._runStack[label].callbackFunction();
                    }
                    _this.killTask(label);
                    return;
                }
            });
        }
        if (this._state !== exports.STATES.Stop) {
            setTimeout(this.spectate, this.pollingTime);
        }
    };
    Object.defineProperty(RunSpout.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    RunSpout.prototype.run = function () {
        this._state = exports.STATES.Run;
        this.spectate();
    };
    RunSpout.prototype.pause = function () {
        this._state = exports.STATES.Pause;
    };
    RunSpout.prototype.stop = function () {
        this._state = exports.STATES.Stop;
    };
    RunSpout.prototype.addTask = function (newTask) {
        this._runStack[newTask.label] = newTask;
    };
    RunSpout.prototype.killTask = function (label) {
        delete this._runStack[label];
    };
    RunSpout.prototype.doesTaskExists = function (label) {
        return !!this._runStack[label];
    };
    RunSpout.prototype.calculateEventFireTime = function (delay) {
        return (new Date()).getTime() + delay;
    };
    RunSpout.prototype.createTask = function (label, delay, callbackFunction) {
        return {
            callbackFunction: callbackFunction,
            label: label,
            whenToFire: this.calculateEventFireTime(delay),
        };
    };
    RunSpout.prototype.makeNewTask = function (label, delay, callbackFunction) {
        this.addTask(this.createTask(label, delay, callbackFunction));
    };
    return RunSpout;
}());
exports.RunSpout = RunSpout;
//# sourceMappingURL=RunSpout.js.map