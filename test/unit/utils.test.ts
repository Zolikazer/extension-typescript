import {calculateRph} from "../../src/common/utils";

describe('utils', function () {
    it('should calculate rph', function () {
        expect(calculateRph(60, 60)).toBe(1);
        expect(calculateRph(15, 2)).toBe(7);
    });

});
