import {ChromeStorage} from "../chrome/ChromeStorage";
import {ArrowexTimer} from "../model/ArrowexTimer";
import {Orchestrator} from "./orchestrator";
import {ChromeAPI} from "../chrome/ChromeAPI";
import {TaskCounter} from "./TaskCounter";
import {PageFactory} from "./page";

async function main() {
    const storage = new ChromeStorage();
    const arrowexTimer = new ArrowexTimer(storage);
    const chromeApi = new ChromeAPI();
    const pageFactory = new PageFactory(chromeApi, arrowexTimer);
    const orchestrator = new Orchestrator(pageFactory, chromeApi);
    const taskCounter = new TaskCounter(arrowexTimer);

    await arrowexTimer.init();
    await orchestrator.run();
    await taskCounter.countTaskSubmits()

}

main().then(() => console.log("main script started"));
