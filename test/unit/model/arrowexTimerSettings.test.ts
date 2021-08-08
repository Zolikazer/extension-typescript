import {ArrowexTimerSettings} from "../../../src/model/ArrowexTimerSettings";
import {settingsTestData} from "../testDatas";
import {ChromeStorageMock} from "../mockImplementations";

describe('Arrowex Timer Setting', function () {
    const storage = new ChromeStorageMock();
    const arrowexTimerSettings = new ArrowexTimerSettings(storage);

    it('should init from chrome', function () {
        arrowexTimerSettings.updateStateWith(settingsTestData);
        expect(arrowexTimerSettings.submitTime).toBe(settingsTestData.submitTime);
        expect(arrowexTimerSettings.submitTimeEnabled).toBe(settingsTestData.instructionTimeEnabled);
        expect(arrowexTimerSettings.instructionTimeEnabled).toBe(settingsTestData.submitTimeEnabled);
        expect(arrowexTimerSettings.moneyEarned).toBe(settingsTestData.moneyEarned);
        expect(arrowexTimerSettings.warnIfForgotToStart).toBe(settingsTestData.warnIfForgotToStart);
        expect(arrowexTimerSettings.instructionTime).toBe(settingsTestData.instructionTime);

    });

    it('should save its state to chrome when save state called', async function () {
        arrowexTimerSettings.updateStateWith(settingsTestData);
        jest.spyOn(storage, "set");

        await arrowexTimerSettings.saveState();
        expect(storage.set).toBeCalledWith(settingsTestData);
    });

});
