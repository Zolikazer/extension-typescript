// @ts-ignore
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        // @ts-ignore
        chrome.storage.sync.set({
            taskCount: 0,
            startTime: 0,
            stopTime: 0,
            workedSeconds: 0,
            isCounting: false,
            currentTaskName: null,
            tasks: {},
            lastSubmit: null,
            settings: {
                warnIfForgotToStart: true,
                moneyEarned: {payrate: 0, currency: "USD", conversionRate: null},
                submitTimeEnabled: true,
                submitTime: 45,
                autoSubmitTimes: {},
                instructionTimeEnabled: true,
                instructionTime: 120
            },
            worksheet: {},
            premium: {licenseKey: null, license: null}
        })
        console.log("installed")
        // @ts-ignore
        chrome.tabs.create({url: `chrome-extension://${chrome.runtime.id}/view/install/install.html`});
    }
})
