/**
 * Return unique user identifier
 * (Almost without collision)
 */
const uid = () => {
    return Math.random().toString(16).slice(2)+(new Date()).getTime().toString(16)
}
const TIMER_STARTED = 1;
const TIMER_PAUSED = 2;
const TIMER_STOPPED = 3;

const PLAYER_STARTED = 1;
const PLAYER_PAUSED = 2;
const PLAYER_STOPPED = 3;

export const Utils = {
    uid,
    TIMER_STARTED, TIMER_PAUSED, TIMER_STOPPED,
    PLAYER_STARTED, PLAYER_PAUSED, PLAYER_STOPPED
}