const ONE_DAY_IN_HOURS = 24;
const ONE_HOUR_IN_MINUTES = 60;
const ONE_MINUTE_IN_SECONDS = 60;
export const ONE_SECOND_IN_MILLISECONDS = 1000;

const PST_OFFSET_IN_HOURS = 7;


export class DatetimeManager {
    getCurrentTimeInPst = (): number => {
        const currentDate = new Date();
        const currentEpochTimeInMilliseconds = currentDate.getTime();
        const clientOffsetInMilliseconds = this.convertMinutesToMilliseconds(currentDate.getTimezoneOffset());
        const PSTOffsetInMilliseconds = this.convertHoursToMilliseconds(PST_OFFSET_IN_HOURS);

        return currentEpochTimeInMilliseconds + clientOffsetInMilliseconds - PSTOffsetInMilliseconds;
    };

    convertMinutesToMilliseconds = (minutes: number): number => {
        return minutes * ONE_MINUTE_IN_SECONDS * ONE_SECOND_IN_MILLISECONDS;
    };

    convertHoursToMilliseconds = (hours: number): number => {
        return hours * ONE_HOUR_IN_MINUTES * ONE_MINUTE_IN_SECONDS * ONE_SECOND_IN_MILLISECONDS;
    };

    getYYYYMMDDString(date: Date): string {
        const yyyy = date.getFullYear();
        let mm: number | string = date.getMonth() + 1;
        let dd: number | string = date.getDate();

        mm = mm > 10 ? mm : "0" + mm;
        dd = dd > 10 ? dd : "0" + dd;
        return `${yyyy}-${mm}-${dd}`;

    }

    getYYYYMMString(date: Date): string {
        const yyyy = date.getFullYear();
        let mm: number | string = date.getMonth() + 1;
        mm = mm > 10 ? mm : "0" + mm;

        return `${yyyy}-${mm}`;
    };
}
