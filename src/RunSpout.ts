/**
 * Run Spout
 * Shawn Rapp - 7/28/2018
 */

export interface ITask {
    label: string;
    whenToFire: number;
    callbackFunction: () => void;
}

export const STATES: {[key: string]: string} = {
    Pause: "pause",
    Run: "run",
    Stop: "stop",
};

export class RunSpout {
    public pollingTime: number = 500;
    private _runStack: {[key: string]: ITask} = {};
    private _state: string = "stop";

    constructor() {
        this.spectate = this.spectate.bind(this);
    }

    public spectate() {
        if (this._state === STATES.Run) {
            Object.keys(this._runStack).forEach((label: string) => {
                if (this._runStack[label].whenToFire < (new Date()).getTime()) {
                    if (typeof this._runStack[label].callbackFunction === "function") {
                        this._runStack[label].callbackFunction();
                    }
                    this.killTask(label);
                    return;
                }
            });
        }

        if (this._state !== STATES.Stop) {
            setTimeout(this.spectate, this.pollingTime);
        }
    }

    get state(): string {
        return this._state;
    }

    public run() {
        this._state = STATES.Run;
        this.spectate();
    }

    public pause() {
        this._state = STATES.Pause;
    }

    public stop() {
        this._state = STATES.Stop;
    }

    public addTask(newTask: ITask) {
        this._runStack[newTask.label] =  newTask;
    }

    public killTask(label: string) {
        delete this._runStack[label];
    }

    public doesTaskExists(label: string) {
        return !!this._runStack[label];
    }

    public calculateEventFireTime(delay: number): number {
        return (new Date()).getTime() + delay;
    }

    public createTask(label: string, delay: number, callbackFunction: () => void): ITask {
        return {
            callbackFunction,
            label,
            whenToFire: this.calculateEventFireTime(delay),
        };
    }

    public makeNewTask(label: string, delay: number, callbackFunction: () => void) {
        this.addTask(this.createTask(label, delay, callbackFunction));
    }
}
