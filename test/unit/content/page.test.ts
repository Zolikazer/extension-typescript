import {EwoqHomePage, InstructionPage, OtherPage, PageFactory, RatingPage} from "../../../src/content/page";
import {DomInspector} from "../../../src/content/DomInspector";
import {anything, instance, mock, reset, verify, when} from "ts-mockito";
import {ChromeAPI} from "../../../src/chrome/ChromeAPI";
import {InstructionTimer} from "../../../src/content/InstructionTimer";
import {ArrowexTimer} from "../../../src/model/ArrowexTimer";
import {DatetimeUtils, ONE_SECOND_IN_MILLISECONDS} from "../../../src/datetime/datetimeUtils";
import {ArrowexTimerSettings} from "../../../src/model/ArrowexTimerSettings";
import {NtaReminder} from "../../../src/content/NtaReminder";

describe('Page', function () {
    const chromeApiMock = mock(ChromeAPI);
    const chromeApi = instance(chromeApiMock);

    const arrowexTimerMock = mock(ArrowexTimer);
    const arrowexTimer = instance(arrowexTimerMock);
    const pageFactory = new PageFactory(chromeApi, arrowexTimer);

    const getContinueButtonMock = jest.spyOn(DomInspector, "getContinueButton");
    const getSubmitButtonMock = jest.spyOn(DomInspector, "getSubmitButton");
    const getAcquireTaskButtonMock = jest.spyOn(DomInspector, "getAcquireTaskButton");

    it('page factory should return InstructionPage', function () {
        // @ts-ignore
        getContinueButtonMock.mockReturnValue("not undefined")
        expect(pageFactory.getPage()).toBeInstanceOf(InstructionPage);

    });

    it('page factory should return RatingPage', function () {
        getContinueButtonMock.mockReturnValue(undefined)
        // @ts-ignore
        getSubmitButtonMock.mockReturnValue("not null");
        expect(pageFactory.getPage()).toBeInstanceOf(RatingPage)

    });

    it('page factory should return OtherPage', function () {
        getContinueButtonMock.mockReturnValue(undefined);
        getSubmitButtonMock.mockReturnValue(null);
        getAcquireTaskButtonMock.mockReturnValue(null);
        expect(pageFactory.getPage()).toBeInstanceOf(OtherPage);

    });

    it('page factory should return EwoqHomePage', function () {
        getContinueButtonMock.mockReturnValue(undefined);
        getSubmitButtonMock.mockReturnValue(null);
        // @ts-ignore
        getAcquireTaskButtonMock.mockReturnValue("notnull");

        expect(pageFactory.getPage()).toBeInstanceOf(EwoqHomePage);

    });


});


describe('InstructionPage', function () {
    const instructionTimerMock = mock(InstructionTimer);
    const instructionTimer = instance(instructionTimerMock);

    const chromeApiMock = mock(ChromeAPI);
    const chromeApi = instance(chromeApiMock);

    const arrowexTimerMock = mock(ArrowexTimer);
    const arrowexTimer = instance(arrowexTimerMock);


    it('InstructionPage should stop the timer and add instruction timer', function () {
        when(arrowexTimerMock.stopTimer()).thenReturn()
        when(arrowexTimerMock.isCounting).thenReturn(true);

        const instructionPage = new InstructionPage(instructionTimer, arrowexTimer);

        instructionPage.adjustTimer();
        verify(arrowexTimerMock.stopTimer()).called()

    });

    it('InstructionPage should add instruction timer', function () {
        const instructionPage = new InstructionPage(instructionTimer, arrowexTimer);
        when(instructionTimerMock.addTimerToInstruction()).thenReturn()

        instructionPage.doOtherStuff();
        verify(instructionTimerMock.addTimerToInstruction()).called()


    });

});


describe('RatingPage', function () {
    const arrowexTimerMock = mock(ArrowexTimer);
    const arrowexTimer = instance(arrowexTimerMock);

    const arrowexTimerSettingsMock = mock(ArrowexTimerSettings);
    const arrowexTimerSettings = instance(arrowexTimerSettingsMock);

    const chromeApiMock = mock(ChromeAPI);
    const chromeApi = instance(chromeApiMock);

    const datetimeUtilsMock = jest.spyOn(DatetimeUtils, "getCurrentTimeInPst");

    beforeAll(() => {
        when(arrowexTimerMock.settings).thenReturn(arrowexTimerSettings);
    });

    afterEach(() => {
        reset(chromeApiMock);
    })

    it('should start the timer', function () {
        const ratingPage = new RatingPage(arrowexTimer, chromeApi);
        when(arrowexTimerMock.startTimer()).thenReturn();

        ratingPage.adjustTimer();

        verify(arrowexTimerMock.startTimer()).called();

    });

    it('should warn to submit', function () {
        when(arrowexTimerSettingsMock.submitTime).thenReturn(0);
        when(arrowexTimerMock.lastSubmit).thenReturn(0);
        when(arrowexTimerSettingsMock.submitTimeEnabled).thenReturn(true);
        datetimeUtilsMock.mockReturnValue(11 * ONE_SECOND_IN_MILLISECONDS);
        const ratingPage = new RatingPage(arrowexTimer, chromeApi);
        datetimeUtilsMock.mockReturnValue(100 * ONE_SECOND_IN_MILLISECONDS);

        ratingPage.doOtherStuff();

        verify(chromeApiMock.sendMessage(anything())).called();

    });

    it('should not warn to submit if submit time is not enabled', function () {
        when(arrowexTimerSettingsMock.submitTime).thenReturn(0);
        when(arrowexTimerMock.lastSubmit).thenReturn(0);
        when(arrowexTimerSettingsMock.submitTimeEnabled).thenReturn(false);
        datetimeUtilsMock.mockReturnValue(11 * ONE_SECOND_IN_MILLISECONDS);
        const ratingPage = new RatingPage(arrowexTimer, chromeApi);
        datetimeUtilsMock.mockReturnValue(100 * ONE_SECOND_IN_MILLISECONDS);

        ratingPage.doOtherStuff();

        verify(chromeApiMock.sendMessage(anything())).never();

    });

    it('should not warn to submit if submit time is not expired', function () {
        when(arrowexTimerSettingsMock.submitTime).thenReturn(30);
        when(arrowexTimerMock.lastSubmit).thenReturn(0);
        when(arrowexTimerSettingsMock.submitTimeEnabled).thenReturn(true);
        datetimeUtilsMock.mockReturnValue(11 * ONE_SECOND_IN_MILLISECONDS);
        const ratingPage = new RatingPage(arrowexTimer, chromeApi);
        datetimeUtilsMock.mockReturnValue(12 * ONE_SECOND_IN_MILLISECONDS);

        ratingPage.doOtherStuff();

        verify(chromeApiMock.sendMessage(anything())).never();

    });
});

describe('EwoqHomepage', function () {
    const arrowexTimerMock = mock(ArrowexTimer);
    const arrowexTimer = instance(arrowexTimerMock);

    const ntaReminderMock = mock(NtaReminder);
    const ntaReminder = instance(ntaReminderMock);


    it('should stop the timer', async function () {
        const ewoqHomepage = new EwoqHomePage(arrowexTimer, ntaReminder);
        when(arrowexTimerMock.isCounting).thenReturn(true);

        await ewoqHomepage.adjustTimer();

        verify(arrowexTimerMock.stopTimer()).called();

    });

});


describe('Other page', function () {
    const arrowexTimerMock = mock(ArrowexTimer);
    const arrowexTimer = instance(arrowexTimerMock);

    it('should stop the timer', function () {
        const otherPage = new OtherPage(arrowexTimer);
        when(arrowexTimerMock.isCounting).thenReturn(true);

        otherPage.adjustTimer();

        verify(arrowexTimerMock.stopTimer()).called()
    });
});
