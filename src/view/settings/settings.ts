// Copyright (c) 2020 Zoltan Spagina
// All rights reserved.
// Email: okoskacsaka@gmail.com

import {ArrowexTimer} from "../../model/ArrowexTimer";
import {ChromeStorage} from "../../chrome/ChromeStorage";
import {ArrowexTimerSettings} from "../../model/ArrowexTimerSettings";

const WARN_SUBMIT_CHECKBOX = document.getElementById("submit-warn");
const PAYRATE_INPUT = document.getElementById("payrate");
const CURRENCY_SELECT = document.getElementById("currencies");
const SUBMIT_TIME_CHECKBOX = document.getElementById("submit-time-enabled");
const SUBMIT_TIME = document.getElementById("submit-time");
const INSTRUCTION_TIME_ENABLED = document.getElementById("instruction-time-enabled");
const INSTRUCTION_TIME = document.getElementById("instruction-time");
const SAVE_STATUS = document.getElementById("save-status");
const CONVERSION_RATE = document.getElementById("conversion-rate");

class SettingsDisplay {
    private readonly arrowexTimerSettings: ArrowexTimerSettings;

    constructor(arrowexTimer: ArrowexTimer) {
        this.arrowexTimerSettings = arrowexTimer.settings;

    }

    async run(): Promise<void> {
        await this.addSaveHandler();
        this.render();
    }

    render(): void {
        this.renderSupportedCurrencies();
        // @ts-ignore
        PAYRATE_INPUT.value = this.arrowexTimerSettings.moneyEarned.payrate;

        // @ts-ignore
        CURRENCY_SELECT.value = this.arrowexTimerSettings.moneyEarned.currency;

        // @ts-ignore
        SUBMIT_TIME_CHECKBOX.checked = this.arrowexTimerSettings.submitTimeEnabled;

        // @ts-ignore
        SUBMIT_TIME.value = this.arrowexTimerSettings.submitTime;

        // @ts-ignore
        INSTRUCTION_TIME_ENABLED.checked = this.arrowexTimerSettings.instructionTimeEnabled;

        // @ts-ignore
        INSTRUCTION_TIME.value = this.arrowexTimerSettings.instructionTime;

        if (this.arrowexTimerSettings.moneyEarned.conversionRate !== null) {
            // @ts-ignore
            CONVERSION_RATE.value = this.arrowexTimerSettings.moneyEarned.conversionRate;
        } else {
            // @ts-ignore
            CONVERSION_RATE.value = 0;
        }

    }

    renderSupportedCurrencies(): void {
        const currencies = ["HUF", "USD", "CAD", "HKD", "ISK", "PHP", "DKK",
            "CZK", "GBP", "RON", "SEK", "IDR", "INR",
            "BRL", "RUB", "HRK", "JPY", "THB", "CHF", "EUR", "MYR", "BGN",
            "TRY", "CNY", "NOK", "NZD", "ZAR", "MXN", "SGD", "AUD", "ILS", "KRW", "PLN"];

        const currenciesDropdown = document.getElementById("currencies");

        for (const currency of currencies) {
            const opt = document.createElement("option");
            opt.value = currency;
            opt.innerHTML = currency;
            currenciesDropdown.appendChild(opt);
        }

    }

    async addSaveHandler() {
        const saveBtn = document.getElementById("save-btn");
        saveBtn.addEventListener("click", async () => await this.saveSettings())
        document.addEventListener("keydown", async (e) => {
            if (e.key === "Enter") {
                await this.saveSettings();
            }
        })

    }

    async saveSettings() {
        SAVE_STATUS.textContent = "Saving settings...";
        // @ts-ignore
        this.arrowexTimerSettings.submitTime = parseInt(SUBMIT_TIME.value);
        // @ts-ignore
        this.arrowexTimerSettings.submitTimeEnabled = SUBMIT_TIME_CHECKBOX.checked;
        // @ts-ignore
        this.arrowexTimerSettings.instructionTimeEnabled = INSTRUCTION_TIME_ENABLED.checked;
        // @ts-ignore
        this.arrowexTimerSettings.instructionTime = parseInt(INSTRUCTION_TIME.value);
        // @ts-ignore
        this.arrowexTimerSettings.moneyEarned.conversionRate = parseFloat(CONVERSION_RATE.value);
        // @ts-ignore
        this.arrowexTimerSettings.moneyEarned.payrate = parseFloat(PAYRATE_INPUT.value);
        // @ts-ignore
        this.arrowexTimerSettings.moneyEarned.currency = CURRENCY_SELECT.value;

        await this.arrowexTimerSettings.saveState();


        SAVE_STATUS.textContent = "Settings saved";


        setTimeout(() => {
            SAVE_STATUS.textContent = "";
        }, 2000);


    }

}

async function main() {
    const chromeStorage = new ChromeStorage();
    const arrowexTimer = new ArrowexTimer(chromeStorage);
    const settingsDisplay = new SettingsDisplay(arrowexTimer);
    await arrowexTimer.init();
    await settingsDisplay.run();
    arrowexTimer.onChange(() => settingsDisplay.render());
}

main();
