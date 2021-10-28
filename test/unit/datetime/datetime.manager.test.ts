import {DatetimeUtils} from "../../../src/datetime/datetimeUtils";

describe("Datetime manager", () => {
    it("get current time in pst", () => {
        let testTime = 1622870200949;
        jest.useFakeTimers("modern").setSystemTime(testTime);
        const currentTimeInPst = DatetimeUtils.getCurrentTimeInPst();
        expect(currentTimeInPst).toStrictEqual(1622837800949);

    })
    it('should return the current date format', function () {
        const epochTime = 1622271536548;
        expect(DatetimeUtils.getYYYYMMDDString(new Date(epochTime))).toBe("2021-05-29");
        const epochTimeWithTwoDigitMonthAndDay = 1639181520000;
        expect(DatetimeUtils.getYYYYMMDDString(new Date(epochTimeWithTwoDigitMonthAndDay))).toBe("2021-12-11");

    });
    it('should ', function () {
        const time = DatetimeUtils.getCurrentTimeInPst();
        console.log(DatetimeUtils.getYYYYMMDDString(new Date(time)))
    });

});
