/**
 * OldRunSpout.ts
 * A compatible class to prior 1.0 version
 */
import { RunSpout, STATES } from "./RunSpout";

export class OldRunSpout extends RunSpout {
    public static STATES = STATES;

    public TASK = {
        create: (label: string, delay: number, callbackFunction: () => void) => {
            return super.createTask(label, delay, callbackFunction);
        },
    };

    public kill() {
        super.stop();
    }

    public calculateFireTime(delay: number): number {
        return super.calculateEventFireTime(delay);
    }

}

export * from "./RunSpout";
export default new OldRunSpout();
