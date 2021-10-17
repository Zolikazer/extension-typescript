import {DomInspector} from "./DomInspector";
import {ChromeAPI} from "../chrome/ChromeAPI";
import {DatetimeUtils} from "../datetime/datetimeUtils";
import {NTA} from "../common/messages";

export class NtaReminder {
    private static readonly LOCATIONS = ["https://rating.ewoq.google.com/u/0/home",
        "https://rating.ewoq.google.com/u/0/", "https://rating.ewoq.google.com"];

    private readonly chromeApi: ChromeAPI;

    constructor(chromeApi: ChromeAPI) {
        this.chromeApi = chromeApi;
    }

    notifyAboutNtaReporting() {
        this.checkForNta();
        setTimeout(() => this.checkForNta(), DatetimeUtils.convertMinutesToMilliseconds(180));
    }

    private checkForNta() {
        if (NtaReminder.LOCATIONS.includes(document.location.href)) {
            const getTaskBtn = DomInspector.getAcquireTaskButton();
            // @ts-ignore
            let isActive = (getTaskBtn.ariaDisabled === "false");

            if (!isActive) {
                console.log("sending msg...")
                this.chromeApi.sendMessage({msg: NTA})
            }
        }
    }

}
