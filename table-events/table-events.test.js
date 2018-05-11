const {
    addUserToGame, removeUserFromGame,
    getUsers, getUserByName, resetUsers
} = require('./table-events');
const tableEvents = require('./table-events');
const timeUtils = require('../utils/time-utils');

describe('TableEvents', () => {
    it('#addUserToGame', () => {
        resetUsers();
        let p1 = addUserToGame('P1');
        let p2 = addUserToGame('P2');
        let p3 = addUserToGame('P3');
        let p4 = addUserToGame('P4');

        let users = getUsers();
        let res = Object.keys(users).length;
        expect(res).toBe(4);
        expect(users[p1.id].name).toBe('P1');
        expect(users[p2.id].name).toBe('P2');
        expect(users[p3.id].name).toBe('P3');
        expect(users[p4.id].name).toBe('P4');
    });

    it('#removeUserFromGame', () => {
        resetUsers();
        let p1 = addUserToGame('P1');
        let p2 = addUserToGame('P2');

        let users = getUsers();
        let initialLength = Object.keys(users).length;
        expect(initialLength).toBe(2);

        removeUserFromGame(p1.id);

        users = getUsers();
        let finalLength = Object.keys(users).length;
        expect(finalLength).toBe(2);

        let res = users[p1.id].time.end;
        expect(res).not.toBeNull();

    });

    describe('Testing a complete game ~EXAMPLE1', () => {

        it('should add 4 users at the same time', () => {
            resetUsers();
            let p1 = addUserToGame('P1', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p2 = addUserToGame('P2', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p3 = addUserToGame('P3', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p4 = addUserToGame('P4', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));

            let users = getUsers();
            expect(users[p1.id].time.init).toBe(1528740000000);
            expect(users[p2.id].time.init).toBe(1528740000000);
            expect(users[p3.id].time.init).toBe(1528740000000);
            expect(users[p4.id].time.init).toBe(1528740000000);
        });

        it('should end player 3, 4, 2, 1 in different times and charge them accordingly', () => {

            resetUsers();
            let p1 = addUserToGame('P1', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p2 = addUserToGame('P2', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p3 = addUserToGame('P3', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p4 = addUserToGame('P4', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));

            // REMOVE player 3
            tableEvents.chargePlayer(p3.id, timeUtils.timeStringToMilliseconds("20:35:17", "11/05/2018"));
            let users = tableEvents.getUsers();
            expect(users[p3.id].time.end).toBe(1528742117000);
            expect(tableEvents.getChargedTime()).toBe(1528742117000);
            expect(tableEvents.getLastChargedId()).toBe(p3.id);
            users = tableEvents.getUsers();
            expect(users[p3.id].time.billable).toBe(529250);
            expect(users[p3.id].time.elapsed).toBe(2117000);

            // REMOVE player 4
            tableEvents.chargePlayer(p4.id, timeUtils.timeStringToMilliseconds("21:01:23", "11/05/2018"));
            users = tableEvents.getUsers();
            expect(users[p4.id].time.end).toBe(1528743683000);
            expect(tableEvents.getChargedTime()).toBe(1528743683000);
            expect(tableEvents.getLastChargedId()).toBe(p4.id);
            users = tableEvents.getUsers();
            expect(users[p4.id].time.billable).toBe(1051250);
            expect(users[p4.id].time.elapsed).toBe(3683000);

            // REMOVE player 2
            tableEvents.chargePlayer(p2.id, timeUtils.timeStringToMilliseconds("21:52:15", "11/05/2018"));
            users = tableEvents.getUsers();
            expect(users[p2.id].time.end).toBe(1528746735000);
            expect(tableEvents.getChargedTime()).toBe(1528746735000);
            expect(tableEvents.getLastChargedId()).toBe(p2.id);
            users = tableEvents.getUsers();
            expect(users[p2.id].time.billable).toBe(2577250);
            expect(users[p2.id].time.elapsed).toBe(6735000);

            // REMOVE player 1
            tableEvents.chargePlayer(p1.id, timeUtils.timeStringToMilliseconds("22:15:45", "11/05/2018"));
            users = tableEvents.getUsers();
            expect(users[p1.id].time.end).toBe(1528748145000);
            expect(tableEvents.getChargedTime()).toBe(1528748145000);
            expect(tableEvents.getLastChargedId()).toBe(p1.id);
            users = tableEvents.getUsers();
            expect(users[p1.id].time.billable).toBe(3987250);
            expect(users[p1.id].time.elapsed).toBe(8145000);


            const sigma = 4/3600;
            let time1 = users[p1.id].time.billable/1000;
            expect(time1).toBe(3987.25);
            let payment1 = roundNumber(time1*sigma, 2);
            expect(payment1).toBe(4.43);

            let time2 = users[p2.id].time.billable/1000;
            expect(time2).toBe(2577.25);
            let payment2 = roundNumber(time2*sigma, 2);
            expect(payment2).toBe(2.86);

            let time3 = users[p3.id].time.billable/1000;
            expect(time3).toBe(529.25);
            let payment3 = roundNumber(time3*sigma, 2);
            expect(payment3).toBe(0.59);

            let time4 = users[p4.id].time.billable/1000;
            expect(time4).toBe(1051.25);
            let payment4 = roundNumber(time4*sigma, 2);
            expect(payment4).toBe(1.17);

            let totalBilledTime = time1 + time2 +  time3 + time4;
            expect(totalBilledTime).toBe(8145);
            let payment = roundNumber(totalBilledTime*sigma, 2);
            expect(payment).toBe(9.05);

            // console.log(totalBilledTime);
            // console.log("time1: ", time1);
            // console.log("time2: ", time2);
            // console.log("time3: ", time3);
            // console.log("time4: ", time4);

        });
    });


});

const roundNumber = (number, decimals) => {
    let exp = Math.pow(10 ,decimals);
    let _sigma = 5/exp;
    return parseFloat(((number * exp + _sigma)/exp).toFixed(decimals));
}