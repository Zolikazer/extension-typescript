// import {convertMillisecondsToMinutes, getCurrentTimeInPst, getMillisecondsUntilNewDay} from "../common/datetime_utils";
//
// export class TimerReset {
//     static RESET_TIMER_ALARM = "resetTimer";
//
//     constructor(arrowexTimer) {
//         this.arrowexTimer = arrowexTimer;
//
//     }
//
//     run = () => {
//         // this.resetTimerIfRequired();
//         this.scheduleTimerReset();
//         this.handleResetAlarm();
//     }
//
//     resetTimerIfRequired = () => {
//         const currentTime = getCurrentTimeInPst();
//         console.log("PST time: :" + currentTime)
//         if (this.shouldResetTimerUponStart(currentTime)) {
//             this.arrowexTimer.resetTimer();
//             this.createTimerResetNotification();
//         }
//     }
//
//     shouldResetTimerUponStart = (currentTime) => {
//         const currentDay = new Date(currentTime).getDate();
//
//         const lastDateInWorksheet = this.arrowexTimer.getLastDayFromWorksheet()["date"]
//         const lastDayInWorksheet = parseInt(lastDateInWorksheet.slice(-2));
//
//         console.log("current day: " + currentDay)
//         console.log("last date in worksheet: " + lastDateInWorksheet)
//         console.log("last day in worksheet: " + lastDayInWorksheet)
//         console.log("last submit: " + this.arrowexTimer.lastSubmit)
//         return this.arrowexTimer.lastSubmit !== null && currentDay > lastDayInWorksheet;
//     }
//
//     createTimerResetNotification = () => {
//         chrome.notifications.create("", {
//             title: "Timer Reset!",
//             message: "The Arrowex timer has been reset!",
//             type: "basic",
//             iconUrl: "../images/arrow_16.png"
//         });
//     }
//
//     handleResetAlarm = () => {
//         chrome.alarms.onAlarm.addListener((alarm) => {
//             if (alarm.name === TimerReset.RESET_TIMER_ALARM) {
//                 this.arrowexTimer.resetTimer();
//                 this.createTimerResetNotification();
//             }
//         })
//     }
//
//     scheduleTimerReset = () => {
//         const PSTTime = getCurrentTimeInPst();
//         const millisecondsUntilNewDay = getMillisecondsUntilNewDay(new Date(PSTTime));
//         console.log(convertMillisecondsToMinutes(millisecondsUntilNewDay))
//         chrome.alarms.create(TimerReset.RESET_TIMER_ALARM,
//             {delayInMinutes: (convertMillisecondsToMinutes(millisecondsUntilNewDay))});
//     }
//
// }
