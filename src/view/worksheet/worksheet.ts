import {ArrowexTimer} from "../../model/ArrowexTimer";
import {DatetimeManager} from "../../datetime/datetimeManager";
import {calculateRph, getWorkedTimeString} from "../../common/utils";
import {ChromeStorage} from "../../chrome/ChromeStorage";

class Worksheet {
    private readonly arrowexTimer: ArrowexTimer;
    private readonly datetimeManager: DatetimeManager;

    constructor(arrowexTimer: ArrowexTimer, datetimeManager: DatetimeManager) {
        this.arrowexTimer = arrowexTimer;
        this.datetimeManager = datetimeManager;
    }

    render() {
        if (this.arrowexTimer.worksheet !== {}) {
            this.renderYesterdayStat();
            this.renderThisMonthStat();
        }
    }


    renderYesterdayStat() {
        const yesterdayStatContainer = document.getElementById("last-day-stat");
        const lastWorkedDayStat = this.arrowexTimer.getLastDayFromWorksheet();

        yesterdayStatContainer.innerHTML = this.getRenderedStat(lastWorkedDayStat.date, lastWorkedDayStat.taskCount,
            lastWorkedDayStat.workedSeconds);

    }

    renderThisMonthStat() {
        const currentDateInPst = new Date(this.datetimeManager.getCurrentTimeInPst());
        const currentYearAndMonth = this.datetimeManager.getYYYYMMString(currentDateInPst);

        const [taskCount, workedSeconds] = this.collectMonthTaskCountAndWorkedSeconds(this.arrowexTimer.worksheet, currentYearAndMonth);

        const thisMonthStatDom = document.getElementById("monthly-stat");
        thisMonthStatDom.innerHTML = this.getRenderedStat(currentYearAndMonth, taskCount, workedSeconds);

    }

    collectMonthTaskCountAndWorkedSeconds(worksheet: { [index: string]: any }, YYYYMMString: string) {
        let totalTaskCount = 0;
        let totalWorkedSecond = 0;

        for (const [date, data] of Object.entries(worksheet)) {
            if (date.slice(0, 7) === YYYYMMString) {
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
        <p>RPH: ${rph} (s)</p>`
    }


}

async function main() {
    const chromeStorage = new ChromeStorage();
    const datetimeManager = new DatetimeManager();
    const arrowexTimer = new ArrowexTimer(chromeStorage, datetimeManager);
    const worksheet = new Worksheet(arrowexTimer, datetimeManager);

    await arrowexTimer.init();

    worksheet.render();
}

main()
