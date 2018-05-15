const _ = require('lodash');

const now = require('../utils/time-utils.js').now;

/* Constants and getters */
let usersPendingPayment = {};
let users = {};
let initGameTime = null; // when the table is opened
const getInitGameTime = () => initGameTime;
let endGameTime = null;  // when the table is closed
const getEndGameTime = () => endGameTime;
let chargedTime = null;  // when last player was charged
const getChargedTime = () => chargedTime;
let entryTime = null;  // when last player entered the game
const getEntryTime = () => entryTime;
let lastChargedId = null; // to check for last player chargedId
const getLastChargedId = () => lastChargedId;
let userPauseTime = null; // last pause init/end for user

/**
 * Gets the number of active players in the table.
 * This is the ones that haven't payed the table and are not in a pause.
 */
const getActivePlayersCount = () => {
    let nPendingPlayers = 0;
    for (userId in usersPendingPayment) {
        nPendingPlayers += ! isUserPaused(userId) ? 1 : 0;
    }
    console.log("Active players count: ", nPendingPlayers);
    return nPendingPlayers;
}

/**
 * seek for the latest event time, a user entry, a user exit or a pause
 */
const getLastEventTime = () => Math.max(entryTime, chargedTime, userPauseTime);

/**
 * Adds the billable time to the active users,
 * @param {Number} now, the now moment where the event happens
 * the billable amount of time to a player
 */
const addTimeToActiveUsers = (nowTime) => {
        // calculate time from now to last event entry
    let lastTime = getLastEventTime();
    console.log("**************************************************************");
    console.warn("LAST TIME is: ", lastTime);
    console.warn("nowTime is: ", nowTime);
    let activePlayersCount = getActivePlayersCount();
    let timeToBill = activePlayersCount ? (nowTime - lastTime) / activePlayersCount : 0;
    console.warn("TIMETOBILL: ", timeToBill);
    console.warn("activePlayersCount: ", activePlayersCount);
    console.log("**************************************************************");
    for (userId in usersPendingPayment) {
        let user = usersPendingPayment[userId];
        if (! isUserPaused(user.id)) {
            user.time.billable += timeToBill;
        }
    };
}

const addUserToGame = (name, initTime=null) => {
    let nowTime = initTime ? initTime: now(); // miliseconds
    if (_.isEmpty(users) || !initGameTime){
        initGameTime = nowTime
    }
    let user = {
        id: Math.round(Math.random() * Date.now()),
        name: name,
        time: {
            init: nowTime,
            end: null,
            pauses:[],
            billable: 0,
            elapsed: 0,
        }
    }
    // calculate and sum up the billable time
    addTimeToActiveUsers(nowTime);

    // mark data on new user
    users[user.id] = user;
    entryTime = nowTime;
    usersPendingPayment[user.id] = user;
    return user;
}

/**
 * Charges a player when exits the table
 * TODO: If a player is charged (ends a game), we need to check if he/she
 * is on a pause (NO TEST CASE FOR THIS YET BIG :TODO)
 * @param {string} id Id of the playet to be charged
 * @param {number} endTime Time in miliseconds. It is passed as an argument
 *
 */
const chargePlayer = (id, endTime = null) => {
    let nowTime = endTime ? endTime : now();
    let usersLength = Object.keys(users).length;
    if (usersLength === 1) {
        endGameTime = nowTime
    }

    addTimeToActiveUsers(nowTime);
    lastChargedId = id;
    chargedTime = nowTime;
    users[id].time.end = nowTime; // after fetching the data
    users[id].time.elapsed += (users[id].time.end - users[id].time.init);
    delete usersPendingPayment[id];
}

const removeUserFromGame = (id, endTime = null) => {
    chargePlayer(id, endTime);
    return true;
}

const initPauseUser = (id, pauseTime = null) => {
    let nowTime = pauseTime ? pauseTime : now();
    //TODO: check if it has a ongoing pause

    addTimeToActiveUsers(nowTime);

    userPauseTime = nowTime;
    users[id].time.pauses.push({
        init: nowTime,
        end: null
    })
    return users[id];
}

const endPauseUser = (id, pauseTime = null) => {
    let nowTime = pauseTime ? pauseTime : now();

    addTimeToActiveUsers(nowTime);
    //TODO: check things
    userPauseTime = nowTime;
    users[id].time.pauses[users[id].time.pauses.length -1].end = nowTime;
    return users[id];
}

const isUserPaused = (id) => {
    let pausesArrLength = users[id].time.pauses.length;
    if (pausesArrLength) {
        return users[id].time.pauses[pausesArrLength - 1].end ? false : true
    }
    return false;
}

const roundNumber = (number, decimals) => {
    let exp = Math.pow(10 ,decimals);
    let sigma = 5/exp;
    return ((number * exp + sigma)/exp).toFixed(decimals);
}

getLastUserBilledTime = () => {
    return lastChargedId ? users[lastChargedId].time.billable : null;
}
const getUsers = () => {
    return users;
}

// For tests
const reset = () => {
    users = {};
    usersPendingPayment = {};
    initGameTime = null;
    endGameTime = null;
    chargedTime = null;
    entryTime = null;
    lastChargedId = null;
};

const getUserByName = (name) => {
    let user = users.filter((_user) => _user.name === name)
    return user ? user[0] : null;
}
 // round to integer
const roundInteger = (num) => parseInt(num.toFixed(0));

// TODO: Add flag for exporting more or less thing if we are in dev mode
module.exports = {
    addUserToGame,
    removeUserFromGame,
    getUsers,
    reset,
    chargePlayer,
    initPauseUser,
    endPauseUser,
    usersPendingPayment,
    getInitGameTime,
    getEndGameTime,
    getChargedTime,
    getLastChargedId
}