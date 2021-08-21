import {ArrowexTimer} from "../../../src/model/ArrowexTimer";
import {instance, mock, when} from "ts-mockito";
import {ChromeAPI} from "../../../src/chrome/ChromeAPI";
import {Popup} from "../../../src/view/popup/popup";
import {ArrowexTimerSettings} from "../../../src/model/ArrowexTimerSettings";


describe('Popup', function () {
    const arrowexTimerMock = mock(ArrowexTimer);
    const arrowexTimer = instance(arrowexTimerMock);
    const chromeApiMock = mock(ChromeAPI);
    const chromeApi = instance(chromeApiMock);

    const arrowexTimerSettingsMock = mock(ArrowexTimerSettings);
    const arrowexTimerSettings = instance(arrowexTimerSettingsMock);

    const popup = new Popup(arrowexTimer, chromeApi);

    it('should render proper counting status', function () {
        when(arrowexTimerMock.isCounting).thenReturn(false);
        expect(popup.getCountingStatus()).toBe(
            "<span style='color:#FF0000;font-weight:bold'>Not counting</span>");

        when(arrowexTimerMock.isCounting).thenReturn(true);
        expect(popup.getCountingStatus()).toBe(
            "<span style='color:#006400;font-weight:bold'>Counting</span>");

    });

    it('should render money earned', function () {
        when(arrowexTimerMock.workedSeconds).thenReturn(3600);
        when(arrowexTimerMock.settings).thenReturn(arrowexTimerSettings);
        when(arrowexTimerSettingsMock.moneyEarned).thenReturn({
            moneyEarned: {
                payrate: 300,
                currency: "HUF",
                conversionRate: 300
            }
        });
        expect(popup.getMoneyEarned()).toBe(3000);
    });

});
