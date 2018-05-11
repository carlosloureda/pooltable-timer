/**
 * Returns the number of milliseconds since midnight, January 1, 1970
 */
const now = () => {
    return new Date().getTime();
}

// Forces an hour to milliseconds as timestamp from today
// DATE FOR TESTS
const timeStringToMilliseconds = (timeString, dateString=null, delimitter=':') => {
    const timeSplitted = timeString.split(delimitter);
    let date = new Date();
    if (dateString) {
        const dateSplitted = dateString.split('/');
        date = new Date(parseInt(dateSplitted[2]), parseInt(dateSplitted[1]), parseInt(dateSplitted[0]))
    }
    return date.setHours(parseInt(timeSplitted[0]),parseInt(timeSplitted[1]), parseInt(timeSplitted[2]), 0);
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Parses a string in format HH`${delimiter}`mm`${delimiter}`ss to seconds
 * @param {string} timeString The time to parse in HH`${delimiter}`mm`${delimiter}`ss format
 * @param string} delimitter to split the string, default is ':'
 * @returns int time in seconds
 * @author Carlos Loureda Parrado <carloslouredaparrado@gmail.com>
 */
const timeStringToSeconds = (timeString, delimitter=':') => {
    const dateSplitted = timeString.split(delimitter);
    return toSeconds(parseInt(dateSplitted[0]), parseInt(dateSplitted[1]), parseInt(dateSplitted[2]))
}

const toSeconds = (hour, minutes, seconds) => {
    return parseInt(hour)*60*60 + parseInt(minutes)*60 + parseInt(seconds);
}

/**
 * Seconds elpased from start to end
 * @param {int} timeSecondsInit - init time in seconds
 * @param {int} timeSecondsEnd  - end time in seconds
 * @returns int time in seconds
 * @author Carlos Loureda Parrado <carloslouredaparrado@gmail.com>
 */
const secondsElapsed = (timeSecondsInit, timeSecondsEnd) => {
    return timeSecondsEnd - timeSecondsInit;
}

module.exports = {
    timeStringToMilliseconds,
    timeStringToSeconds,
    toSeconds,
    now
}
