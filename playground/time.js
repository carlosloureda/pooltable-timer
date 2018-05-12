
function convertLocalDatetoUTCDate(date) {
    return new Date(
        date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()
    );
}

function convertToGMT0(date) {
    date = new Date(2015, 4, 11, 20, 0 ,0 ,0);
    date = new Date(date.valueOf() + (-1*date.getTimezoneOffset()) * 60000);
    return date;
}

function timeStringToMilliseconds(timeString, dateString) {
    var delimitter = ':';
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

var res = timeStringToMilliseconds("20:00:00", "11/05/2018");
console.log("RES: ", res);
var res1 = timeStringToMilliseconds("20:35:00", "11/05/2018");
console.log("RES1: ", res1);
