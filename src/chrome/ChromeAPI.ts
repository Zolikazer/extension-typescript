export class ChromeAPI {
    sendMessage(message: { [index: string]: any }): void {
        // @ts-ignore
        chrome.runtime.sendMessage(message);
    }

    onMessage(callback: (ev: Event) => void) {
        // @ts-ignore
        chrome.runtime.onMessage.addListener(callback)
    }

    getCurrentWindow(callback: (window: any) => void) {
        // @ts-ignore
        chrome.windows.getCurrent(callback);
    }

    async updateWindow(id: number, updateInfo: { [index: string]: any }) {
        // @ts-ignore
        await chrome.windows.update(id, updateInfo);
    }

    async createWindow(url: string, type: string, width: number, height: number) {
        // @ts-ignore
        await chrome.windows.create({
            url: url,
            type: type,
            width: width,
            height: height,

        });

    }
}

