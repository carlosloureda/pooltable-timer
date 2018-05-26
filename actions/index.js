// import the utils
import '../table-events/table-events.js';
import {
    START_TIMER, PAUSE_TIMER, UPDATE_TIMER, RESET_TIMER
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
    //

// charge player (remove without charge)


// pause user (init)


// pause user (end)


// remove or reset user time
