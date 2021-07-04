import {ArrowexTimer} from "../../src/model/arrowexTimer";
import {ChromeStorage} from "../../src/storage/chromeStorage";

const testData = {
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


jest.mock("../../src/storage/chromeStorage", () => {
    return {
        ChromeStorage: jest.fn().mockImplementation(() => {
            return {
                get: (keys: null): Promise<any> => {
                    return new Promise<Object>((resolve, reject) => {
                        resolve(testData);
                    });
                },
            };
        })
    };
});

describe('ArrowexTimer', function () {
    const storage = new ChromeStorage();
    const arrowexTimer = new ArrowexTimer(storage);

    beforeEach(() => {

    })

    it('should initialize when called init', async function () {
        jest.spyOn(arrowexTimer, "notify");

        await arrowexTimer.init();
        expect(arrowexTimer.taskCount).toBe(testData.taskCount);
        expect(arrowexTimer.lastSubmit).toBe(testData.lastSubmit);
        expect(arrowexTimer.startTime).toBe(testData.startTime);
        expect(arrowexTimer.stopTime).toBe(testData.stopTime);
        expect(arrowexTimer.worksheet).toBe(testData.worksheet);
        expect(arrowexTimer.currentTaskName).toBe(testData.currentTaskName)

        expect(arrowexTimer.notify).toBeCalledWith("initialized")
    });
});