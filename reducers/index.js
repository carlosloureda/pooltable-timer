import {
    START_TIMER, PAUSE_TIMER,
    UPDATE_TIMER, RESET_TIMER, ADD_PLAYER,
    PLAYER_START_TIMER, PLAYER_PAUSE_TIMER,
    PLAYER_UPDATE_TIMER
} from '../actions/types';

import {getStoredState} from 'redux-persist';
import { Utils } from '../utils/utils';
// use combien reducers

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
        status: Utils.TIMER_STOPPED,
        // Helpers for my quick-dirty algorith,m TODO:
        lastPLayerEntryTime: null,
        lastPLayerChargedTime: null,
        lastPLayerChargedId: null,
        lastPLayerPauseTime: null,
    },
    players: {},
    playersPendingPayment: null
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

getPlayerTimerInfo = (state, playerId) => {
    const player = state.players[playerId];
    var now = new Date().getTime();
    let totalCount = 0;
    if (player.timer.pauses && player.timer.pauses.length) {
        // desde start hasta primera pausa
        totalCount = player.timer.pauses[0].init - player.timer.start;

        // desde pausa ultima a start siguiente
        for (let i = 0; i < player.timer.pauses.length; i++) {
            if (i != player.timer.pauses.length - 1) { // no estamos en la ultima
                totalCount += player.timer.pauses[i + 1].init - player.timer.pauses[i].end;
            }
        }

        // desde final ultima pausa hasta ahora
        let lastPause = player.timer.pauses[player.timer.pauses.length - 1];
        if (lastPause && lastPause.end) {
            totalCount += now - lastPause.end;
        }
    } else { // no pauses
        totalCount = now - player.timer.start;
    }
    return totalCount;
}

////////////////////////////////////////////////////////////////////////////////


/**
 * Checks if an user is on a pause
 * @param { string } id - Id of the user to be checked.
 */
const isUserPaused = (id, state) => {
    let pausesArrLength = state.players[id].time.pauses.length;
    if (pausesArrLength) {
        return state.players[id].time.pauses[pausesArrLength - 1].end ? false : true
    }
    return false;
}

/**
 * Gets the number of active players in the table.
 * This is the ones that haven't payed the table and are not in a pause.
 */
const getActivePlayersCount = (state) => {
    let nPendingPlayers = 0;
    for (userId in state.playersPendingPayment) {
        nPendingPlayers += ! isUserPaused(userId) ? 1 : 0;
    }
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
    let activePlayersCount = getActivePlayersCount();
    let timeToBill = activePlayersCount ? (nowTime - lastTime) / activePlayersCount : 0;
    for (userId in usersPendingPayment) {
        let user = usersPendingPayment[userId];
        if (! isUserPaused(user.id)) {
            user.time.billable += timeToBill;
        }
    };
}


////////////////////////////////////////////////////////////////////////////////

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
    let pausesObj = null;
    switch (action.type) {
        case START_TIMER:
        console.log("START_TIMER");
            pausesObj = state.timer.pauses;
            if (state.timer.status === Utils.TIMER_PAUSED) {
                const actualCount = getTimerInfo(state);
                pausesObj[pausesObj.length -1].end = new Date().getTime();
            }
            return {
                ...state,
                timer: {
                    ...state.timer,
                    start: state.timer.start ? state.timer.start : action.time,
                    status: Utils.TIMER_STARTED,
                    pauses: pausesObj
                }
            }
        case PAUSE_TIMER:
            let _pauses = state.timer.pauses;
            if ( _pauses.length > 0 && _pauses[_pauses.length -1 ].init && !_pauses[_pauses.length -1 ].end ) {
                return state;
            }
            return {
                ...state,
                timer: {
                    ...state.timer,
                    status: Utils.TIMER_PAUSED,
                    pauses: state.timer.pauses.concat([{
                        init: new Date().getTime(),
                        end: null
                    }])
                }
            }
        case UPDATE_TIMER:
            const actualCount = getTimerInfo(state);
            return {
                ...state,
                timer: {
                    ...state.timer,
                    count: actualCount,
                    status: Utils.TIMER_STARTED,
                    countFormatted: parseTime(actualCount),
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
                    status: Utils.TIMER_STOPPED,
                },
                players:[],
            }

        /**
         *  When adding new player:
         *
         *  If general timer is init, the timer for that player is init, esle not-init
         *  'Add chargableTime to the remaining users'
        */
        case ADD_PLAYER:
            //TODO: Add 'chargable time to the remaining users'
            const id = action.id ? action.id : Utils.uid();
            return {
                ...state,
                players: {
                    ...state.players,
                    [id]: {
                        id: id,
                        name: action.playerName,
                        time: action.time,
                        money: 0,
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
                            status: Utils.PLAYER_STOPPED,
                        }
                    }
                }
            };

        case PLAYER_START_TIMER:

        console.log("PLAYER_START_TIMER");
            pausesObj = state.players[action.playerId].timer.pauses;
            if (state.players[action.playerId].timer.status === Utils.TIMER_PAUSED) {
                pausesObj[pausesObj.length -1].end = new Date().getTime();
            }
            return {
                ...state,
                players: {
                    ...state.players,
                    [action.playerId]: {
                        ...state.players[action.playerId],
                        timer: {
                            ...state.players[action.playerId].timer,
                            status: Utils.PLAYER_STARTED,
                            start: state.players[action.playerId].timer.start ?
                                    state.players[action.playerId].timer.start : action.time,
                            pauses: pausesObj
                        }
                    }
                }
            }
        case PLAYER_PAUSE_TIMER:
            let _pPauses = state.players[action.playerId].timer.pauses;
            // Dont want to update if is already in pause
            if ( _pPauses.length > 0 &&
                _pPauses[_pPauses.length -1 ].init &&  !_pPauses[_pPauses.length -1 ].end
            ) {
                return state;
            }
            return {
                ...state,
                players: {
                    ...state.players,
                    [action.playerId]: {
                        ...state.players[action.playerId],
                        timer: {
                            ...state.players[action.playerId].timer,
                            status: Utils.PLAYER_PAUSED,
                            pauses: state.players[action.playerId].timer.pauses.concat([
                                {
                                    init: new Date().getTime(),
                                    end: null
                                }
                            ])
                        }
                    }
                }
            }
        case PLAYER_UPDATE_TIMER:
            const t_actualCount = getPlayerTimerInfo(state, action.playerId);

            return {
                ...state,
                players: {
                    ...state.players,
                    [action.playerId]: {
                        ...state.players[action.playerId],
                        timer: {
                            ...state.players[action.playerId].timer,
                            count: t_actualCount,
                            status: Utils.TIMER_STARTED,
                            countFormatted: parseTime(t_actualCount),
                        }
                    }
                }
            }
        case "RESET_STATE":
            return {
                defaultState
            }
    }
    return state;
}

export default poolTable;