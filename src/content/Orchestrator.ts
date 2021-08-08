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

    constructor(domInspector: DomInspector, instructionTimer: InstructionTimer, arrowexTimer: ArrowexTimer,
                datetimeManager: DatetimeManager) {
        this.chromeApi.sendMessage({msg: EWOQ_OPENED});
        this.domInspector = domInspector;
        this.instructionTimer = instructionTimer;
        this.arrowexTimer = arrowexTimer;
        this.lastBeep = this.datetimeManager.getCurrentTimeInPst();
        this.datetimeManager = datetimeManager;
    }

    async run() {
        MutationObserver = window.MutationObserver;
        const observer = new MutationObserver(this.orchestrate);
        observer.observe(document, {
            subtree: true,
            attributes: true
        })

    }

    private async orchestrate() {
        if (!this.isRatingPage()) {
            return;
        }

        const pageType = this.getPageType();
        switch (pageType) {
            case INSTRUCTION_PAGE:
                await this.arrowexTimer.stopTimer();
                this.instructionTimer.addTimerToInstruction();
                break;
            case RATING_PAGE:
                if (!this.arrowexTimer.isCounting) {
                    await this.arrowexTimer.startTimer();
                    this.warnToSubmit();
                }
                break;
            case OTHER_PAGE:
                await this.arrowexTimer.stopTimer();
        }
    }


    private getPageType() {
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
        let submitWarnTimeout = setTimeout(this.warnToSubmit, ONE_SECOND_IN_MILLISECONDS);

        const currentTime = this.datetimeManager.getCurrentTimeInPst();
        if (this.shouldWarnToSubmit(currentTime)) {
            this.chromeApi.sendMessage({msg: BEEP});
            this.lastBeep = currentTime;
        }

        if (!this.arrowexTimer.isCounting) {
            clearTimeout(submitWarnTimeout);
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
