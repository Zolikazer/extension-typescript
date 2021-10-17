import {DomInspector} from "./DomInspector";
import {ArrowexTimerSettings} from "../model/ArrowexTimerSettings";
import {ChromeAPI} from "../chrome/ChromeAPI";
import {BEEP} from "../common/messages";

export class InstructionTimer {
    private readonly settings: ArrowexTimerSettings;
    private readonly chromeApi: ChromeAPI;

    constructor(settings: ArrowexTimerSettings, chromeApi: ChromeAPI) {
        this.settings = settings;
        this.chromeApi = chromeApi;
    }

    addTimerToInstruction() {
        const isTimerNotAdded = DomInspector.getArrowexTimer() === null;
        if (isTimerNotAdded) {
            if (this.settings.instructionTimeEnabled) {
                const instructionClock = this.constructTimer(this.settings.instructionTime);
                this.clearTimerIfUserBeginRating(instructionClock);
            }
        }
    }

    private constructTimer = (instructionTime: number): NodeJS.Timer => {
        const instructionFooter = DomInspector.getInstructionFooter();
        instructionFooter.insertAdjacentHTML("afterbegin", this.getTimerHtml());

        const clock: Element = DomInspector.getArrowexClock();
        clock.innerHTML = new Date(instructionTime * 1000).toISOString().substr(14, 5);

        const instructionClock = setInterval(() => {
            clock.innerHTML = new Date(instructionTime * 1000).toISOString().substr(14, 5);

            if (instructionTime === 0) {
                this.chromeApi.sendMessage({msg: BEEP})
                clearInterval(instructionClock);
            }

            instructionTime -= 1;

        }, 1000)

        return instructionClock;

    }

    private clearTimerIfUserBeginRating = (instructionClock: NodeJS.Timer) => {
        const continueButton = DomInspector.getContinueButton();
        continueButton.addEventListener("click", () => {
            clearInterval(instructionClock);
        })

    }

    private getTimerHtml = (): string => {
        let clockHtml = '<div>\n' +
            '            <h3 id="arrowex-timer-clock" style="margin: 0 auto;"></h3>\n' +
            '\n' +
            '        </div>'

        return '<div id="arrowex-timer" style="width: 400px; text-align: center">\n' +
            '        <h3 style="color: #ec4561; margin: 0">The timer was added by the Arrowex extension. </h3>' +
            clockHtml +
            '    </div>';
    }
}


