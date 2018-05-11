const timeUtils = require('../utils/time-utils');
// See time-example-calculate to see where the code appears
// Se the picture of example 1:
// https://docs.google.com/drawings/d/1noQMjYMPS4SYPrfVMEq_60BT7sv_T9SUW8zOqXzWCCg/edit

const users = ['P1', 'P2', 'P3', 'P4']; // this can be ids or names or whatever.
let tableInitTime = "20:00:00"; // 72000 secs
let tableEndTime = "22:15:45"; // 80145 secs

var timeline1 = [
    {time: "20:00:00", user: 'P1', init: true}, // 72000 secs
    {time: "20:00:00", user: 'P2', init: true}, // 72000 secs
    {time: "20:00:00", user: 'P3', init: true}, // 72000 secs
    {time: "20:00:00", user: 'P4', init: true}, // 72000 secs

    {time: "20:35:17", user: 'P3', init: false}, // 74117 secs

    {time: "21:01:23", user: 'P4', init: false}, // 75683 secs

    {time: "21:52:15", user: 'P2', init: false}, // 78735 secs

    {time: "22:15:45", user: 'P1', init: false}, // 80145 secs
]

//TODO: move to an unique object (dynamic)
const time = {
    'P1' : {initTime: '', endTime: '', totalTime: '', playersToDivide: []},
    'P2' : {initTime: '', endTime: '', totalTime: '', playersToDivide: []},
    'P3' : {initTime: '', endTime: '', totalTime: '', playersToDivide: []},
    'P4' : {initTime: '', endTime: '', totalTime: '', playersToDivide: []}
};

// parse timeLine to seconds times
timeline1.forEach((entry) => {
    entry.time = timeUtils.timeStringToSeconds(entry.time);
    // begin to mount the entry
    if (entry.init) {
        time[entry.user].initTime = entry.time;
    } else {
        time[entry.user].endTime = entry.time;
    }
});
console.log(time);


/*
    - Ecuentro P1, y anoto en P1 su tiempo de inicio:
    - Ecuentro P2, y anoto en P1 su tiempo de inicio
    - Ecuentro P3, y anoto en P1 su tiempo de inicio
    - Ecuentro P4, y anoto en P1 su tiempo de inicio

    - Encuentro el final de P3 y compruebo si se ha terminado algún

*/


// Way to know how many players are in the game
// Way to know init time of game, and the end
// When a player enters the game, we need to launch events to do things
// When a player leaves the game, we need to change the state
// When the game is finished, we need to change the state