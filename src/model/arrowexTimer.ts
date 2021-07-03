import {ChromeStorage} from "../storage/chromeStorage";
import {Observable} from "./observable";

export class ArrowexTimer extends Observable {
    static INIT = "initialized";
    static CHANGED = "changed";

    readonly taskCount: number;

    private storage: ChromeStorage;

    constructor(storage: ChromeStorage) {
        super();
        this.storage = storage;
    }

}