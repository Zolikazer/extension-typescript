import {ChromeStorage} from "../chrome/ChromeStorage";
import {ArrowexTimer} from "../model/ArrowexTimer";
import {Orchestrator} from "./orchestrator";
import {ChromeAPI} from "../chrome/ChromeAPI";
import {TaskCounter} from "./TaskCounter";
import {PageFactory} from "./page";
import {PremiumManager} from "../model/Premium";

const storage = new ChromeStorage();
const arrowexTimer = new ArrowexTimer(storage);
const chromeApi = new ChromeAPI();
const pageFactory = new PageFactory(chromeApi, arrowexTimer);
const orchestrator = new Orchestrator(pageFactory, chromeApi);
const taskCounter = new TaskCounter(arrowexTimer);
const premiumManager = new PremiumManager(storage, chromeApi);

async function main() {
    await arrowexTimer.init();
    await orchestrator.run();
    await taskCounter.countTaskSubmits()

}

function mainWithCheck() {
    if (premiumManager.isPremiumActive) {
        main().then(() => console.log("Main script started"));
    }

}

premiumManager.init().then(mainWithCheck);
premiumManager.addEventListener(PremiumManager.ACTIVATED, mainWithCheck);

