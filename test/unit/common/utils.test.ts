import {calculateRph, getWorkedTimeString} from "../../../src/common/utils";

describe('utils', function () {
    it('should calculate rph', function () {
        expect(calculateRph(60, 60)).toBe(1);
        expect(calculateRph(15, 2)).toBe(7);
    });

    it('return the correct worked time', function () {
        expect(getWorkedTimeString(600)).toBe("00:10");
        expect(getWorkedTimeString(6050)).toBe("01:40");
    });

});
