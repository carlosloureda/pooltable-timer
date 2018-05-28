// import the utils
import '../table-events/table-events.js';
import {
    START_TIMER, PAUSE_TIMER, UPDATE_TIMER,
    RESET_TIMER, ADD_PLAYER,
    PLAYER_START_TIMER, PLAYER_PAUSE_TIMER, PLAYER_UPDATE_TIMER
} from './types';

//////////////////////////////
// TABLE ACTIONS
//////////////////////////////


// TODO: Stop timer (to be charged)


/*******************************************************************************
 *                               START TIMER
 ******************************************************************************/
export function startTimer() {
    return {
        type: START_TIMER,
        time: new Date().getTime()
    }
}

/*******************************************************************************
 *                               PAUSE TIMER
 ******************************************************************************/
export function pauseTimer() {
    return {
        type: PAUSE_TIMER,
        time: new Date().getTime()
    }
}

/*******************************************************************************
 *                               UPDATE TIMER
 ******************************************************************************/
export function updateTimer() {
    return {
        type: UPDATE_TIMER,
        time: new Date().getTime()
    }
}

/*******************************************************************************
 *                               RESET TIMER
 ******************************************************************************/
export function resetTimer() {
    return {
        type: RESET_TIMER
    }
}

//////////////////////////////
// USER ACTIONS
//////////////////////////////

// Add user to table
/*******************************************************************************
 *                               ADD PLAYER
 ******************************************************************************/
export function addNewPlayer(name) {
    return {
        type: ADD_PLAYER,
        playerName: name,
        initTime: new Date().getTime()
    }
}

export function playerStartTimer(id) {
    return {
        type: PLAYER_START_TIMER,
        playerId: id,
        time: new Date().getTime()
    }
}

export function playerPauseTimer(id) {
    return {
        type: PLAYER_PAUSE_TIMER,
        playerId: id,
        time: new Date().getTime()
    }
}

export function playerUpdateTimer(id) {
    return {
        type: PLAYER_UPDATE_TIMER,
        playerId: id,
        time: new Date().getTime()
    }
}


export function resetState() {
    return {
        type: "RESET_STATE"
    }
}



// charge player (remove without charge)


// pause user (init)


// pause user (end)


// remove or reset user time
