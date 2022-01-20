import { ArrowexTimer } from "../../model/ArrowexTimer";
import { DatetimeUtils } from "../../datetime/datetimeUtils";
import { calculateRph, getWorkedTimeString } from "../../common/utils";
import { ChromeStorage } from "../../chrome/ChromeStorage";

export class Worksheet {
    private readonly arrowexTimer: ArrowexTimer;

    constructor(arrowexTimer: ArrowexTimer) {
        this.arrowexTimer = arrowexTimer;
    }

    render() {
        if (this.arrowexTimer.worksheet !== {}) {
            this.renderYesterdayStat();
            this.renderThisMonthStat();
        }
    }


    renderYesterdayStat() {
        const yesterdayStatContainer = document.getElementById("last-day-stat");
        const lastWorkedDayStat = this.getLastWorkedDayThatIsNotToday();

        yesterdayStatContainer.innerHTML = this.getRenderedStat(lastWorkedDayStat.date, lastWorkedDayStat.taskCount,
          lastWorkedDayStat.workedSeconds);

    }

    renderThisMonthStat() {
        const currentDateInPst = new Date(DatetimeUtils.getCurrentTimeInPst());
        const currentYearAndMonth = DatetimeUtils.getYYYYMMString(currentDateInPst);

        const [taskCount, workedSeconds] = this.collectMonthTaskCountAndWorkedSeconds(this.arrowexTimer.worksheet, currentYearAndMonth);

        const thisMonthStatDom = document.getElementById("monthly-stat");
        thisMonthStatDom.innerHTML = this.getRenderedStat(currentYearAndMonth, taskCount, workedSeconds);

    }

    collectMonthTaskCountAndWorkedSeconds(worksheet: { [index: string]: any }, YYYYMMDateString: string) {
        let totalTaskCount = 0;
        let totalWorkedSecond = 0;

        for (const [date, data] of Object.entries(worksheet)) {
            if (date.slice(0, 7) === YYYYMMDateString) {
                totalTaskCount += data.taskCount;
                totalWorkedSecond += data.workedSeconds;

            }
        }

        return [totalTaskCount, totalWorkedSecond];

    }

    getRenderedStat(date: string, taskCount: number, workedSeconds: number) {
        const rph = calculateRph(workedSeconds, taskCount);
        const workedTime = getWorkedTimeString(workedSeconds);

        return `<p id="date" class="font-bold">${date}</p>
        <p>Tasks: ${taskCount}</p>
        <p>Time: ${workedTime}</p>
        <p>RPH: ${rph} (s)</p>`;
    }


    getLastWorkedDayThatIsNotToday() {
        const currentDateInPst = new Date(DatetimeUtils.getCurrentTimeInPst());
        const currentDateString = DatetimeUtils.getYYYYMMDDString(currentDateInPst);

        const dates = Object.keys(this.arrowexTimer.worksheet);
        dates.sort();
        let lastDayDate = dates[dates.length - 1];
        if (currentDateString === lastDayDate) {
            lastDayDate = dates[dates.length - 2];
        }
        const lastDayData = this.arrowexTimer.worksheet[lastDayDate];
        lastDayData["date"] = lastDayDate;

        return lastDayData;

    }
}

async function main() {
    const chromeStorage = new ChromeStorage();
    const arrowexTimer = new ArrowexTimer(chromeStorage);
    const worksheet = new Worksheet(arrowexTimer);

    await arrowexTimer.init();

    worksheet.render();
}

main();
