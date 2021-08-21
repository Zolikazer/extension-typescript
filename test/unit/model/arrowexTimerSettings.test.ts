import {ArrowexTimerSettings} from "../../../src/model/ArrowexTimerSettings";
import {settingsTestData} from "../testDatas";
import {ChromeStorageMock} from "../mockImplementations";
import {anything, deepEqual, instance, mock, verify, when} from "ts-mockito";
import {ChromeStorage} from "../../../src/chrome/ChromeStorage";

describe('Arrowex Timer Setting', function () {
    const storageMock = mock(ChromeStorage);
    const storage = instance(storageMock);
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
        when(storageMock.set(anything())).thenReturn()

        arrowexTimerSettings.updateStateWith(settingsTestData);
        await arrowexTimerSettings.saveState();

        verify(storageMock.set(deepEqual({settings: settingsTestData}))).called()
    });

});
