import {Background} from "../../../src/background/background";
import {instance, mock, verify, when} from "ts-mockito";
import {ArrowexTimer} from "../../../src/model/ArrowexTimer";
import {ChromeAPI} from "../../../src/chrome/ChromeAPI";
import {EWOQ_OPENED, NTA} from "../../../src/common/messages";
import {PremiumManager} from "../../../src/model/Premium";

describe('Background', function () {
    const arrowexTimerMock = mock(ArrowexTimer);
    const arrowexTimer = instance(arrowexTimerMock);
    const chromeApiMock = mock(ChromeAPI);
    const chromeApi = instance(chromeApiMock);
    const premiumManagerMock = mock(PremiumManager);
    const premiumManager = instance(premiumManagerMock)

    const background = new Background(arrowexTimer, chromeApi, premiumManager);

    it('should detect if ewoq is not in the opened tabs', function () {
        const tabs = [{url: "foo.com"}, {url: "asd.com"}];
        expect(background.isEwoqOpened(tabs)).toBe(false);

    });

    it('should detect if ewoq is in the opened tabs', function () {
        const tabs = [{url: "https://rating.ewoq.google.com/u/0/task/something"}, {url: "asd.com"}];
        expect(background.isEwoqOpened(tabs)).toBe(true);

    });

    it('should init timer when ewoq opened', async function () {
        when(arrowexTimerMock.init()).thenReturn()
        jest.spyOn(background, "checkForTabClose");

        await background.handleMessage({msg: EWOQ_OPENED});
        verify(arrowexTimerMock.init()).called();
        expect(background.checkForTabClose).toHaveBeenCalled()
    });

    it('should create nta report notification', async function () {
        jest.spyOn(background, "createNtaReportNotification");
        await background.handleMessage({msg: NTA});
        expect(background.createNtaReportNotification).toHaveBeenCalled()
    });

});
