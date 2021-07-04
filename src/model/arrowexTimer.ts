import {ChromeStorage} from "../storage/chromeStorage";
import {Observable} from "./observable";
import {ArrowexTimerSettings} from "./ArrowexTimerSettings";

export class ArrowexTimer extends Observable {
    private static readonly INIT = "initialized";
    private static readonly CHANGED = "changed";

    private _taskCount: number;
    private _lastSubmit: number
    private _currentTaskName: string;
    private _startTime: number;
    private _stopTime: number;
    private _workedSeconds: number;
    private _isCounting: boolean;
    private _tasks: { [index: string]: any };
    private _settings: ArrowexTimerSettings;
    private _worksheet: { [index: string]: any };

    private readonly _storage: ChromeStorage;

    constructor(storage: ChromeStorage) {
        super();
        this._storage = storage;
    }

    async init(): Promise<void> {
        await this.updateState(ArrowexTimer.INIT);
    }

    private async updateState(reason: string): Promise<void> {
        const data = await this._storage.get(null);
        this._taskCount = data.taskCount;
        this._startTime = data.startTime;
        this._stopTime = data.stopTime;
        this._workedSeconds = data.workedSeconds;
        this._isCounting = data.isCounting;
        this._currentTaskName = data.currentTaskName;
        this._tasks = data.tasks;
        this._lastSubmit = data.lastSubmit;
        // this._settings.updateStateWith(data.settings);
        this._worksheet = data.worksheet
        this.notify(reason);
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

    get worksheet(): { [p: string]: any } {
        return this._worksheet;
    }

    get storage(): ChromeStorage {
        return this._storage;
    }

}