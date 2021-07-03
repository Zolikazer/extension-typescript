// Copyright (c) 2020 Zoltan Spagina
// All rights reserved.
// Email: okoskacsaka@gmail.com

import {ArrowexTimer} from "../../model/ArrowexTimer";
import {getConversionRateFromUsdTo} from "../../adapters/adapters";

const WARN_SUBMIT_CHECKBOX = document.getElementById("submit-warn");
const PAYRATE_INPUT = document.getElementById("payrate");
const CURRENCY_SELECT = document.getElementById("currencies");
const SUBMIT_TIME_CHECKBOX = document.getElementById("submit-time-enabled");
const SUBMIT_TIME = document.getElementById("submit-time");
const INSTRUCTION_TIME_ENABLED = document.getElementById("instruction-time-enabled");
const INSTRUCTION_TIME = document.getElementById("instruction-time");
const SAVE_STATUS = document.getElementById("save-status");

class SettingsDisplay {
    constructor(arrowexTimer) {
        this.arrowexTimerSettings = arrowexTimer.settings;

    }

    run = () => {
        this.addSaveHandler();
        this.render();
    }

    render = () => {
        this.renderSupportedCurrencies();

        WARN_SUBMIT_CHECKBOX.checked = this.arrowexTimerSettings.warnIfForgotToStart;

        PAYRATE_INPUT.value = this.arrowexTimerSettings.moneyEarned.payrate;

        CURRENCY_SELECT.value = this.arrowexTimerSettings.moneyEarned.currency;

        SUBMIT_TIME_CHECKBOX.checked = this.arrowexTimerSettings.submitTimeEnabled;

        SUBMIT_TIME.value = this.arrowexTimerSettings.submitTime;

        INSTRUCTION_TIME_ENABLED.checked = this.arrowexTimerSettings.instructionTimeEnabled;

        INSTRUCTION_TIME.value = this.arrowexTimerSettings.instructionTime;


    }

    renderSupportedCurrencies = () => {
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

    addSaveHandler = () => {
        const saveBtn = document.getElementById("save-btn");
        saveBtn.addEventListener("click", this.saveSettings)
        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.saveSettings();
            }
        })

    }

    saveSettings = () => {
        SAVE_STATUS.textContent = "Saving settings...";

        this.arrowexTimerSettings.warnIfForgotToStart = WARN_SUBMIT_CHECKBOX.checked;
        this.arrowexTimerSettings.submitTime = parseInt(SUBMIT_TIME.value);
        this.arrowexTimerSettings.submitTimeEnabled = SUBMIT_TIME_CHECKBOX.checked;
        this.arrowexTimerSettings.instructionTimeEnabled = INSTRUCTION_TIME_ENABLED.checked;
        this.arrowexTimerSettings.instructionTime = parseInt(INSTRUCTION_TIME.value);
        this.arrowexTimerSettings.saveState();

        if (this.shouldUpdateMoneyEarned()) {
            // noinspection JSIgnoredPromiseFromCall
            this.updateMoneyEarnedSettings();
        } else {
            SAVE_STATUS.textContent = "Settings saved";
        }

        setTimeout(() => {
            SAVE_STATUS.textContent = "";
        }, 2000);


    }

    updateMoneyEarnedSettings = async () => {
        try {
            const conversionRate = await getConversionRateFromUsdTo(CURRENCY_SELECT.value);
            console.log(conversionRate);
            this.arrowexTimerSettings.moneyEarned.payrate = parseFloat(PAYRATE_INPUT.value);
            this.arrowexTimerSettings.moneyEarned.currency = CURRENCY_SELECT.value;
            this.arrowexTimerSettings.moneyEarned.conversionRate = conversionRate;
            this.arrowexTimerSettings.saveState();
            SAVE_STATUS.textContent = "Settings saved";


        } catch (e) {
            SAVE_STATUS.textContent = "Failed to save settings due to network error. Try later again.";
            SAVE_STATUS.classList.add("class", "text-red");
        }
    }

    shouldUpdateMoneyEarned = () => {
        return this.arrowexTimerSettings.moneyEarned.payrate !== parseFloat(PAYRATE_INPUT.value) || this.arrowexTimerSettings.moneyEarned.currency !== CURRENCY_SELECT.value;
    }


}

function main() {
    const arrowexTimer = new ArrowexTimer();
    const settingsDisplay = new SettingsDisplay(arrowexTimer);
    arrowexTimer.addEventListener(ArrowexTimer.INIT, settingsDisplay.run);
    arrowexTimer.addEventListener(ArrowexTimer.CHANGED, settingsDisplay.render);

    arrowexTimer.init();
}

main();
