import {DomInspector} from "./DomInspector";
import {ArrowexTimerSettings} from "../model/ArrowexTimerSettings";
import {ChromeAPI} from "../chrome/ChromeAPI";
import {BEEP} from "../common/messages";

export class InstructionTimer {
    private domInspector: DomInspector;
    private settings: ArrowexTimerSettings;
    private chromeApi: ChromeAPI;

    constructor(domInspector: DomInspector, settings: ArrowexTimerSettings, chromeApi: ChromeAPI) {
        this.domInspector = domInspector;
        this.settings = settings;
        this.chromeApi = chromeApi;
    }

    addTimerToInstruction = () => {
        const isTimerNotAdded: boolean = this.domInspector.getArrowexTimer() === null;
        if (isTimerNotAdded) {
            if (this.settings.instructionTimeEnabled) {
                const instructionClock = this.constructTimer(this.settings.instructionTime);
                this.clearTimerIfUserBeginRating(instructionClock);
            }
        }
    }

    private constructTimer = (instructionTime: number): NodeJS.Timer => {
        const instructionFooter = this.domInspector.getInstructionFooter();
        instructionFooter.insertAdjacentHTML("afterbegin", this.getTimerHtml());

        const clock: Element = this.domInspector.getArrowexClock();
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
        const continueButton = this.domInspector.getContinueButton();
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


