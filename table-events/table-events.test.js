const {
    addUserToGame, removeUserFromGame,
    getUsers, getUserByName, reset, initPauseUser, endPauseUser
} = require('./table-events');
const tableEvents = require('./table-events');
const timeUtils = require('../utils/time-utils');

describe('TableEvents', () => {

    it('#addUserToGame', () => {
        reset();
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
        reset();
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
            reset();
            let p1 = addUserToGame('P1', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p2 = addUserToGame('P2', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p3 = addUserToGame('P3', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p4 = addUserToGame('P4', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));

            let users = getUsers();

            expect(users[p1.id].time.init).toBe(1526068800000);
            expect(users[p2.id].time.init).toBe(1526068800000);
            expect(users[p3.id].time.init).toBe(1526068800000);
            expect(users[p4.id].time.init).toBe(1526068800000);
        });

        it('should end player 3, 4, 2, 1 in different times and charge them accordingly', () => {

            reset();
            let p1 = addUserToGame('P1', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p2 = addUserToGame('P2', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p3 = addUserToGame('P3', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let p4 = addUserToGame('P4', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));

            // REMOVE player 3
            tableEvents.chargePlayer(p3.id, timeUtils.timeStringToMilliseconds("20:35:17", "11/05/2018"));
            let users = tableEvents.getUsers();
            expect(users[p3.id].time.end).toBe(1526070917000);
            expect(tableEvents.getChargedTime()).toBe(1526070917000);
            expect(tableEvents.getLastChargedId()).toBe(p3.id);
            users = tableEvents.getUsers();
            expect(users[p3.id].time.billable).toBe(529250);
            expect(users[p3.id].time.elapsed).toBe(2117000);

            // REMOVE player 4
            tableEvents.chargePlayer(p4.id, timeUtils.timeStringToMilliseconds("21:01:23", "11/05/2018"));
            users = tableEvents.getUsers();
            expect(users[p4.id].time.end).toBe(1526072483000);
            expect(tableEvents.getChargedTime()).toBe(1526072483000);
            expect(tableEvents.getLastChargedId()).toBe(p4.id);
            users = tableEvents.getUsers();
            expect(users[p4.id].time.billable).toBe(1051250);
            expect(users[p4.id].time.elapsed).toBe(3683000);

            // REMOVE player 2
            tableEvents.chargePlayer(p2.id, timeUtils.timeStringToMilliseconds("21:52:15", "11/05/2018"));
            users = tableEvents.getUsers();
            expect(users[p2.id].time.end).toBe(1526075535000);
            expect(tableEvents.getChargedTime()).toBe(1526075535000);
            expect(tableEvents.getLastChargedId()).toBe(p2.id);
            users = tableEvents.getUsers();
            expect(users[p2.id].time.billable).toBe(2577250);
            expect(users[p2.id].time.elapsed).toBe(6735000);

            // REMOVE player 1
            tableEvents.chargePlayer(p1.id, timeUtils.timeStringToMilliseconds("22:15:45", "11/05/2018"));
            users = tableEvents.getUsers();
            expect(users[p1.id].time.end).toBe(1526076945000);
            expect(tableEvents.getChargedTime()).toBe(1526076945000);
            expect(tableEvents.getLastChargedId()).toBe(p1.id);
            users = tableEvents.getUsers();
            expect(users[p1.id].time.billable).toBe(3987250);
            expect(users[p1.id].time.elapsed).toBe(8145000);


            const sigma = 4/3600;
            let time1 = users[p1.id].time.billable/1000;
            expect(time1).toBe(3987.25);
            let payment1 = timeUtils.roundNumber(time1*sigma, 2);
            expect(payment1).toBe(4.43);

            let time2 = users[p2.id].time.billable/1000;
            expect(time2).toBe(2577.25);
            let payment2 = timeUtils.roundNumber(time2*sigma, 2);
            expect(payment2).toBe(2.86);

            let time3 = users[p3.id].time.billable/1000;
            expect(time3).toBe(529.25);
            let payment3 = timeUtils.roundNumber(time3*sigma, 2);
            expect(payment3).toBe(0.59);

            let time4 = users[p4.id].time.billable/1000;
            expect(time4).toBe(1051.25);
            let payment4 = timeUtils.roundNumber(time4*sigma, 2);
            expect(payment4).toBe(1.17);

            let totalBilledTime = time1 + time2 +  time3 + time4;
            expect(totalBilledTime).toBe(8145);
            let payment = timeUtils.roundNumber(totalBilledTime*sigma, 2);
            expect(payment).toBe(9.05);

        });
    });

    describe('Testing a complete game ~EXAMPLE2', () => {

        it('should add and end players 3, 4, 2, 1 in different times and charge them accordingly', () => {

            reset();
            // entries p1
            let p1 = addUserToGame('P1', timeUtils.timeStringToMilliseconds("20:00:00", "11/05/2018"));
            let users = getUsers();
            expect(users[p1.id].time.init).toBe(1526068800000);

            // entries P2
            let p2 = addUserToGame('P2', timeUtils.timeStringToMilliseconds("20:10:00", "11/05/2018"));
            users = getUsers();
            expect(users[p2.id].time.init).toBe(1526069400000);
            // check P1 bill
            expect(users[p1.id].time.billable).toBe(600000);

            // entries P4
            let p4 = addUserToGame('P4', timeUtils.timeStringToMilliseconds("20:45:00", "11/05/2018"));
            users = getUsers();
            expect(users[p4.id].time.init).toBe(1526071500000);
            // check P2 bill
            expect(users[p2.id].time.billable).toBe(1050000);
            // check P1 bill
            expect(users[p1.id].time.billable).toBe(1650000);
            // exits P4
            tableEvents.chargePlayer(p4.id, timeUtils.timeStringToMilliseconds("21:46:23", "11/05/2018"));
            // check P4 bill
            expect(users[p4.id].time.billable).toBe(1227666.6666666667);
            // check P2 bill
            expect(users[p2.id].time.billable).toBe(2277666.666666667);
            // check P1 bill
            expect(users[p1.id].time.billable).toBe(2877666.666666667);

            // entries P3
            let p3 = addUserToGame('P3', timeUtils.timeStringToMilliseconds("21:50:48", "11/05/2018"));
            users = getUsers();
            expect(users[p3.id].time.init).toBe(1526075448000);
            // check P2 bill
            expect(users[p2.id].time.billable).toBe(2410166.666666667);
            // check P1 bill
            expect(users[p1.id].time.billable).toBe(3010166.666666667);

            // exits P3
            tableEvents.chargePlayer(p3.id, timeUtils.timeStringToMilliseconds("21:59:23", "11/05/2018"));
            // check P3 bill
            expect(users[p3.id].time.billable).toBe(171666.66666666666);
            // check P2 bill
            expect(users[p2.id].time.billable).toBe(2581833.3333333335);
            // check P1 bill
            expect(users[p1.id].time.billable).toBe(3181833.3333333335);

            // exits P2
            tableEvents.chargePlayer(p2.id, timeUtils.timeStringToMilliseconds("22:02:25", "11/05/2018"));
            // check P2 bill
            expect(users[p2.id].time.billable).toBe(2672833.3333333335);
            // check P1 bill
            expect(users[p1.id].time.billable).toBe(3272833.3333333335);

            // exits P1
            tableEvents.chargePlayer(p1.id, timeUtils.timeStringToMilliseconds("22:15:45", "11/05/2018"));
            // check P1 bill
            expect(users[p1.id].time.billable).toBe(4072833.3333333335);

            // See the results
            const sigma = 4/(60*60*1000);

            let time3 = users[p3.id].time.billable;
            expect(time3).toBe(171666.66666666666);
            let payment3 = timeUtils.roundNumber(time3*sigma, 2);
            expect(payment3).toBe(0.19);

            let time4 = users[p4.id].time.billable;
            expect(time4).toBe(1227666.6666666667);
            let payment4 = timeUtils.roundNumber(time4*sigma, 2);
            expect(payment4).toBe(1.36);

            let time2 = users[p2.id].time.billable;
            expect(time2).toBe(2672833.3333333335);
            let payment2 = timeUtils.roundNumber(time2*sigma, 2);
            expect(payment2).toBe(2.97);

            let time1 = users[p1.id].time.billable;
            expect(time1).toBe(4072833.3333333335);
            let payment1 = timeUtils.roundNumber(time1*sigma, 2);
            expect(payment1).toBe(4.53);

            let totalBilledTime = time1 + time2 +  time3 + time4;
            expect(totalBilledTime).toBe(8145000.000000001);
            let payment = timeUtils.roundNumber(totalBilledTime*sigma, 2);
            expect(payment).toBe(9.05);

        });

    });


    describe('Testing a complete game ~EXAMPLE3', () => {

        it('should add and end players 3, 4, 2, 1 in different times , and P2 will pause 2 times. Charge them accordingly', () => {
            const testingDate = "11/05/2018"; // spanish format
            // timeStringToMilliseconds must be a very well tested function
            reset();

            // Entries P1
            let lastInitTime = timeUtils.timeStringToMilliseconds("20:00:00", testingDate);
            let p1 = addUserToGame('P1', lastInitTime);
            let users = getUsers();
            expect(users[p1.id].time.init).toBe(lastInitTime);

            // Entries P2.
            lastInitTime = timeUtils.timeStringToMilliseconds("20:10:00", testingDate);
            let p2 = addUserToGame('P2', lastInitTime);
            users = getUsers();
                // Check P2 time init
            expect(users[p2.id].time.init).toBe(lastInitTime);
            // Check P1 time.billable
            expect(users[p1.id].time.billable).toBe(600000);

            // Entries P4
            lastInitTime = timeUtils.timeStringToMilliseconds("20:45:00", testingDate);
            let p4 = addUserToGame('P4', lastInitTime);
            users = getUsers();
                // Check P4 time.init
            expect(users[p4.id].time.init).toBe(lastInitTime);
                // Check P1 time.billable
            expect(users[p1.id].time.billable).toBe(1650000);
                // Check P2 time.billable
            expect(users[p2.id].time.billable).toBe(1050000);

            // Init pause P2
            let lastPauseTime = timeUtils.timeStringToMilliseconds("20:52:12", testingDate);
            initPauseUser(p2.id, lastPauseTime);
            users = getUsers();
            // Check P2 time.pause ...
            let initPause = users[p2.id].time.pauses[users[p2.id].time.pauses.length - 1].init;
            expect(initPause).toBe(lastPauseTime);
            // Check P1 time.billable
            expect(users[p1.id].time.billable).toBe(1794000);
                // Check P2 time.billable
            expect(users[p2.id].time.billable).toBe(1194000);

            // Exits P4
            let lastEndTime = timeUtils.timeStringToMilliseconds("21:46:23", testingDate);
            tableEvents.chargePlayer(p4.id, lastEndTime);
            users = getUsers();
                // Check P4 time.end
            expect(users[p4.id].time.end).toBe(lastEndTime);
                // Check P1 time.billable
            expect(users[p1.id].time.billable).toBe(3419500);
                // Check P2 time.billable
            expect(users[p2.id].time.billable).toBe(1194000);
                // Check P4 time.billable
            expect(users[p4.id].time.billable).toBe(1769500);

            // Entries P3
            lastInitTime = timeUtils.timeStringToMilliseconds("21:50:48", testingDate);
            p3 = addUserToGame('P3', lastInitTime);
            users = getUsers();
                // Check P3 time.init
            expect(users[p3.id].time.init).toBe(lastInitTime);
                // Check P1 time.billable
            expect(users[p1.id].time.billable).toBe(3684500);

            // End pause P2
            lastPauseTime = timeUtils.timeStringToMilliseconds("21:52:47", testingDate);
            p2 = endPauseUser(p2.id, lastPauseTime);
                // Check P2 time.pause
            let endPause = users[p2.id].time.pauses[users[p2.id].time.pauses.length - 1].end;
            expect(endPause).toBe(lastPauseTime);
                // Check P1 time.billable
            expect(users[p1.id].time.billable).toBe(3744000);
                // Check P3 time.billable
            expect(users[p3.id].time.billable).toBe(59500);

            // Exits P3
            lastEndTime = timeUtils.timeStringToMilliseconds("21:56:23", testingDate);
            tableEvents.chargePlayer(p3.id, lastEndTime);
            users = getUsers();
                // Check P3 time.end
            expect(users[p3.id].time.end).toBe(lastEndTime);
                // Check P1 time.billable
                //TODO: CHECK THIS ONE!
            expect(users[p1.id].time.billable).toBe(3816000);
                // Check P2 time.billable
            expect(users[p2.id].time.billable).toBe(1266000);
                // Check P3 time.billable
            expect(users[p3.id].time.billable).toBe(131500);

            // Init pause P2
            lastPauseTime = timeUtils.timeStringToMilliseconds("21:57:39", testingDate);
            p2 = initPauseUser(p2.id, lastPauseTime);
                // Check P2 time.pause ...
            initPause = p2.time.pauses[p2.time.pauses.length - 1].init;
            expect(initPause).toBe(lastPauseTime);
                // Check P1 time.billable
            expect(users[p1.id].time.billable).toBe(3854000);
                // Check P2 time.billable
            expect(users[p2.id].time.billable).toBe(1304000);

            // End pause P2
            lastPauseTime = timeUtils.timeStringToMilliseconds("22:00:02", testingDate);
            p2 = endPauseUser(p2.id, lastPauseTime);
            endPause = p2.time.pauses[p2.time.pauses.length - 1].end;
                // Check P2 time.pause
            expect(endPause).toBe(lastPauseTime);
                // Check P1 time.billable
            expect(users[p1.id].time.billable).toBe(3997000);

            // Exits P2
            lastEndTime = timeUtils.timeStringToMilliseconds("22:02:25", testingDate);
            tableEvents.chargePlayer(p2.id, lastEndTime);
            users = getUsers();
                // Check P2 time.end
            expect(users[p2.id].time.end).toBe(lastEndTime);
                // Check P1 time.billable
            expect(users[p1.id].time.billable).toBe(4068500);
                // Check P2 time.billable
            expect(users[p2.id].time.billable).toBe(1375500);

            // Exits P1
            lastEndTime = timeUtils.timeStringToMilliseconds("22:15:45", testingDate);
            tableEvents.chargePlayer(p1.id, lastEndTime);
            users = getUsers();
                // Check P1 time.end
            expect(users[p1.id].time.end).toBe(lastEndTime);
                // Check P1 time.billable
            expect(users[p1.id].time.billable).toBe(4868500);

            /* Check the results */
            const sigma = 4/(60*60*1000);

            let time3 = users[p3.id].time.billable;
            expect(time3).toBe(131500);
            let payment3 = timeUtils.roundNumber(time3*sigma, 2);
            // expect(payment3).toBe(0.19);

            let time4 = users[p4.id].time.billable;
            expect(time4).toBe(1769500);
            let payment4 = timeUtils.roundNumber(time4*sigma, 2);
            // expect(payment4).toBe(1.36);

            let time2 = users[p2.id].time.billable;
            expect(time2).toBe(1375500);
            let payment2 = timeUtils.roundNumber(time2*sigma, 2);
            // expect(payment2).toBe(2.97);

            let time1 = users[p1.id].time.billable;
            expect(time1).toBe(4868500);
            let payment1 = timeUtils.roundNumber(time1*sigma, 2);
            // expect(payment1).toBe(4.53);

            let totalBilledTime = time1 + time2 +  time3 + time4;
            // expect(totalBilledTime).toBe(8145000.000000001);
            expect(totalBilledTime).toBe(8145000);
            let payment = timeUtils.roundNumber(totalBilledTime*sigma, 2);
            // expect(payment).toBe(9.05);
        });
    });
});
