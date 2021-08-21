import {ArrowexTimer} from "../../model/ArrowexTimer";
import {calculateRph, getWorkedTimeString, renderTask} from "../../common/utils";
import {ChromeAPI} from "../../chrome/ChromeAPI";
import {ChromeStorage} from "../../chrome/ChromeStorage";
import {DatetimeManager} from "../../datetime/datetimeManager";

const DETACHED_POPUP_WINDOW_HEIGHT = 510;
const DETACHED_POPUP_WINDOW_WIDTH = 200;

export class Popup {
    private readonly arrowexTimer: ArrowexTimer;
    private readonly chromeApi: ChromeAPI;
    private isDetached: boolean;

    constructor(arrowexTimer: ArrowexTimer, chromeApi: ChromeAPI) {
        this.arrowexTimer = arrowexTimer;
        this.chromeApi = chromeApi;

        this.checkForIfDetached();
    }

    run(): void {
        this.render();
        this.refreshEverySeconds();
    }

    render(): void {
        this.renderCountingStatus();
        this.renderWorkedTime()
        this.renderMoneyEarned()
        this.renderTaskCount();
        this.renderRph();
        this.renderCurrentTask();
        this.resizeIfDetached();

    }

    private renderCountingStatus() {
        const countingStatusDom = document.getElementById("counting-status");
        countingStatusDom.innerHTML = this.getCountingStatus();

    }

    private renderWorkedTime() {
        const workedTimeDom = document.getElementById("worked-time");
        workedTimeDom.innerHTML = getWorkedTimeString(this.arrowexTimer.workedSeconds);
    }


    private renderMoneyEarned() {
        if (this.arrowexTimer.settings.moneyEarned.payrate !== 0 && this.arrowexTimer.settings.moneyEarned.conversionRate !== null) {
            const moneyEarnedDom = document.getElementById("money-earned");

            moneyEarnedDom.innerHTML = this.getMoneyEarned();
        }
    }

    renderTaskCount() {
        const taskCounter = document.getElementById("task-count");
        taskCounter.innerHTML = String(this.arrowexTimer.taskCount);

    }

    renderRph() {
        const rphDom = document.getElementById("rph");
        const rph = calculateRph(this.arrowexTimer.workedSeconds, this.arrowexTimer.taskCount);
        rphDom.innerHTML = `${rph} seconds`;
    }

    renderCurrentTask() {
        const dCurrentTask = document.getElementById("current-task");
        let dRenderedCurrentTask;

        if (this.arrowexTimer.currentTaskName === null) {
            dRenderedCurrentTask = this.renderNoTaskSolved();

        } else {
            dRenderedCurrentTask = renderTask(this.arrowexTimer.currentTaskName, this.arrowexTimer.currentTaskData);
        }

        dRenderedCurrentTask.setAttribute("id", "current-task");
        dCurrentTask.replaceWith(dRenderedCurrentTask);
    }

    renderNoTaskSolved() {
        let dRenderedCurrentTask;
        let dNoTaskSolved = document.createElement("p");
        dNoTaskSolved.setAttribute("class", "font-bold mb-10");
        dNoTaskSolved.innerHTML = "No Task Solved";

        dRenderedCurrentTask = document.createElement("div");
        dRenderedCurrentTask.append(dNoTaskSolved);
        dRenderedCurrentTask.append(document.createElement("hr"));
        return dRenderedCurrentTask;
    }

    async resizeIfDetached() {
        if (this.isDetached) {

            this.chromeApi.getCurrentWindow(async (window) => {

                await this.chromeApi.updateWindow(window.id, {height: document.body.scrollHeight + 25});
                await this.chromeApi.updateWindow(window.id, {width: DETACHED_POPUP_WINDOW_WIDTH});
            })

        }
    }

    checkForIfDetached() {
        try {
            this.chromeApi.getCurrentWindow((window) => {
                this.isDetached = window.height === DETACHED_POPUP_WINDOW_HEIGHT;
                this.renderDetachedPopupHelp();
            })

        } catch (ignore) {

        }
    }

    refreshEverySeconds() {
        const oneSeconds = 1000;
        window.setInterval(() => this.render(), oneSeconds);

    }

    renderDetachedPopupHelp() {
        this.chromeApi.getCurrentWindow((window) => {
            try {
                console.log(window);

                if (this.isDetached) {
                    let dDetachHelpDiv = document.getElementById("detached-help");
                    let dDetachedHelp = document.createElement("h3");

                    dDetachedHelp.setAttribute("class", "font-bold");
                    dDetachedHelp.innerHTML = 'Right click on this tab header and select "Always on top"';
                    dDetachHelpDiv.append(dDetachedHelp);

                    setTimeout(() => {
                        dDetachHelpDiv.innerHTML = "";
                        this.render();

                    }, 10000);
                }
            } catch (ignore) {

            }

        })

    }

    getCountingStatus(): string {
        if (this.arrowexTimer.isCounting) {
            return "<span style='color:#006400;font-weight:bold'>Counting</span>";

        } else {
            return "<span style='color:#FF0000;font-weight:bold'>Not counting</span>";
        }

    }

    getMoneyEarned(): string {
        const workedHours = this.arrowexTimer.workedSeconds / 3600;
        const moneyEarned = workedHours * this.arrowexTimer.settings.moneyEarned.payrate * this.arrowexTimer.settings.moneyEarned.conversionRate;

        return `${moneyEarned.toFixed(2)} ${this.arrowexTimer.settings.moneyEarned.currency}`
    }
}

class PopupEventHandler {
    private readonly arrowexTimer: ArrowexTimer;
    private readonly chromeApi: ChromeAPI;

    constructor(arrowexTimer: ArrowexTimer, chromeApi: ChromeAPI) {
        this.arrowexTimer = arrowexTimer;
        this.chromeApi = chromeApi;
    }

    async run() {
        await this.handleReset();
        this.handleDetach();
    }

    async handleReset() {
        const resetButton = document.getElementById("reset-btn");
        resetButton.addEventListener("click", async () => {
            console.log("clicked")
            await this.arrowexTimer.resetTimer();
            clearInterval();
        })

    }

    handleDetach() {
        const dDetachBtn = document.getElementById("detach-icon");

        dDetachBtn.addEventListener("click", async () => {
            await this.chromeApi.createWindow(
                "view/popup/popup.html",
                "popup",
                DETACHED_POPUP_WINDOW_WIDTH,
                DETACHED_POPUP_WINDOW_HEIGHT
            );

        })
    }

}

async function main() {
    const chromeStorage = new ChromeStorage();
    const chromeApi = new ChromeAPI();
    const datetimeManager = new DatetimeManager();

    const arrowexTimer = new ArrowexTimer(chromeStorage, datetimeManager);
    const popupDisplay = new Popup(arrowexTimer, chromeApi);
    const popupEventHandler = new PopupEventHandler(arrowexTimer, chromeApi);

    await arrowexTimer.init();
    popupDisplay.run();
    await popupEventHandler.run();

    arrowexTimer.onChange(() => popupDisplay.render());


}

main().then(() => console.log("popup started"));
