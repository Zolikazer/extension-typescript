import {isTest} from "../common/utils";

export class DomInspector {
    static getTaskName(): string {
        return document.getElementsByClassName("taskTitle")[0].innerHTML;
    }

    static getTaskNameNode(): Element {
        return document.getElementsByClassName("taskTitle")[0];
    }

    static getSubmitButton(): Element {
        let submitButton = document.evaluate('//*[text()="' + "Submit" + '"]', document, null,
            XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (isTest()) {
            return <Element>submitButton;
        }

        if (submitButton === null) {
            return null;
        }

        return submitButton.parentElement;

    }

    static getContinueButton(): Element {
        return document.getElementsByClassName("continue-button")[0];
    }

    static getArrowexTimer(): Element {
        return document.getElementById("arrowex-timer");
    }

    static getInstructionFooter(): Element {
        return document.getElementsByClassName("continue-button-container")[0];
    }

    static getArrowexClock(): Element {
        return document.getElementById("arrowex-timer-clock");
    }

    static getAcquireTaskButton(): Element {
        return <Element>document.evaluate("/html/body/rating-portal-root/rating-portal-app" +
            "/div[2]/div/section/rating-home/div[1]/start-task-panel/div/material-button", document, null,
            XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

}
