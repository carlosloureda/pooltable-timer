import {
    START_TIMER, PAUSE_TIMER,
    UPDATE_TIMER, RESET_TIMER, ADD_PLAYER
} from '../actions/types';

import {getStoredState} from 'redux-persist';
import  Utils from '../utils/utils';
// use combien reducers

const TIMER_STARTED = 1;
const TIMER_PAUSED = 2;
const TIMER_STOPPED = 3;
const PLAYER_STARTED = 1;
const PLAYER_PAUSED = 2;
const PLAYER_STOPPED = 3;

const defaultState = {
    timer: {
        start: null,
        end: null,
        lastPauseCount: null,
        lastPause: null,
        count: 0,
        pauses: [],
        countFormatted: {
            hours: '00', minutes: '00', seconds: '00'
        },
        status: TIMER_STOPPED,
    },
    // players: [1,2,3],
    players: [
        { name: 'Angel', time: '01:52:00', money: '7,52', status:'started', id: 'item1' }
    ],
}

getTimerInfo = (state) => {
    var now = new Date().getTime();
    let totalCount = 0;
    if (state.timer.pauses && state.timer.pauses.length) {

        // desde start hasta primera pausa
        totalCount = state.timer.pauses[0].init - state.timer.start;

        // desde pausa ultima a start siguiente
        for (let i = 0; i < state.timer.pauses.length; i++) {
            if (i != state.timer.pauses.length - 1) { // no estamos en la ultima
                totalCount += state.timer.pauses[i + 1].init - state.timer.pauses[i].end;
            }
        }

        // desde final ultima pausa hasta ahora
        let lastPause = state.timer.pauses[state.timer.pauses.length - 1];
        if (lastPause && lastPause.end) {
            totalCount += now - lastPause.end;
        }
    } else { // no pauses
        totalCount = now - state.timer.start;
    }
    return totalCount;
}

parseTime = (count) => {
    let miliseconds = count % 1000;
    let seconds = Math.floor(count  / 1000) % 60;
    let minutes = Math.floor(count  / (1000 * 60)) % 60;
    let hours = Math.floor(count  / (1000 * 60 * 60)) % 60;

    miliseconds = (miliseconds < 10) ? '0' + miliseconds : miliseconds.toString();
    seconds = (seconds < 10) ? '0' + seconds : seconds.toString();
    minutes = (minutes < 10) ? '0' + minutes : minutes.toString();
    hours = (hours < 10) ? '0' + hours : hours.toString();
    return  {
        hours, minutes, seconds
    }
}

function poolTable(state = defaultState, action) {
    switch (action.type) {

        case START_TIMER:
            return {
                ...state,
                timer: {
                    ...state.timer,
                    status: TIMER_STARTED,
                    start: action.time
                }
            }
        case PAUSE_TIMER:
            let pausesArr = state.timer.pauses;
            pausesArr.push({
                init: new Date().getTime(),
                end: null
            });
            return {
                ...state,
                timer: {
                    ...state.timer,
                    status: TIMER_PAUSED,
                    pauses: pausesArr
                }
            }
        case UPDATE_TIMER:
            const pausesObj = state.timer.pauses;
            const actualCount = getTimerInfo(state);
            //TODO:  maybe the end of the pause should go in the start??
            if (state.timer.status === TIMER_PAUSED) {
                pausesObj[pausesObj.length -1].end = new Date().getTime();
            }

            return {
                ...state,
                timer: {
                    ...state.timer,
                    count: actualCount,
                    status: TIMER_STARTED,
                    countFormatted: parseTime(actualCount),
                    pauses: state.timer.pauses
                }
            }
        case RESET_TIMER:
            return {
                ...state,
                timer: {
                    start: null,
                    end: null,
                    lastPauseCount: null,
                    lastPause: null,
                    count: 0,
                    pauses: [],
                    countFormatted: {
                        hours: '00', minutes: '00', seconds: '00'
                    },
                    status: TIMER_STOPPED,
                },
                players:[],
            }

        case ADD_PLAYER:

            return {
                ...state,
                players: state.players.concat([
                    {
                        name: action.playerName,
                        time: action.initTime,
                        money: 0,
                        status: PLAYER_STARTED,
                        id: Utils.uid()
                    }
                ])
            };
        case "RESET_STATE":
            return {
                defaultState
            }
    }
    return state;
}

export default poolTable;