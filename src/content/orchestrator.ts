import {ChromeAPI} from "../chrome/ChromeAPI";
import {EWOQ_OPENED} from "../common/messages";
import {Page, PageFactory} from "./page";


export class Orchestrator {
    private readonly pageFactory: PageFactory
    private readonly chromeApi: ChromeAPI;
    private currentPage: Page;

    constructor(pageFactory: PageFactory, chromeApi: ChromeAPI) {
        this.chromeApi = chromeApi;
        this.pageFactory = pageFactory;
        this.currentPage = null;
        this.chromeApi.sendMessage({msg: EWOQ_OPENED});

    }

    async run() {
        await this.orchestrate();
        MutationObserver = window.MutationObserver;
        const observer = new MutationObserver(() => this.orchestrate());
        observer.observe(document, {
            subtree: true,
            attributes: true
        })

    }

    private async orchestrate() {
        const page = this.pageFactory.getPage();
        if (this.currentPage !== page) {
            this.currentPage = page;
            await this.currentPage.adjustTimer();
            this.currentPage.doOtherStuff();
        }
    }

}
