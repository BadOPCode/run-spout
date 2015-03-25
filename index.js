#!/usr/bin/env node
'use strict';
/**
 * Run Spout
 * Shawn Rapp - 3/16/2015
 */

var run_stack = {};
var state;

function spectate() {
    if (state == "run") {
        Object.keys(run_stack).forEach(function(label){
            if (run_stack[label].fire_event < (new Date()).getTime()) {
//                console.log(label);
                if(typeof run_stack[label].cb_event === "function") run_stack[label].cb_event();
//                run_stack[label] = {};
                delete run_stack[label];
                return;
            }
        });
    }
    
    if (state != "close")
        setTimeout(spectate, 500);
}

function run() {
    state = "run";
    spectate();
}

function pause() {
    state = "pause";    
}

function kill() {
    state = "close";
}

function addTask(task_obj) {
    run_stack[task_obj.label] = { fire_event: task_obj.fire_event, cb_event: task_obj.cb_event };
}

function killTask(task_label){
}

function calculateFireTime(delay) {
    return (new Date).getTime() + delay;    
}

function taskCreateTask(label, delay, cb_event){
    return {
        label: label,
        fire_event: calculateFireTime(delay),
        cb_event: cb_event
    };
}

module.exports = {
    STATES: ["run", "pause", "close"],
    TASK: {
        create: taskCreateTask
    },
    addTask: addTask,
    killTask: killTask,
    run: run,
    pause: pause,
    kill: kill,
};

//spectate();