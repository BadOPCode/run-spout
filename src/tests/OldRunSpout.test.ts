import { AsyncTest, Expect, Test, TestCase, TestFixture, Timeout } from "alsatian";

import { OldRunSpout, STATES } from "../OldRunSpout";

@TestFixture("RunSpout Class")
export class TestOldRunSpout {
    public specRS: OldRunSpout;

    constructor() {
        this.specRS = new OldRunSpout();
    }

    // All the new tests should pass
    @Test("Initializing")
    public initTest() {
        Expect(this.specRS).toBeDefined();
        Expect(this.specRS.state).toBe(STATES.Stop);
    }

    @Test("New interface for state switching")
    public stateSwitchTest() {
        this.specRS.run();
        Expect(this.specRS.state).toBe(STATES.Run);

        this.specRS.pause();
        Expect(this.specRS.state).toBe(STATES.Pause);

        this.specRS.stop();
        Expect(this.specRS.state).toBe(STATES.Stop);
    }

    @Test("Old interface for state switching")
    public oldStateSwitchTest() {
        this.specRS.run();
        Expect(this.specRS.state).toBe(STATES.Run);

        this.specRS.pause();
        Expect(this.specRS.state).toBe(STATES.Pause);

        this.specRS.kill();
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
                resolve();
            });

        });
    }

}
