export class ChromeAPI {
    sendMessage(message: { [index: string]: any }): void {
        // @ts-ignore
        chrome.runtime.sendMessage(message);
        console.log("msg sent")
    }

    onMessage(callback: (ev: any) => void) {
        // @ts-ignore
        chrome.runtime.onMessage.addListener(callback);
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

    queryTabs(queryInfo: any, callback: (tabs: any[]) => void) {
        // @ts-ignore
        chrome.tabs.query({}, callback);

    }

    createNotification(id: string, title: string, message: string, type: string, iconUrl: string) {
        // @ts-ignore
        chrome.notifications.create(id, {
            title: title,
            message: message,
            type: type,
            iconUrl: iconUrl
        });

    }
}

