import { AsyncTest, Expect, Test, TestCase, TestFixture, Timeout } from "alsatian";

import { RunSpout, STATES } from "../RunSpout";

@TestFixture("RunSpout Class")
export class TestRunSpout {
    public specRS: RunSpout;

    constructor() {
        this.specRS = new RunSpout();
    }

    @Test("Initializing")
    public initTest() {
        Expect(this.specRS).toBeDefined();
        Expect(this.specRS.state).toBe(STATES.Stop);
    }

    @Test("State switching")
    public stateSwitchTest() {
        this.specRS.run();
        Expect(this.specRS.state).toBe(STATES.Run);

        this.specRS.pause();
        Expect(this.specRS.state).toBe(STATES.Pause);

        this.specRS.stop();
        Expect(this.specRS.state).toBe(STATES.Stop);
    }

    @Test("addTask, killTask and taskExists")
    public addTaskTest() {
        let exists = this.specRS.doesTaskExists("test");
        Expect(exists).toBe(false);

        this.specRS.addTask({
            callbackFunction: () => {},
            label: "test",
            whenToFire: 10000,
        });
        exists = this.specRS.doesTaskExists("test");
        Expect(exists).toBe(true);

        this.specRS.killTask("test");
        exists = this.specRS.doesTaskExists("test");
        Expect(exists).toBe(false);
    }

    @Test("makeNewTask (addTask, createTask, calculateEventFireTime)")
    public makeNewTaskTest() {
        this.specRS.makeNewTask("test2", 1000, () => {});
        const exists = this.specRS.doesTaskExists("test2");
        Expect(exists).toBe(true);
    }

    @AsyncTest("Test task execution")
    @Timeout(1000)
    public spectateTest() {
        return new Promise((resolve, reject) => {
            this.specRS.run();
            this.specRS.makeNewTask("test3", 500, () => {
                resolve({});
            });

        });
    }
}
