import {DomInspector} from "./DomInspector";
import {ChromeStorage} from "../chrome/ChromeStorage";
import {DatetimeManager} from "../datetime/datetimeManager";
import {ArrowexTimer} from "../model/ArrowexTimer";
import {Orchestrator} from "./Orchestrator";
import {InstructionTimer} from "./InstructionTimer";
import {ChromeAPI} from "../chrome/ChromeAPI";
import {TaskCounter} from "./TaskCounter";
import {NtaNotifier} from "./NtaNotifier";

async function main() {
    const domInspector = new DomInspector();
    const storage = new ChromeStorage();
    const datetimeManager = new DatetimeManager();
    const arrowexTimer = new ArrowexTimer(storage, datetimeManager);
    const chromeApi = new ChromeAPI();
    const instructionTimer = new InstructionTimer(domInspector, arrowexTimer.settings, chromeApi);
    const orchestrator = new Orchestrator(domInspector, instructionTimer, arrowexTimer, datetimeManager);
    const taskCounter = new TaskCounter(domInspector, arrowexTimer);
    const ntaNotifier = new NtaNotifier(domInspector, chromeApi, datetimeManager);
    await arrowexTimer.init();

    await orchestrator.run();
    await taskCounter.run()
    setTimeout(ntaNotifier.run, 5000);

}

main().then(r => console.log("main script started"));
