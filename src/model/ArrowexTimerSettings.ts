import {ChromeStorage} from "../chrome/ChromeStorage";

export class ArrowexTimerSettings {
    private _warnIfForgotToStart: boolean;
    private _moneyEarned: { [index: string]: any };
    private _submitTimeEnabled: boolean;
    private _submitTime: number;
    private _instructionTimeEnabled: boolean;
    private _instructionTime: number;
    private _autoSubmitTimes: { [index: string]: any };
    private storage: ChromeStorage;

    constructor(storage: ChromeStorage) {
        this.storage = storage;
    }

    updateStateWith(settings: { [index: string]: any }): void {
        console.log(settings)
        this._warnIfForgotToStart = settings.warnIfForgotToStart;
        this._moneyEarned = settings.moneyEarned;
        this._submitTimeEnabled = settings.submitTimeEnabled;
        this._submitTime = settings.submitTime;
        this._instructionTimeEnabled = settings.instructionTimeEnabled;
        this._instructionTime = settings.instructionTime;
        this._autoSubmitTimes = settings.autoSubmitTimes
    }

    async saveState(): Promise<void> {
        const settings = {
            warnIfForgotToStart: this.warnIfForgotToStart,
            moneyEarned: {
                payrate: this.moneyEarned.payrate,
                currency: this.moneyEarned.currency,
                conversionRate: this.moneyEarned.conversionRate
            },
            submitTimeEnabled: this.submitTimeEnabled,
            submitTime: this.submitTime,
            instructionTimeEnabled: this.instructionTimeEnabled,
            instructionTime: this.instructionTime,
            autoSubmitTimes: this._autoSubmitTimes
        }

        await this.storage.set({"settings": settings});

    }

    get instructionTime(): number {
        return this._instructionTime;
    }

    get warnIfForgotToStart(): boolean {
        return this._warnIfForgotToStart;
    }

    get moneyEarned(): { [index: string]: any } {
        return this._moneyEarned;
    }

    get submitTimeEnabled(): boolean {
        return this._submitTimeEnabled;
    }

    get submitTime(): number {
        return this._submitTime;
    }

    get instructionTimeEnabled(): boolean {
        return this._instructionTimeEnabled;
    }

    get autoSubmitTimes(): { [p: string]: any } {
        return this._autoSubmitTimes;
    }

    set warnIfForgotToStart(value: boolean) {
        this._warnIfForgotToStart = value;
    }

    set moneyEarned(value: { [p: string]: any }) {
        this._moneyEarned = value;
    }

    set submitTimeEnabled(value: boolean) {
        this._submitTimeEnabled = value;
    }

    set submitTime(value: number) {
        this._submitTime = value;
    }

    set instructionTimeEnabled(value: boolean) {
        this._instructionTimeEnabled = value;
    }

    set instructionTime(value: number) {
        this._instructionTime = value;
    }

    set autoSubmitTimes(value: { [p: string]: any }) {
        this._autoSubmitTimes = value;
    }


}
