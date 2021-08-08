export class ChromeStorage {
    async get(keys: string[] | string | null): Promise<{ [index: string]: any }> {
        // @ts-ignore
        return new Promise<Object>((resolve, reject) => {
            try {
                // @ts-ignore
                chrome.storage.sync.get(keys, (result) => {
                    resolve(result);
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    async set(obj: object): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                // @ts-ignore
                chrome.storage.sync.set(obj, function () {
                    resolve();
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    onChange(callback: (ev: Event) => void): void  {
        console.log("changed!")
        // @ts-ignore
        chrome.storage.onChanged.addListener(callback);

    }
}
