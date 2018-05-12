const timeUtils = require('./time-utils');

describe('TimeUtils', () => {
    it("#toSeconds", () => {
        const res = timeUtils.toSeconds('00', '30', '59');
        expect(res).toBe(1859);
    });
    it("#timeStringToSeconds", () => {
        let res = timeUtils.timeStringToSeconds('00:30:59');
        expect(res).toBe(1859);
        res = timeUtils.timeStringToSeconds('2:15:45');
        expect(res).toBe(8145);

    });
    it('#timeStringToMilliseconds', () => {
        let res = timeUtils.timeStringToMilliseconds("20:00:00");
        // expect(res).toBe(1526148000000) // GMT +2
        expect(res).toBe(1526140800000) // GMT 0
    });
});