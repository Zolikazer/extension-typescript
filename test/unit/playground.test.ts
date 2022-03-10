import { DatetimeUtils } from "../../src/datetime/datetimeUtils";

describe("Playground", function() {
    test("foo", () => {
        console.log(new Date(DatetimeUtils.getCurrentTimeInPst()).toISOString());

    });

});
