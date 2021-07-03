import {ArrowexTimer} from "../../src/model/arrowexTimer";
import {ChromeStorage} from "../../src/storage/chromeStorage";
import {mock, when} from "ts-mockito";

const testData: { [index: string]: any } = {
    "taskCount": 0,
    "startTime": 0,
    "stopTime": 0,
    "workedSeconds": 0,
    "isCounting": false,
    "currentTaskName": "TestName",
    "tasks": {},
    "lastSubmit": 12132123,
    "settings": {
        "warnIfForgotToStart": true,
        "moneyEarned": {"payrate": 0, "currency": "USD", "conversionRate": 15},
        "submitTimeEnabled": true,
        "submitTime": 45,
        "autoSubmitTimes": {},
        "instructionTimeEnabled": true,
        "instructionTime": 120
    },
    "worksheet": {}
}


describe('ArrowexTimer', function () {
    const storage:ChromeStorage = mock(ChromeStorage);
    const arrowexTimer = new ArrowexTimer(storage);

    beforeEach(() => {
        when(storage.get(null)).thenReturn(testData);

    })

    it('should initialize when called init', function () {
        arrowexTimer.ini
    });
});