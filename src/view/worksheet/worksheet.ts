import { ArrowexTimer } from "../../model/ArrowexTimer";
import { DatetimeUtils } from "../../datetime/datetimeUtils";
import { calculateRph, getWorkedTimeString } from "../../common/utils";
import { ChromeStorage } from "../../chrome/ChromeStorage";
import { ChromeAPI } from "../../chrome/ChromeAPI";

export class Worksheet {
    private readonly arrowexTimer: ArrowexTimer;
    private readonly chromeApi: ChromeAPI;

    constructor(arrowexTimer: ArrowexTimer, chromeApi: ChromeAPI) {
        this.arrowexTimer = arrowexTimer;
        this.chromeApi = chromeApi;
    }

    render() {
        if (this.arrowexTimer.worksheet !== {}) {
            this.renderYesterdayStat();
            this.renderThisMonthStat();
            this.handleButtonClick();
        } else {
            this.hideFullWorksheetButton();
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

    private hideFullWorksheetButton() {
        document.getElementById("worksheet-btn").style.display = "none";

    }

    private handleButtonClick() {
        const button = document.getElementById("worksheet-btn");
        button.addEventListener("click", () => this.chromeApi.createTab("view/worksheet/full_worksheet.html"));
    }
}

async function main() {
    const chromeStorage = new ChromeStorage();
    const arrowexTimer = new ArrowexTimer(chromeStorage);
    const chromeApi = new ChromeAPI();
    const worksheet = new Worksheet(arrowexTimer, chromeApi);

    await arrowexTimer.init();

    worksheet.render();
}

main();
