import {DomInspector} from "./DomInspector";
import {ChromeAPI} from "../chrome/ChromeAPI";
import {DatetimeManager} from "../datetime/datetimeManager";

export class NtaNotifier {
    private static LOCATIONS = ["https://rating.ewoq.google.com/u/0/home",
        "https://rating.ewoq.google.com/u/0/", "https://rating.ewoq.google.com"];

    private domInspector: DomInspector;
    private chromeApi: ChromeAPI;
    private datetimeManager: DatetimeManager;

    constructor(domInspector: DomInspector, chromeApi: ChromeAPI, datetimeManager: DatetimeManager) {
        this.domInspector = domInspector;
        this.chromeApi = chromeApi;
        this.datetimeManager = datetimeManager;
    }

    run() {
        this.checkForNta();
        setTimeout(() => this.checkForNta(), this.datetimeManager.convertMinutesToMilliseconds(180));
    }

    private checkForNta() {
        if (NtaNotifier.LOCATIONS.includes(document.location.href)) {
            const getTaskBtn = this.domInspector.getAcquireTaskButton();
            // @ts-ignore
            let isActive = (getTaskBtn.ariaDisabled === "false");

            if (!isActive) {
                console.log("sending msg...")
                this.chromeApi.sendMessage({msg: "nta"})
            }
        }
    }

}
