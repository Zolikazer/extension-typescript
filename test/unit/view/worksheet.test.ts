import { Worksheet } from "../../../src/view/worksheet/worksheet";
import { instance, mock, when } from "ts-mockito";
import { ArrowexTimer } from "../../../src/model/ArrowexTimer";
import { DatetimeUtils } from "../../../src/datetime/datetimeUtils";
import { ChromeAPI } from "../../../src/chrome/ChromeAPI";

describe("Worksheet", function() {
    const arrowexTimerMock = mock(ArrowexTimer);
    const arrowexTimer = instance(arrowexTimerMock);
    const chromeApi = instance(mock(ChromeAPI));
    const worksheet = new Worksheet(arrowexTimer, chromeApi);
    const datetimeUtilsMock = jest.spyOn(DatetimeUtils, "getCurrentTimeInPst");


    test("getLastWorkedDayThatIsNotToday should return previous day's data", function() {
        datetimeUtilsMock.mockReturnValue(new Date("2022-01-11").getTime());
        when(arrowexTimerMock.worksheet).thenReturn({
            "2022-01-09": {
                "taskCount": 12,
                "workedSeconds": 577.962
            },
            "2022-01-10": {
                "taskCount": 20,
                "workedSeconds": 746.805
            },
            "2022-01-11": {
                "taskCount": 40,
                "workedSeconds": 1361.809
            }
        });
        expect(worksheet.getLastWorkedDayThatIsNotToday()).toStrictEqual({
            "date": "2022-01-10",
            "taskCount": 20,
            "workedSeconds": 746.805
        });

    });

    test("getLastWorkedDayThatIsNotToday should return last worked day's data", function() {
        datetimeUtilsMock.mockReturnValue(new Date("2022-01-12").getTime());
        when(arrowexTimerMock.worksheet).thenReturn({
            "2022-01-09": {
                "taskCount": 12,
                "workedSeconds": 577.962
            },
            "2022-01-10": {
                "taskCount": 20,
                "workedSeconds": 746.805
            },
            "2022-01-11": {
                "taskCount": 40,
                "workedSeconds": 1361.809
            }
        });
        expect(worksheet.getLastWorkedDayThatIsNotToday()).toStrictEqual({
            "date": "2022-01-11",
            "taskCount": 40,
            "workedSeconds": 1361.809
        });

    });
});
