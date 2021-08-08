import {DomInspector} from "./DomInspector";
import {InstructionTimer} from "./InstructionTimer";
import {ArrowexTimer} from "../model/ArrowexTimer";
import {ChromeAPI} from "../chrome/ChromeAPI";
import {DatetimeManager, ONE_SECOND_IN_MILLISECONDS} from "../datetime/datetimeManager";
import {BEEP, EWOQ_OPENED} from "../common/messages";

const OTHER_PAGE = "other_page";
const RATING_PAGE = "rating_page";
const INSTRUCTION_PAGE = "instruction_page";

export class Orchestrator {
    private domInspector: DomInspector;
    private instructionTimer: InstructionTimer;
    private arrowexTimer: ArrowexTimer;
    private chromeApi: ChromeAPI;
    private lastBeep: number;
    private datetimeManager: DatetimeManager;
    private warnInterval: NodeJS.Timer;

    constructor(domInspector: DomInspector, instructionTimer: InstructionTimer, arrowexTimer: ArrowexTimer,
                datetimeManager: DatetimeManager, chromeApi: ChromeAPI) {
        this.chromeApi = chromeApi;
        this.domInspector = domInspector;
        this.instructionTimer = instructionTimer;
        this.arrowexTimer = arrowexTimer;
        this.datetimeManager = datetimeManager;
        this.lastBeep = this.datetimeManager.getCurrentTimeInPst();
        this.warnInterval = null;
        this.chromeApi.sendMessage({msg: EWOQ_OPENED});

    }

    async run() {
        await this.orchestrate();
        MutationObserver = window.MutationObserver;
        const observer = new MutationObserver(() => this.orchestrate());
        observer.observe(document, {
            subtree: true,
            attributes: true
        })

    }

    private async orchestrate() {
        if (!this.isRatingPage()) {
            console.log("not rating pae");
            clearInterval(this.warnInterval);
            return;
        }

        const pageType = this.getPageType();
        console.log("Page type: ", pageType)
        switch (pageType) {
            case INSTRUCTION_PAGE:
                await this.arrowexTimer.stopTimer();
                this.instructionTimer.addTimerToInstruction();
                clearInterval(this.warnInterval);
                break;
            case RATING_PAGE:
                if (!this.arrowexTimer.isCounting) {
                    await this.arrowexTimer.startTimer();
                    this.warnInterval = setInterval(() => this.warnToSubmit(), ONE_SECOND_IN_MILLISECONDS);
                }
                break;
            case OTHER_PAGE:
                clearInterval(this.warnInterval);
                await this.arrowexTimer.stopTimer();
        }
    }


    private getPageType(): string {
        if (this.domInspector.getContinueButton() !== undefined) {
            return INSTRUCTION_PAGE;
        }

        if (this.domInspector.getSubmitButton() !== null) {
            return RATING_PAGE;
        }

        return OTHER_PAGE;

    }

    private isRatingPage() {
        return this.domInspector.getTaskNameNode() !== undefined;
    }

    private warnToSubmit() {
        console.log("warn to sumit");

        const currentTime = this.datetimeManager.getCurrentTimeInPst();
        console.log("should i warn", this.shouldWarnToSubmit(currentTime))
        if (this.shouldWarnToSubmit(currentTime)) {
            this.chromeApi.sendMessage({msg: BEEP});
            this.lastBeep = currentTime;
        }

    }

    private shouldWarnToSubmit(currentTime: number) {
        const submitTimeExpired = currentTime - this.arrowexTimer.lastSubmit > this.arrowexTimer.settings.submitTime * ONE_SECOND_IN_MILLISECONDS;
        const lastBeepExpirationInterval = 10 * ONE_SECOND_IN_MILLISECONDS;


        return submitTimeExpired
            && this.arrowexTimer.settings.submitTimeEnabled
            && currentTime - this.lastBeep > lastBeepExpirationInterval;
    }
}
