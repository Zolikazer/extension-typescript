import { ChromeStorage } from "../../chrome/ChromeStorage";
import { ArrowexTimer } from "../../model/ArrowexTimer";
import { calculateRph, getWorkedTimeString } from "../../common/utils";


class FullWorksheet {
    private readonly arrowexTimer: ArrowexTimer;

    constructor(arrowexTimer: ArrowexTimer) {
        this.arrowexTimer = arrowexTimer;
    }

    public render() {
        const worksheetTable = document.getElementById("worksheet-table");

        let tableContent: string = "<tr>\<th>Date</th><th>Worked time</th><th>Task count</th><th>RPH</th></tr>";
        for (const [date, data] of Object.entries(this.arrowexTimer.worksheet).reverse()) {
            tableContent += this.buildRowFromData(date, data);
        }
        worksheetTable.innerHTML = tableContent;

    }

    private buildRowFromData(date: string, data: { [index: string]: any }): string {
        const rph = calculateRph(data.workedSeconds, data.taskCount);
        const workedTime = getWorkedTimeString(data.workedSeconds);

        return `<tr><th>${date}</th><th>${workedTime}</th><th>${data.taskCount}</th><th>${rph} (s)</th></tr>`;
    }
}

async function main() {
    const chromeStorage = new ChromeStorage();
    const arrowexTimer = new ArrowexTimer(chromeStorage);
    const fullWorksheet = new FullWorksheet(arrowexTimer);

    await arrowexTimer.init();
    fullWorksheet.render();
}

main();
