/**
 * Vamos realizar calculos para tener los datos de los ejemplos, se empieza a jugar al billar
 * a las 20 de la tarde y se llevan actualmente 2h 52 minutos y 15 segundos. Vamos a anotar
 * las horas de inicio de cada jugador y su hora de fin para poder tener los ejemplos correctos
 * para empezar a pensar
 *
 * EJEMPLO 1) SIN PAUSAS Y EMPEZANDO TODOS A LAS 20:00
 * ---------------------------------------------------
 * Total tiempo de mesa: 2:15:45, Hora de inicio: 20:00:00 - Hora final 22:15:45
 *  P1: 2:15:45, Hora de inicio: 20:00:00 - Hora final 22:15:45
 *  P2: 1:52:15, Hora de inicio: 20:00:00 - Hora final 21:52:15
 *  P3: 0:35:17, Hora de inicio: 20:00:00 - Hora final 20:35:17
 *  P4: 1:01:23, Hora de inicio: 20:00:00 - Hora final 21:01:23
 *
 * Para el ejemplo 2 hay cambios nuevos en el código, ahora lo vamos a hacer
 * con timestamps de UNIX  times, por lo que trabajaremos en miliisegundos
 * Verlo más abajo
 */

const timeUtils = require('../utils/time-utils');

const toSeconds = (hour, minutes, seconds) => {
    return hour*60*60 + minutes*60 + seconds;
}
console.log( toSeconds(2, 15, 45) )
//total time 2.2625
const sumar = (hour2, minutes2, seconds2, hour1, minutes1, seconds1) => {
    var total = toSeconds(hour2 , minutes2 , seconds2) + toSeconds(hour1 , minutes1 , seconds1);
    var hours = Math.floor(total / (60*60));
    var minutes = Math.floor((total - hours * 60 * 60) / 60);
    var seconds = total - hours*60*60 - minutes * 60;
    // console.log(hours, ':', minutes, ':', seconds);
    //TODO: Add trailing 0
    return `${hours}:${minutes}:${seconds}`;
};

// EJEMPLO 1
// var horaFinalMesa =  sumar(20,00,00,2,15,45)
// var horaFinalP1 =  sumar(20,00,00,2,15,45)
// var horaFinalP2 =  sumar(20,00,00,1,52,15)
// var horaFinalP3 =  sumar(20,00,00,0,35,17)
// var horaFinalP4 =  sumar(20,00,00,1,01,23)

/* EJEMPLO 2. Necesitamos milisegundos y son otro tipo de datos
 *
 *  P1: 2:15:45, Hora de inicio: 20:00:00 - Hora final 22:15:45
 *  P2: 1:52:15, Hora de inicio: 20:10:00 - Hora final 22:02:25
 *  P3: 0:35:17, Hora de inicio: 21:50:48 Hora final  21:59:23
 *  P4: 1:01:23, Hora de inicio: 20:45:00 - Hora final 21:46:23
 *
 * Esta vez queremos los datos en milisegundos y en hh:mm:ss
 */

const timeDiff = (stringTime2, stringTime1,  dateString=null) => {
    // splitted for testing purposes
    const time2 = timeUtils.timeStringToMilliseconds(stringTime2, dateString);
    const time1 = timeUtils.timeStringToMilliseconds(stringTime1, dateString);
    console.log("Time 1: ", time1, " -  Time 2: ", time2);
    var total = time2 - time1;
    return total;
};

const milisecondsToHourString = (total) => {
    total = (total/1000).toFixed(0);
    console.log("total: ", total);
    var hours = Math.floor(total / (60*60));
    var minutes = Math.floor((total - hours * 60 * 60) / 60);
    var seconds = total - hours*60*60 - minutes * 60;
    //TODO: Add trailing 0
    return `${hours}:${minutes}:${seconds}`;
}

var P1_I = "20:00:00";
var P1_F = "22:15:45";
var P2_I = "20:10:00";
var P2_F = "22:02:25";
var P3_I = "21:50:48";
var P3_F = "21:59:23";
var P4_I = "20:45:00";
var P4_F = "21:46:23";

console.log("Diferencia entre horas en milisegundos:");
console.log("*******************************************");

var horaFinalP1 =  timeDiff(P1_F, P1_I, "11/05/2018")
console.log("milisegundos horaFinalP1: ", horaFinalP1);
var horaFinalP2 =  timeDiff(P2_F, P2_I, "11/05/2018")
console.log("milisegundos horaFinalP2: ", horaFinalP2);
var horaFinalP3 =  timeDiff(P3_F, P3_I, "11/05/2018")
console.log("milisegundos horaFinalP3: ", horaFinalP3);
var horaFinalP4 =  timeDiff(P4_F, P4_I, "11/05/2018")
console.log("milisegundos horaFinalP4: ", horaFinalP4);
var horaFinalMesa =  horaFinalP1;
console.log("milisegundos horaFinalMesa: ", horaFinalMesa);


console.log("Diferencia entre horas en hh:mm:");
console.log("*******************************************");
horaFinalP1 =  milisecondsToHourString(horaFinalP1)
horaFinalP2 =  milisecondsToHourString(horaFinalP2)
horaFinalP3 =  milisecondsToHourString(horaFinalP3)
horaFinalP4 =  milisecondsToHourString(horaFinalP4)
horaFinalMesa =  horaFinalP1;

console.log("horaFinalMesa: ", horaFinalMesa);
console.log("horaFinalP1: ", horaFinalP1);
console.log("horaFinalP2: ", horaFinalP2);
console.log("horaFinalP3: ", horaFinalP3);
console.log("horaFinalP4: ", horaFinalP4);
