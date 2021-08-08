export const testDataNotCounting: { [index: string]: any } = {
    "taskCount": 0,
    "startTime": 0,
    "stopTime": 0,
    "workedSeconds": 0,
    "isCounting": false,
    "currentTaskName": "TestName",
    "tasks": {},
    "lastSubmit": null,
    "settings": {
        "warnIfForgotToStart": true,
        "moneyEarned": {"payrate": 0, "currency": "USD", "conversionRate": 15},
        "submitTimeEnabled": true,
        "submitTime": 45,
        "autoSubmitTimes": {},
        "instructionTimeEnabled": true,
        "instructionTime": 120
    },
    "worksheet": {}
}

export const testDataCounting: { [index: string]: any } = {
    "taskCount": 3,
    "startTime": 0,
    "stopTime": 0,
    "workedSeconds": 10,
    "isCounting": true,
    "currentTaskName": "TestName",
    "tasks": {TestName: {taskCount: 3, time: 10000}},
    "lastSubmit": 20000,
    "settings": {
        "warnIfForgotToStart": true,
        "moneyEarned": {"payrate": 0, "currency": "USD", "conversionRate": 15},
        "submitTimeEnabled": true,
        "submitTime": 45,
        "autoSubmitTimes": {},
        "instructionTimeEnabled": true,
        "instructionTime": 120
    },
    "worksheet": {}
}

export const testWorksheetData = {
    "settings": {
        "warnIfForgotToStart": true,
        "moneyEarned": {"payrate": 0, "currency": "USD", "conversionRate": 15},
        "submitTimeEnabled": true,
        "submitTime": 45,
        "autoSubmitTimes": {},
        "instructionTimeEnabled": true,
        "instructionTime": 120
    },
    "worksheet": {"1970-01-01": {workedSeconds: 20, taskCount: 3}, "2021-01-01": {workedSeconds: 5, taskCount: 6}}
}

export const settingsTestData = {
    "warnIfForgotToStart": true,
    "moneyEarned": {"payrate": 0, "currency": "USD", "conversionRate": 15},
    "submitTimeEnabled": true,
    "submitTime": 45,
    "autoSubmitTimes": {},
    "instructionTimeEnabled": true,
    "instructionTime": 120
}
