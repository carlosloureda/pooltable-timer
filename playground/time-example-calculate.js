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
 * EJEMPLO 2) SIN PAUSAS Y EMPEZANDO TODOS A LAS 20:00
 * ---------------------------------------------------
 * Total tiempo de mesa: 2:15:45, Hora de inicio: 20:00:00 - Hora final 22:15:45
 *  P1: 2:15:45, Hora de inicio: 20:00:00 - Hora final 22:15:45
 *  P2: 1:52:15, Hora de inicio: 20:10:10 - Hora final 22:02:25
 *  P3: 0:35:17, Hora de inicio: 21:17:33 - Hora final 21:52:50
 *  P4: 1:01:23, Hora de inicio: 20:00:00 - Hora final 21:01:23
 */

const toSeconds = (hour, minutes, seconds) => {
    return hour*60*60 + minutes*60 + seconds;
}
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

// EJEMPLO 2
var horaFinalMesa =  sumar(20,00,00, 2,15,45)
var horaFinalP1 =  sumar(20,00,00, 2,15,45)
var horaFinalP2 =  sumar(20,10,10, 1,52,15)
var horaFinalP3 =  sumar(21,17,33, 0,35,17)
var horaFinalP4 =  sumar(20,45,00, 1,01,23)

console.log("horaFinalMesa: ", horaFinalMesa);
console.log("horaFinalP1: ", horaFinalP1);
console.log("horaFinalP2: ", horaFinalP2);
console.log("horaFinalP3: ", horaFinalP3);
console.log("horaFinalP4: ", horaFinalP4);