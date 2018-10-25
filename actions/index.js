// import the utils
import '../table-events/table-events.js';
import {
    START_TIMER, PAUSE_TIMER,
    RESET_TIMER, ADD_PLAYER,
    PLAYER_START_TIMER, PLAYER_PAUSE_TIMER,
    PLAYER_CHARGE, SAVE_PRICE_PER_HOUR,
    PLAYERS_PAUSE_TIMER_ONE, PLAYERS_PAUSE_TIMER_TWO
} from './types';

//////////////////////////////
// TABLE ACTIONS
//////////////////////////////


/*******************************************************************************
 *                               START TIMER
 ******************************************************************************/
export function startTimer(time) {
    return {
        type: START_TIMER,
        time: time
    }
}

/*******************************************************************************
 *                               PAUSE TIMER
 ******************************************************************************/
export function pauseTimer(time) {
    return {
        type: PAUSE_TIMER,
        time: time
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

/*******************************************************************************
 *                             SET TABLE PRICE
 ******************************************************************************/
export function setTablePrice(price) {
    return {
        type: SAVE_PRICE_PER_HOUR,
        price: price
    }
}

//////////////////////////////
// USER ACTIONS
//////////////////////////////

// Add user to table
/*******************************************************************************
 *                               ADD PLAYER
 ******************************************************************************/
export function addNewPlayer(name, id) {
    console.log("add new player id: ", id);
    return {
        type: ADD_PLAYER,
        playerName: name,
        time: new Date().getTime(),
        id: id
    }
}

export function playerStartTimer(id, time) {
    return {
        type: PLAYER_START_TIMER,
        playerId: id,
        time: time
    }
}

export function playerPauseTimer(id, time) {
    return {
        type: PLAYER_PAUSE_TIMER,
        playerId: id,
        time: time
    }
}

/* Pause the timers for players */
function pausePlayersPartOne(time) {
    return {
        type: PLAYERS_PAUSE_TIMER_ONE,
        time: time
    }
}

/* set times for the paused players*/
function pausePlayersPartTwo(time) {
    return {
        type: PLAYERS_PAUSE_TIMER_TWO,
        time: time
    }
}

export function playersPauseTimer(time) {
    return (dispatch) => {
        dispatch(pausePlayersPartOne(time))
        return dispatch(pausePlayersPartTwo(time))

    }
}

export function chargePlayer(id) {
    return {
        type: PLAYER_CHARGE,
        playerId: id
    }
}

export function resetState() {
    return {
        type: "RESET_STATE"
    }
}



// pause user (init)


// pause user (end)


// remove or reset user time
