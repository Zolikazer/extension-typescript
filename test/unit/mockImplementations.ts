import {ChromeStorage} from "../../src/chrome/ChromeStorage";
import {DatetimeUtils} from "../../src/datetime/datetimeUtils";

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

export class DatetimeMangerMock extends DatetimeUtils {
    private pstTime: number = null;
    getCurrentTimeInPst = (): number => {
        return this.pstTime;
    };

    setPstTime = (time: number): void => {
        this.pstTime = time;
    }
}
