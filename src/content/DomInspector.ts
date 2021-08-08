import {isTest} from "../common/utils";

export class DomInspector {
    constructor() {
    }

    getTaskName = (): string => {
        return document.getElementsByClassName("taskTitle")[0].innerHTML;
    }

    getTaskNameNode = (): Element => {
        return document.getElementsByClassName("taskTitle")[0];
    }

    getSubmitButton = (): Element => {
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

    getContinueButton = (): Element => {
        return document.getElementsByClassName("continue-button")[0];
    }

    getArrowexTimer = (): Element => {
        return document.getElementById("arrowex-timer");
    }

    getInstructionFooter = (): Element => {
        return document.getElementsByClassName("continue-button-container")[0];
    }

    getArrowexClock = (): Element => {
        return document.getElementById("arrowex-timer-clock");
    }

    getAcquireTaskButton = (): Element => {
        return <Element>document.evaluate("/html/body/rating-portal-root/rating-portal-app" +
            "/div[2]/div/section/rating-home/div[1]/start-task-panel/div/material-button", document, null,
            XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

}
