import { InstructionTimer } from "./InstructionTimer";
import { ChromeAPI } from "../chrome/ChromeAPI";
import { ArrowexTimer } from "../model/ArrowexTimer";
import { DatetimeUtils, ONE_SECOND_IN_MILLISECONDS } from "../datetime/datetimeUtils";
import { BEEP } from "../common/messages";
import { NtaReminder } from "./NtaReminder";
import { DomInspector } from "./DomInspector";
import { TaskChecker } from "./TaskChecker";

export interface Page {
    arrowexTimer: ArrowexTimer;

    doOtherStuff(): void;

    adjustTimer(): Promise<void>;

}

abstract class EwoqPage implements Page {
    arrowexTimer: ArrowexTimer;

    protected constructor(arrowexTimer: ArrowexTimer) {
        this.arrowexTimer = arrowexTimer;
    }

    abstract adjustTimer(): Promise<void>;

    abstract doOtherStuff(): void;

    isEwoqPage(): boolean {
        return true;
    }

}

export class InstructionPage extends EwoqPage {
    private readonly instructionTimer: InstructionTimer;

    constructor(instructionTimer: InstructionTimer, arrowexTimer: ArrowexTimer) {
        super(arrowexTimer);
        this.instructionTimer = instructionTimer;
    }

    doOtherStuff(): void {
        this.instructionTimer.addTimerToInstruction();
    }

    async adjustTimer(): Promise<void> {
        if (this.arrowexTimer.isCounting) {
            await this.arrowexTimer.stopTimer();
        }
    }


}

export class RatingPage extends EwoqPage {
    private readonly chromeApi: ChromeAPI;
    private lastBeep: number;

    constructor(arrowexTimer: ArrowexTimer, chromeApi: ChromeAPI) {
        super(arrowexTimer);
        this.chromeApi = chromeApi;
        this.lastBeep = DatetimeUtils.getCurrentTimeInPst();
    }

    doOtherStuff(): void {
        this.warnToSubmit();
    }

    async adjustTimer(): Promise<void> {
        if (!this.arrowexTimer.isCounting) {
            await this.arrowexTimer.startTimer();
        }
    }

    private warnToSubmit = () => {
        console.log("warn to submit...");
        let submitWarnTimeout = setTimeout(this.warnToSubmit, ONE_SECOND_IN_MILLISECONDS);

        const currentTime = DatetimeUtils.getCurrentTimeInPst();
        if (this.shouldWarnToSubmit(currentTime)) {
            this.chromeApi.sendMessage({ msg: BEEP });
            this.lastBeep = currentTime;
        }

        if (!this.arrowexTimer.isCounting) {
            console.log("cleared");
            clearTimeout(submitWarnTimeout);
        }

    };

    private shouldWarnToSubmit(currentTime: number) {
        const submitTimeExpired = currentTime - this.arrowexTimer.lastSubmit >
          this.arrowexTimer.settings.submitTime * ONE_SECOND_IN_MILLISECONDS;
        const lastBeepExpirationInterval = 10 * ONE_SECOND_IN_MILLISECONDS;


        return submitTimeExpired
          && this.arrowexTimer.settings.submitTimeEnabled
          && currentTime - this.lastBeep > lastBeepExpirationInterval;
    }

}

export class EwoqHomePage extends EwoqPage {
    private static MIN_REFRESH_TIMEOUT = 10;
    private readonly ntaReminder: NtaReminder;
    private lastReminder: number;
    private taskChecker: TaskChecker;

    constructor(arrowexTimer: ArrowexTimer, ntaReminder: NtaReminder, taskChecker: TaskChecker) {
        super(arrowexTimer);
        this.ntaReminder = ntaReminder;
        this.lastReminder = null;
        this.taskChecker = taskChecker;

    }

    doOtherStuff(): void {
        setTimeout(() => {
            if (this.reminderExpired() || this.notHaveBeenReminded()) {
                this.ntaReminder.notifyAboutNtaReporting();
                this.lastReminder = DatetimeUtils.getCurrentTimeInPst();
            }
        }, 5000);
        this.taskChecker.checkForTasks();
        this.taskChecker.refreshPageAfter(EwoqHomePage.MIN_REFRESH_TIMEOUT + Math.random() * 7);
    }

    private reminderExpired() {
        return DatetimeUtils.getCurrentTimeInPst() - this.lastReminder > 3 * DatetimeUtils.getAnHourInMilliseconds();
    }

    private notHaveBeenReminded() {
        return this.lastReminder === null;
    }

    async adjustTimer(): Promise<void> {
        if (this.arrowexTimer.isCounting) {
            await this.arrowexTimer.stopTimer();
        }
    }
}

export class OtherPage implements Page {

    arrowexTimer: ArrowexTimer;

    constructor(arrowexTimer: ArrowexTimer) {
        this.arrowexTimer = arrowexTimer;
    }

    doOtherStuff(): void {
    }

    async adjustTimer(): Promise<void> {
        if (this.arrowexTimer.isCounting) {
            await this.arrowexTimer.stopTimer();
        }
    }

}

export class PageFactory {
    private readonly instructionPage: InstructionPage;
    private readonly ratingPage: RatingPage;
    private readonly ewoqHomepage: EwoqHomePage;
    private readonly otherPage: OtherPage;

    constructor(chromeApi: ChromeAPI,
                arrowexTimer: ArrowexTimer) {

        this.instructionPage = new InstructionPage(
          new InstructionTimer(
            arrowexTimer.settings,
            chromeApi),
          arrowexTimer);
        this.ratingPage = new RatingPage(arrowexTimer, chromeApi);
        this.ewoqHomepage = new EwoqHomePage(arrowexTimer,
          new NtaReminder(chromeApi),
          new TaskChecker(chromeApi));
        this.otherPage = new OtherPage(arrowexTimer);

    }

    getPage(): Page {
        if (DomInspector.getContinueButton() !== undefined) {
            return this.instructionPage;
        } else if (DomInspector.getSubmitButton() !== null) {
            return this.ratingPage;
        } else if (DomInspector.getAcquireTaskButton() !== null) {
            return this.ewoqHomepage;
        }

        return this.otherPage;
    }
}
