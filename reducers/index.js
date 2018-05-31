import {
    START_TIMER, PAUSE_TIMER,
    RESET_TIMER, ADD_PLAYER,
    PLAYER_START_TIMER, PLAYER_PAUSE_TIMER,
    PLAYER_CHARGE, SAVE_PRICE_PER_HOUR
} from '../actions/types';

import {getStoredState} from 'redux-persist';
import { Utils } from '../utils/utils';
const  timeUtils = require('../utils/time-utils');
// use combien reducers

const PRICE_PER_HOUR = 4;

const defaultState = {
    timer: {
        start: null,
        end: null,
        lastPauseCount: null,
        lastPause: null,
        count: 0,
        pauses: [],
        status: Utils.TIMER_STOPPED,
        lastEventTime: null,
        lastPLayerChargedId: null,
    },
    pricePerHour: PRICE_PER_HOUR,
    pricerPerMiliseconds: (PRICE_PER_HOUR/(60*60*1000)),
    players: {},
    playersPendingPayment: []
}

////////////////////////////////////////////////////////////////////////////////


/**
 * Checks if an user is on a pause
 * @param { string } id - Id of the user to be checked.
 */
const isUserPaused = (id, state) => {
    let pausesArrLength = state.players[id].timer.pauses.length;
    if (pausesArrLength) {
        return state.players[id].timer.pauses[pausesArrLength - 1].end ? false : true
    }
    return false;
}

/**
 * Gets the number of active players in the table.
 * This is the ones that haven't payed the table and are not in a pause.
 */
const getActivePlayersCount = (state) => {
    let nPendingPlayers = 0;
    for (userId of state.playersPendingPayment) {
        nPendingPlayers += ! isUserPaused(userId, state) ? 1 : 0;
    }
    return nPendingPlayers;
}

/**
 * seek for the latest event time, a user entry, a user exit or a pause
 */
// const getLastEventTime = () => Math.max(entryTime, chargedTime, userPauseTime);
const getLastEventTime = (state) => state.timer.lastEventTime;

/**
 * Adds the billable time to the active users,
 * @param {Number} now, the now moment where the event happens
 * the billable amount of time to a player
 */
const addTimeToActiveUsers = (nowTime, state) => {
        // calculate time from now to last event entry
    let lastTime = getLastEventTime(state);
    let activePlayersCount = getActivePlayersCount(state);
    let timeToBill = activePlayersCount ? (nowTime - lastTime) / activePlayersCount : 0;
    const players = Object.assign({}, state.players);

    for (userId of state.playersPendingPayment) {
        let user = players[userId];
        if (! isUserPaused(user.id, state)) {
            user.timer.billable += timeToBill;
        }
    };
    return players;
}


////////////////////////////////////////////////////////////////////////////////

function poolTable(state = defaultState, action) {
    let pausesObj = null;
    let now = null;

    switch (action.type) {
        case START_TIMER:
        console.log("START_TIMER");
            pausesObj = state.timer.pauses;
            if (state.timer.status === Utils.TIMER_PAUSED) {
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
        case RESET_TIMER:
            return defaultState;

        case SAVE_PRICE_PER_HOUR:
            return {
                ...state,
                pricePerHour: action.price,
                pricerPerMiliseconds: (action.price/(60*60*1000))
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
            now = new Date().getTime();
            previousPlayers = addTimeToActiveUsers(now, state);

            return {
                ...state,
                playersPendingPayment: state.playersPendingPayment.concat([id]),
                timer: {
                    ...state.timer,
                    lastEventTime: now,
                },
                players: {
                    ...previousPlayers,
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
                            billable: 0,
                            status: Utils.PLAYER_STOPPED,
                        }
                    }
                }
            };

        case PLAYER_START_TIMER:
            console.log("PLAYER_START_TIMER");
            previousPlayers = state.players;
            if (state.players[action.playerId].timer.status === Utils.PLAYER_CHARGED) {
                // protection for global restart from pause
                return state;
            }
            pausesObj = state.players[action.playerId].timer.pauses;
            now = new Date().getTime();
            let comesFromPause = false;
            if (state.players[action.playerId].timer.status === Utils.TIMER_PAUSED) {
                pausesObj[pausesObj.length -1].end = now;
                previousPlayers = addTimeToActiveUsers(now, state);
                comesFromPause = true;
            }
            return {
                ...state,
                timer: {
                    ...state.timer,
                    lastEventTime: comesFromPause ? now : state.timer.lastEventTime
                },
                players: {
                    ...previousPlayers,
                    [action.playerId]: {
                        ...state.players[action.playerId],
                        timer: {
                            ...state.players[action.playerId].timer,
                            // status: Utils.PLAYER_STARTED,
                            status: state.players[action.playerId].timer.status === Utils.PLAYER_CHARGED ? Utils.PLAYER_CHARGED : Utils.PLAYER_STARTED,
                            start: state.players[action.playerId].timer.start ?
                                    state.players[action.playerId].timer.start : action.time,
                            pauses: pausesObj
                        }
                    }
                }
            }
        case PLAYER_PAUSE_TIMER:
            let _pPauses = state.players[action.playerId].timer.pauses;
            now = new Date().getTime();
            previousPlayers = addTimeToActiveUsers(now, state);
            // Dont want to update if is already in pause
            if ( _pPauses.length > 0 &&
                _pPauses[_pPauses.length -1 ].init &&  !_pPauses[_pPauses.length -1 ].end
            ) {
                return state;
            }
            return {
                ...state,
                timer: {
                    ...state.timer,
                    lastEventTime: now
                },
                players: {
                    ...previousPlayers,
                    [action.playerId]: {
                        ...state.players[action.playerId],
                        timer: {
                            ...state.players[action.playerId].timer,
                            status: state.players[action.playerId].timer.status === Utils.PLAYER_CHARGED ? Utils.PLAYER_CHARGED : Utils.PLAYER_PAUSED,
                            pauses: state.players[action.playerId].timer.pauses.concat([
                                {
                                    init: now,
                                    end: null
                                }
                            ])
                        }
                    }
                }
            }
        case PLAYER_CHARGE:
            now = new Date().getTime();
            let _remainingPlayers = Object.assign([], state.playersPendingPayment);
            let index = _remainingPlayers.indexOf(action.playerId);
            _remainingPlayers.splice(index, 1);

            return {
                ...state,
                timer: {
                    ...state.timer,
                    lastEventTime: now
                },
                playersPendingPayment: _remainingPlayers,
                players: {
                    ...state.players,
                    [action.playerId]: {
                        ...state.players[action.playerId],
                        timer: {
                            ...state.players[action.playerId].timer,
                            status: Utils.PLAYER_CHARGED
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