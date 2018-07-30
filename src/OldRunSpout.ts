/**
 * OldRunSpout.ts
 * A compatible class to prior 1.0 version
 */
import { RunSpout, STATES } from "./RunSpout";

export class OldRunSpout extends RunSpout {
    public static STATES = STATES;

    public TASK = {
        create: this.taskCreateTask,
    };

    public kill() {
        this.stop();
    }

    public calculateFireTime(delay: number): number {
        return this.calculateEventFireTime(delay);
    }

    public taskCreateTask(label: string, delay: number, callbackFunction: () => void) {
        return this.createTask(label, delay, callbackFunction);
    }
}

export * from "./RunSpout";
export default new OldRunSpout();
