import { ChromeStorage } from "../chrome/ChromeStorage";
import { Observable } from "./Observable";
import { ArrowexTimerSettings } from "./ArrowexTimerSettings";
import { DatetimeUtils } from "../datetime/datetimeUtils";

export class ArrowexTimer extends Observable {
    private CHANGED = "changed";
    private _taskCount: number;
    private _lastSubmit: number;
    private _currentTaskName: string;
    private _startTime: number;
    private _stopTime: number;
    private _workedSeconds: number;
    private _isCounting: boolean;
    private _tasks: { [index: string]: any };
    private _currentMonthWorksheet: { [index: string]: any };
    private _worksheet: { [index: string]: any };
    private readonly _settings: ArrowexTimerSettings;
    private readonly storage: ChromeStorage;

    constructor(storage: ChromeStorage) {
        super();
        this.storage = storage;
        this._settings = new ArrowexTimerSettings(this.storage);
        this.storage.onChange(() => this.updateState());
    }

    async init(): Promise<void> {
        await this.updateState();
    }

    onChange(callback: (ev: Event) => void): void {
        this.addEventListener(this.CHANGED, callback);
    }

    private async updateState(): Promise<void> {
        const data = await this.storage.get(null);
        this._taskCount = data.taskCount;
        this._startTime = data.startTime;
        this._stopTime = data.stopTime;
        this._workedSeconds = data.workedSeconds;
        this._isCounting = data.isCounting;
        this._currentTaskName = data.currentTaskName;
        this._tasks = data.tasks;
        this._lastSubmit = data.lastSubmit;
        this._settings.updateStateWith(data.settings);
        this._currentMonthWorksheet = this.getCurrentMonthWorksheet(data);
        this._worksheet = await this.getAggregatedWorksheet(data);
        this.notify(this.CHANGED);

    }

    async startTimer(): Promise<void> {
        const startTime = DatetimeUtils.getCurrentTimeInPst();
        this._startTime = startTime;
        this._isCounting = true;
        this._lastSubmit = startTime;

        await this.storage.set({
            startTime: startTime,
            isCounting: true,
            lastSubmit: startTime
        });
    }

    async stopTimer(): Promise<void> {
        const stopTime = DatetimeUtils.getCurrentTimeInPst();
        const workedSeconds = this.workedSeconds;
        this._stopTime = stopTime;
        this._isCounting = false;

        await this.storage.set({
            workedSeconds: workedSeconds,
            stopTime: stopTime,
            isCounting: false
        });
    }

    async resetTimer(): Promise<void> {
        if (this._lastSubmit !== null) {
            // this.updateWorksheet();

            await this.storage.set({
                taskCount: 0,
                startTime: 0,
                stopTime: 0,
                workedSeconds: 0,
                isCounting: false,
                currentTaskName: null,
                tasks: {},
                lastSubmit: null
            });
        }
    }

    async countTask(taskName: string): Promise<void> {
        const currentTime = DatetimeUtils.getCurrentTimeInPst();
        const timeToComplete = currentTime - this._lastSubmit;
        this._taskCount = this._taskCount + 1;
        this._currentTaskName = taskName;
        this._lastSubmit = currentTime;
        this.updateTasks(taskName, timeToComplete);

        this.updateWorksheet();

        let countData: any = {
            taskCount: this._taskCount,
            currentTaskName: taskName,
            tasks: this._tasks,
            lastSubmit: currentTime
        };
        countData[`worksheet-${DatetimeUtils.getYYYYMMString(new Date(currentTime))}`] = this._currentMonthWorksheet;

        await this.storage.set(countData);

    }


    private updateTasks(taskName: string, timeToComplete: number) {
        if (this._tasks.hasOwnProperty(taskName)) {
            this._tasks[taskName].time = this._tasks[taskName].time + timeToComplete;
            this._tasks[taskName].taskCount = this._tasks[taskName].taskCount + 1;

        } else {
            let taskData: { [index: string]: any } = {};
            taskData.time = timeToComplete;
            taskData.taskCount = 1;
            this._tasks[taskName] = taskData;
        }
    }

    private updateWorksheet = () => {
        const currentDate = new Date(DatetimeUtils.getCurrentTimeInPst());
        const workday = DatetimeUtils.getYYYYMMDDString(currentDate);
        this._currentMonthWorksheet[workday] = {
            workedSeconds: this.workedSeconds,
            taskCount: this._taskCount
        };
    };

    private async getAggregatedWorksheet(data: { [p: string]: any }): Promise<{ [p: string]: any }> {
        let aggregatedWorksheet = {};
        const worksheetMonths = Object.keys(data).filter(key => key.includes("worksheet-"));

        for (const worksheetMonth of worksheetMonths) {
            Object.assign(aggregatedWorksheet, data[worksheetMonth]);

        }
        return aggregatedWorksheet;
    }


    get taskCount(): number {
        return this._taskCount;
    }

    get lastSubmit(): number {
        return this._lastSubmit;
    }

    get currentTaskName(): string {
        return this._currentTaskName;
    }

    get startTime(): number {
        return this._startTime;
    }

    get stopTime(): number {
        return this._stopTime;
    }

    get workedSeconds(): number {
        if (this._isCounting) {
            const currentTime = DatetimeUtils.getCurrentTimeInPst();
            return this._workedSeconds + (currentTime - this._startTime) / 1000;
        }

        return this._workedSeconds;
    }

    get isCounting(): boolean {
        return this._isCounting;
    }

    get tasks(): { [p: string]: any } {
        return this._tasks;
    }

    get settings(): ArrowexTimerSettings {
        return this._settings;
    }

    get currentMonthWorksheet(): { [p: string]: any } {
        return this._currentMonthWorksheet;
    }

    get currentTaskData() {
        return this._tasks[this._currentTaskName];
    }

    private getCurrentMonthWorksheet(data: { [p: string]: any }): { [p: string]: any } {
        const currentMonthWorksheet = data[`worksheet-${DatetimeUtils.getYYYYMMString(new Date(DatetimeUtils.getCurrentTimeInPst()))}`];
        return (currentMonthWorksheet) ? currentMonthWorksheet : {};
    }

    get worksheet(): { [p: string]: any } {
        return this._worksheet;
    }
}
