import { ChromeAPI } from "../chrome/ChromeAPI";
import { ONE_MINUTE_IN_SECONDS, ONE_SECOND_IN_MILLISECONDS } from "../datetime/datetimeUtils";
import { TASK_DETECTED } from "../common/messages";

const GET_TASK_SELECTOR = "/html/body/rating-portal-root/rating-portal-app/div[2]/div/section/rating-home/div[1]/start-task-panel/div/material-button";
const LOCATIONS = ["https://rating.ewoq.google.com/u/0/home",
    "https://rating.ewoq.google.com/u/0/", "https://rating.ewoq.google.com"];
const REFRESH_TIMEOUT = 10;

export class TaskChecker {
    private isActive: boolean;
    private chromeApi: ChromeAPI;
    private taskBtnWasActive: boolean;

    constructor(chromeApi: ChromeAPI) {
        this.isActive = false;
        this.chromeApi = chromeApi;
        this.taskBtnWasActive = false;
    }

    checkForTasks(): void {
        setInterval(() => {
            if (LOCATIONS.includes(document.location.href)) {
                let getTaskBtn = document.evaluate(GET_TASK_SELECTOR, document, null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                // noinspection JSUnresolvedVariable
                // @ts-ignore
                this.isActive = (getTaskBtn.ariaDisabled === "false");
                console.log("checking..." + this.isActive);

                if (this.isActive && !this.taskBtnWasActive) {
                    console.log("%c IT BECAME ACTIVE", "background: #222; color: #bada55");
                    this.taskBtnWasActive = true;

                }

                if (!this.isActive && this.taskBtnWasActive) {
                    console.log("%c IT BECAME INACTIVE", "background: #222; color: #bada55");
                    this.taskBtnWasActive = false;

                }

                if (this.isActive) {
                    // noinspection JSUnresolvedVariable,JSUnresolvedFunction
                    this.chromeApi.sendMessage({ msg: TASK_DETECTED });
                }

            } else {
                clearTimeout();
            }
        }, 5000);
    }

    refreshPageAfter(timeoutInMinutes: number) {
        console.log(`%c REFRESHING after ${timeoutInMinutes}`, "background: #222; color: #bada55");
        setTimeout(() => {
            if (LOCATIONS.includes(document.location.href) && !this.isActive) {
                document.location.reload();
                console.log("%c REFRESHING", "background: #222; color: #bada55");
            }
            if (this.isActive) {
                this.refreshPageAfter(1);
            } else {
                this.refreshPageAfter(REFRESH_TIMEOUT + Math.random() * 7);
            }

        }, timeoutInMinutes * ONE_MINUTE_IN_SECONDS * ONE_SECOND_IN_MILLISECONDS);

    }

}
