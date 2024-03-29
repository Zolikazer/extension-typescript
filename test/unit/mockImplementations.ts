import {ChromeStorage} from "../../src/chrome/ChromeStorage";
import {DatetimeManager} from "../../src/datetime/datetimeManager";
import {ArrowexTimer} from "../../src/model/ArrowexTimer";

export class ChromeStorageMock extends ChromeStorage {
    private storage: { [index: string]: any };

    get = async (keys: string[] | string | null): Promise<{ [index: string]: any }> => {
        return new Promise<Object>((resolve, reject) => {
            resolve(this.storage);
        });
    }

    set = async (obj: object): Promise<void> => {
    }

    setStorageTo = (value: { [index: string]: any }): void => {
        this.storage = value;
    }

    onChange(callback: (ev: Event) => void): void {
    }


}

export class DatetimeMangerMock extends DatetimeManager {
    private pstTime: number = null;
    getCurrentTimeInPst = (): number => {
        return this.pstTime;
    };

    setPstTime = (time: number): void => {
        this.pstTime = time;
    }
}

export class ArrowexTimerMock extends ArrowexTimer {
    private isCountingMock: boolean;

    set isCounting(isCounting: boolean) {
        this.isCountingMock = isCounting;
    }

    get isCounting(): boolean {
        return false;
    }

}

