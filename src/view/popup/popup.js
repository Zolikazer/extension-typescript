// Copyright (c) 2020 Zoltan Spagina
// All rights reserved.
// Email: okoskacsaka@gmail.com
// noinspection JSIgnoredPromiseFromCall

import {calculateRph, getWorkedTimeString, renderTask} from "../../utils.js";
import {ArrowexTimer} from "../../model/ArrowexTimer";

const DETACHED_POPUP_WINDOW_HEIGHT = 510;
const DETACHED_POPUP_WINDOW_WIDTH = 200;


class PopupDisplay {
    constructor(arrowexTimer) {
        this.arrowexTimer = arrowexTimer;
        this.isDetached = null;

        this.checkForIfDetached();
    }

    run = () => {
        this.render();
        this.refreshEverySeconds();
    }

    render = () => {
        this.renderCountingStatus();
        this.renderWorkedTime();
        this.renderMoneyEarned();
        this.renderTaskCount();
        this.renderRph();
        this.renderCurrentTask();
        this.resizeIfDetached();

    }

    renderCountingStatus = () => {
        const countingStatusDom = document.getElementById("counting-status");

        if (this.arrowexTimer.isCounting) {
            countingStatusDom.innerHTML = "<span style='color:#006400;font-weight:bold'>Counting</span>";

        } else {
            countingStatusDom.innerHTML = "<span style='color:#FF0000;font-weight:bold'>Not counting</span>";
        }

    }

    renderWorkedTime = () => {
        const workedTimeDom = document.getElementById("worked-time");
        workedTimeDom.innerHTML = getWorkedTimeString(this.arrowexTimer.workedSeconds);
    }

    renderMoneyEarned = () => {
        if (this.arrowexTimer.settings.moneyEarned.payrate !== 0 && this.arrowexTimer.settings.moneyEarned.conversionRate !== null) {
            const workedHours = this.arrowexTimer.workedSeconds / 3600;
            const moneyEarned = workedHours * this.arrowexTimer.settings.moneyEarned.payrate * this.arrowexTimer.settings.moneyEarned.conversionRate;
            const moneyEarnedDom = document.getElementById("money-earned");

            moneyEarnedDom.innerHTML = `${moneyEarned.toFixed(2)} ${this.arrowexTimer.settings.moneyEarned.currency}`;
        }
    }

    renderTaskCount = () => {
        const taskCounter = document.getElementById("task-count");
        taskCounter.innerHTML = this.arrowexTimer.taskCount;

    }

    renderRph = () => {
        const rphDom = document.getElementById("rph");
        const rph = calculateRph(this.arrowexTimer.workedSeconds, this.arrowexTimer.taskCount);
        rphDom.innerHTML = `${rph} seconds`;
    }

    renderCurrentTask = () => {
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

    renderNoTaskSolved = () => {
        let dRenderedCurrentTask;
        let dNoTaskSolved = document.createElement("p");
        dNoTaskSolved.setAttribute("class", "font-bold mb-10");
        dNoTaskSolved.innerHTML = "No Task Solved";

        dRenderedCurrentTask = document.createElement("div");
        dRenderedCurrentTask.append(dNoTaskSolved);
        dRenderedCurrentTask.append(document.createElement("hr"));
        return dRenderedCurrentTask;
    }

    resizeIfDetached = () => {
        if (this.isDetached) {
            chrome.windows.getCurrent((window) => {

                chrome.windows.update(window.id, {height: document.body.scrollHeight + 25});
                chrome.windows.update(window.id, {width: DETACHED_POPUP_WINDOW_WIDTH});
            })

        }
    }

    checkForIfDetached = () => {
        try {
            chrome.windows.getCurrent((window) => {
                this.isDetached = window.height === DETACHED_POPUP_WINDOW_HEIGHT;
                this.renderDetachedPopupHelp();
            })

        } catch (ignore) {

        }
    }

    renderDetachedPopupHelp = () => {
        chrome.windows.getCurrent((window) => {
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

    refreshEverySeconds = () => {
        const oneSeconds = 1000;
        window.setInterval(this.render, oneSeconds);

    }
}

class PopupEventHandler {
    constructor(arrowexTimer) {
        this.arrowexTimer = arrowexTimer;
    }

    run = () => {
        this.handleReset();
        this.handleDetach();
    }

    handleReset = () => {
        const resetButton = document.getElementById("reset-btn");
        resetButton.addEventListener("click", () => {
            console.log("clicked")
            this.arrowexTimer.resetTimer();
            clearInterval();
        })

    }

    handleDetach = () => {
        const dDetachBtn = document.getElementById("detach-icon");

        dDetachBtn.addEventListener("click", () => {
            chrome.windows.create({
                url: "view/popup/popup.html",
                type: "popup",
                width: DETACHED_POPUP_WINDOW_WIDTH,
                height: DETACHED_POPUP_WINDOW_HEIGHT,

            });

        })
    }

}

function main() {
    const arrowexTimer = new ArrowexTimer();
    const popupDisplay = new PopupDisplay(arrowexTimer);
    const popupEventHandler = new PopupEventHandler(arrowexTimer);
    arrowexTimer.addEventListener(ArrowexTimer.INIT, popupDisplay.run);
    arrowexTimer.addEventListener(ArrowexTimer.INIT, popupEventHandler.run)
    arrowexTimer.addEventListener(ArrowexTimer.CHANGED, popupDisplay.render);

    arrowexTimer.init()

}

main();
