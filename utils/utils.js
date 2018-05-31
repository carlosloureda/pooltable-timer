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
const PLAYER_CHARGED = 4;


/**
 * Converts an object with ids and values into an array of the values,
 *  useful for the posts architecture we are using
 * @param {object} object
 */
const objectToArray = (object) => {
    return Object.values(object).map(p => p)
}


/**
 * Converts an array into an object which keys are the key/id of an array
 * and the values the whole item in the array
 * @param {object} object
 */
const arrayToObject = (array) => {
    return array.reduce((acc, item) => {
        return {
            ...acc,
            ...{[item.id] : item}
        }
    }, {});
}

export const Utils = {
    uid,
    TIMER_STARTED, TIMER_PAUSED, TIMER_STOPPED,
    PLAYER_STARTED, PLAYER_PAUSED, PLAYER_STOPPED,
    objectToArray, arrayToObject
}