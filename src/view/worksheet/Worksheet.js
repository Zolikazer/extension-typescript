import {calculateRph, getWorkedTimeString} from "../../datetime.js";
import {getCurrentTimeInPst, getYYYYMMString} from "../../common/datetime_utils";

export class Worksheet {
    constructor(arrowexTimer) {
        this.arrowexTimer = arrowexTimer;
    }

    render = () => {
        this.renderYesterdayStat();
        this.renderThisMonthStat();
    }


    renderYesterdayStat = () => {
        const yesterdayStatContainer = document.getElementById("last-day-stat");
        const lastWorkedDayStat = this.arrowexTimer.getLastDayFromWorksheet();

        yesterdayStatContainer.innerHTML = this.getRenderedStat(lastWorkedDayStat.date, lastWorkedDayStat.taskCount,
            lastWorkedDayStat.workedSeconds);

    }

    renderThisMonthStat = () => {
        const currentDateInPst = new Date(getCurrentTimeInPst());
        const currentYearAndMonth = getYYYYMMString(currentDateInPst);

        const [taskCount, workedSeconds] = this.collectMonthTaskCountAndWorkedSeconds(this.arrowexTimer.worksheet, currentYearAndMonth);

        const thisMonthStatDom = document.getElementById("monthly-stat");
        thisMonthStatDom.innerHTML = this.getRenderedStat(currentYearAndMonth, taskCount, workedSeconds);

    }

    collectMonthTaskCountAndWorkedSeconds = (worksheet, YYYYMMString) => {
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

    getRenderedStat = (date, taskCount, workedSeconds) => {
        const rph = calculateRph(workedSeconds, taskCount);
        const workedTime = getWorkedTimeString(workedSeconds);

        return `<p id="date" class="font-bold">${date}</p>
        <p>Tasks: ${taskCount}</p>
        <p>Time: ${workedTime}</p>
        <p>RPH: ${rph} (s)</p>`
    }


}
