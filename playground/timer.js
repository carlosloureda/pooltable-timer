const toHours = (hour, minutes, seconds) => {
    return hour + minutes/60 + (seconds/(60*60));
}

const toSeconds = (hour, minutes, seconds) => {
    return hour*60*60 + minutes*60 + seconds;
}

const totalPrice = (hour,minutes, seconds) => {
    var totalHours = toHours(hour, minutes, seconds);
    return (totalHours * 4).toFixed(2);
}
const pricePerPlayer = (timeInHours, totalTableTime) => {
    return (timeInHours/totalTableTime).toFixed(2)
}

// Table counts
var tableTime = toHours(2, 15, 45);
var tablePrice = totalPrice(2, 15, 45);
console.log(tableTime);

// Players counts

// var toPayPlayer1 = pricePerPlayer(totalPrice(2, 15, 45), tableTime); console.log("To pay player 1: ", toPayPlayer1, "€");
// var toPayPlayer2 = pricePerPlayer(totalPrice(1, 52, 15), tableTime); console.log("To pay player 2: ", toPayPlayer2, "€");
// var toPayPlayer3 = pricePerPlayer(totalPrice(0, 35, 17), tableTime); console.log("To pay player 3: ", toPayPlayer3, "€");
// var toPayPlayer4 = pricePerPlayer(totalPrice(1, 01, 23), tableTime); console.log("To pay player 4: ", toPayPlayer4, "€");
// console.log("Is correct the sum count?: ", tablePrice === (toPayPlayer1 + toPayPlayer2 + toPayPlayer3 + toPayPlayer4))
