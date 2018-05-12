/**
 * Returns the number of milliseconds since midnight, January 1, 1970
 */
const now = () => {
    return new Date().getTime();
}

/**
 * This is for running the tests in remote servers and don't have problems with
 * dates
 */
function convertToGMT0(date) {
    // date = new Date(2015, 4, 11, 20, 0 ,0 ,0);
    date = new Date(date.valueOf() + (-1*date.getTimezoneOffset()) * 60000);
    return date;
}

const timeStringToMilliseconds = (timeString, dateString=null, delimitter=':') => {
    var timeSplitted = timeString.split(delimitter);
    var date = new Date();
    if (dateString) {
        var dateSplitted = dateString.split('/');
        date = new Date(parseInt(dateSplitted[2]), parseInt(dateSplitted[1]-1), parseInt(dateSplitted[0]))
    }
    date = new Date(date.setHours(parseInt(timeSplitted[0]),parseInt(timeSplitted[1]), parseInt(timeSplitted[2]), 0));
    date = convertToGMT0(date)
    return date.getTime();
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

const roundNumber = (number, decimals) => {
    let exp = Math.pow(10 ,decimals);
    let sigma = 5/exp;
    return parseFloat(((number * exp + sigma)/exp).toFixed(decimals));
}


module.exports = {
    timeStringToMilliseconds,
    timeStringToSeconds,
    toSeconds,
    now,
    roundNumber
}
