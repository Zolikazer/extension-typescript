export class ChromeStorage {
    get = async (keys: string[] | string | null): Promise<{ [index: string]: any }> => {
        // @ts-ignore
        return new Promise<Object>((resolve, reject) => {
            try {
                // @ts-ignore
                chrome.storage.sync.get(keys, function(result) {
                    resolve(result);
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    set = async (obj: object): Promise<void> => {
        return new Promise<void>((resolve, reject) => {
            try {
                // @ts-ignore
                chrome.storage.sync.set(obj, function() {
                    resolve();
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }
}
