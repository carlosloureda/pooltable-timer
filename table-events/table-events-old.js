const _ = require('lodash');

const now = require('../utils/time-utils.js').now;

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
    let usersPlayingLength = getActivePlayers();
    if(usersPlayingLength > 0){
        let lastTime = (chargedTime > entryTime) ? chargedTime : entryTime;
        let timeToBill = (user.time.init - lastTime) / usersPlayingLength;
        for (userId in usersPendingPayment) {
            let user = usersPendingPayment[userId];
            user.time.billable += timeToBill;
        };
    }
    users[user.id] = user;
    entryTime = nowTime;
    usersPendingPayment[user.id] = user;
    return user;
}

const removeUserFromGame = (id, endTime = null) => {
    chargePlayer(id, endTime);
    return true;
}

// TODO: If a player is charged (ends a game), we need to check if he/she
// is on a pause (NO TEST CASE FOR THIS YET BIG :TODO)
const chargePlayer = (id, endTime = null) => {
    let nowTime = endTime ? endTime : now();
    let usersLength = Object.keys(users).length;
    if (usersLength === 1) {
        endGameTime = nowTime
    }
    lastChargedId = id;

    let lastUserBilledTime = getLastUserBilledTime();
    users[id].time.end = nowTime; // after fetching the data
    let usersPlayingLength = getActivePlayers();
    // If last event was a charge
    if (lastUserBilledTime) {
        let timeToBill = 0;
        if(chargedTime > users[id].time.init) {
            timeToBill = (users[id].time.end - chargedTime) / usersPlayingLength;
        } else {
            timeToBill = (users[id].time.end - users[id].time.init) / usersPlayingLength;
        }
        users[id].time.billable += timeToBill;
        addTimeToRemainingUsers(timeToBill, id);
    }
    //  if last event was a user entry
    else {
        // getLastEventTime
        // TODO: maybe this prons into an error? It supposes it is the user exit last time he entered
        timeToBill = (users[id].time.end - users[id].time.init) / usersPlayingLength;
        users[id].time.billable += timeToBill;
        addTimeToRemainingUsers(timeToBill, id);
    }
    users[id].time.elapsed += (users[id].time.end - users[id].time.init);
    chargedTime = nowTime;
    delete usersPendingPayment[id];
}

const getActivePlayers = () => {
    let nPendingPlayers = 0;
    for (userId in usersPendingPayment) {
        nPendingPlayers += ! isUserPaused(userId) ? 1 : 0;
    }
    return nPendingPlayers;
}

const initPauseUser = (id, pauseTime = null) => {
    let nowTime = pauseTime ? pauseTime : now();
    //TODO: check if it has a ongoing pause
    users[id].time.pauses.push({
        init: nowTime,
        end: null
    })
    //TODO: Add accumulate
    // userPauseTime = nowTime;

    return users[id];
}

// seek for the latest event time, a user entry, a user exit or a pause
const getLastEventTime = () => Math.max(entryTime, chargedTime, userPauseTime);

const endPauseUser = (id, pauseTime = null) => {
    let nowTime = pauseTime ? pauseTime : now();
    //TODO: check things
    users[id].time.pauses[users[id].time.pauses.length -1].end = nowTime;

    // userPauseTime = nowTime;
    //TODO: Add accumulate

    return users[id];
}

const isUserPaused = (id) => {
    let pausesArrLength = users[id].time.pauses.length;
    if (pausesArrLength) {
        return users[id].time.pauses[pausesArrLength - 1].end ? false : true
    }
    return false;
}
const addTimeToRemainingUsers = (billableTime, chargedUserId) => {
    for (userId in usersPendingPayment) {
        let user = usersPendingPayment[userId];
        if (user.id !== chargedUserId && ! isUserPaused(user.id)) {
            let lastUserBilledTime = getLastUserBilledTime();
            if (user.time.init > lastUserBilledTime) {
                user.time.billable += billableTime;
            } else {
                user.time.billable += chargedTime - user.time.init;
            }
        }
    };
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