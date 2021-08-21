import {ArrowexTimer} from "../../../src/model/ArrowexTimer";
import {instance, mock, when} from "ts-mockito";
import {ChromeAPI} from "../../../src/chrome/ChromeAPI";
import {PopupElementBuilder} from "../../../src/view/popup/popup";
import {ArrowexTimerSettings} from "../../../src/model/ArrowexTimerSettings";


describe('PopupElementBuilder', function () {
    const arrowexTimerMock = mock(ArrowexTimer);
    const arrowexTimer = instance(arrowexTimerMock);
    const chromeApiMock = mock(ChromeAPI);
    const chromeApi = instance(chromeApiMock);

    const arrowexTimerSettingsMock = mock(ArrowexTimerSettings);
    const arrowexTimerSettings = instance(arrowexTimerSettingsMock);

    const popupElementBuilder = new PopupElementBuilder(arrowexTimer);

    it('should render proper counting status', function () {
        when(arrowexTimerMock.isCounting).thenReturn(false);
        expect(popupElementBuilder.getCountingStatus()).toBe(
            "<span style='color:#FF0000;font-weight:bold'>Not counting</span>");

        when(arrowexTimerMock.isCounting).thenReturn(true);
        expect(popupElementBuilder.getCountingStatus()).toBe(
            "<span style='color:#006400;font-weight:bold'>Counting</span>");

    });

    it('should render money earned', function () {
        when(arrowexTimerMock.workedSeconds).thenReturn(3600);
        when(arrowexTimerMock.settings).thenReturn(arrowexTimerSettings);
        when(arrowexTimerSettingsMock.moneyEarned).thenReturn({
                payrate: 300,
                currency: "HUF",
                conversionRate: 300
            }
        );
        expect(popupElementBuilder.getMoneyEarned()).toBe("90000.00 HUF");
    });

});
