import {DatetimeManager} from "../../../src/datetime/datetimeManager";

describe("Datetime manager", () => {
    const datetimeManager = new DatetimeManager();

    it("get current time in pst", () => {
        let testTime = 1622870200949;
        jest.useFakeTimers("modern").setSystemTime(testTime);
        const currentTimeInPst = datetimeManager.getCurrentTimeInPst();
        expect(currentTimeInPst).toStrictEqual(1622837800949);

    })
    it('should return the current date format', function () {
        const epochTime = 1622271536548;
        expect(datetimeManager.getYYYYMMDDString(new Date(epochTime))).toBe("2021-05-29");

    });

});
