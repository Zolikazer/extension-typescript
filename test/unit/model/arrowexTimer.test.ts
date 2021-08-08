import {ArrowexTimer} from "../../../src/model/ArrowexTimer";
import {testDataNotCounting, testDataCounting, testWorksheetData} from "../testDatas";
import {DatetimeMangerMock, ChromeStorageMock} from "../mockImplementations";
import deepcopy from "deepcopy";


describe('ArrowexTimer', function () {
    const storage = new ChromeStorageMock();
    const datetimeManager = new DatetimeMangerMock();
    const arrowexTimer = new ArrowexTimer(storage, datetimeManager);

    afterEach(() => {
        jest.clearAllMocks();
    });


    it('should initialize when called init', async function () {
        storage.setStorageTo(testDataNotCounting);
        jest.spyOn(arrowexTimer, "notify");

        await arrowexTimer.init();
        expect(arrowexTimer.taskCount).toBe(testDataNotCounting.taskCount);
        expect(arrowexTimer.lastSubmit).toBe(testDataNotCounting.lastSubmit);
        expect(arrowexTimer.startTime).toBe(testDataNotCounting.startTime);
        expect(arrowexTimer.stopTime).toBe(testDataNotCounting.stopTime);
        expect(arrowexTimer.worksheet).toBe(testDataNotCounting.worksheet);
        expect(arrowexTimer.currentTaskName).toBe(testDataNotCounting.currentTaskName)

    });

    it('should calculate worked second dynamically if timer is running', async function () {
        // given
        storage.setStorageTo(deepcopy(testDataCounting));
        datetimeManager.setPstTime(10000);
        await arrowexTimer.init()


        expect(arrowexTimer.workedSeconds).toBe(20);
    });

    it('should set the proper field in chrome when timer started ', async function () {
        jest.spyOn(storage, "set");
        const time = 10;
        datetimeManager.setPstTime(time);

        await arrowexTimer.startTimer();
        expect(storage.set).toBeCalledWith({
            "startTime": time,
            "isCounting": true,
            "lastSubmit": time
        })

    });

    it('should set the proper field in chrome when timer stopped', async function () {
        jest.spyOn(storage, "set");
        const time = 10000;
        datetimeManager.setPstTime(time);
        storage.setStorageTo(deepcopy(testDataCounting));
        await arrowexTimer.init()

        await arrowexTimer.stopTimer();

        expect(storage.set).toBeCalledWith({
            "workedSeconds": 20,
            "stopTime": time,
            "isCounting": false
        })

    });
    it('should set the proper field in chrome when timer stopped and update its field', async function () {
        jest.spyOn(storage, "set");
        const time = 10000;
        datetimeManager.setPstTime(time);
        storage.setStorageTo(deepcopy(testDataCounting));
        await arrowexTimer.init()

        await arrowexTimer.stopTimer();

        expect(storage.set).toBeCalledWith({
            "workedSeconds": 20,
            "stopTime": time,
            "isCounting": false
        })

    });

    it('should set proper fields when reset timer is called', async function () {
        jest.spyOn(storage, "set");
        const time = 10000;
        datetimeManager.setPstTime(time);
        storage.setStorageTo(deepcopy(testDataCounting));
        const expectedWorksheet = {"1970-01-01": {workedSeconds: 20, taskCount: 3}}

        await arrowexTimer.init()

        await arrowexTimer.resetTimer();
        expect(storage.set).toBeCalledWith({
            "taskCount": 0,
            "startTime": 0,
            "stopTime": 0,
            "workedSeconds": 0,
            "isCounting": false,
            "currentTaskName": null,
            "tasks": {},
            "lastSubmit": null,
            "worksheet": expectedWorksheet
        })

    });

    it('should not reset timer if last submit is null', async function () {
        jest.spyOn(storage, "set");
        storage.setStorageTo(testDataNotCounting);
        await arrowexTimer.init();

        await arrowexTimer.resetTimer();

        expect(storage.set).toBeCalledTimes(0);

    });

    it('should save counted task to chrome when count task method called', async function () {
        jest.spyOn(storage, "set");
        storage.setStorageTo(deepcopy(testDataCounting));
        await arrowexTimer.init();
        const time = 30000;
        datetimeManager.setPstTime(time);

        await arrowexTimer.countTask("TestName");

        expect(storage.set).toBeCalledWith({
            "taskCount": 4,
            "currentTaskName": "TestName",
            "tasks": {TestName: {taskCount: 4, time: 20000}},
            "lastSubmit": time
        })

    });

    it('should return the proper last day from the worksheet', async function () {
        storage.setStorageTo(testWorksheetData);
        await arrowexTimer.init();

        expect(arrowexTimer.getLastDayFromWorksheet()).toStrictEqual({
            "date": "2021-01-01",
            workedSeconds: 5,
            taskCount: 6
        })

    });
    it('should return the current task data', async function () {
        storage.setStorageTo(deepcopy(testDataCounting));
        await arrowexTimer.init();
        expect(arrowexTimer.currentTaskData).toStrictEqual({taskCount: 3, time: 10000});
    });

});
