// Copyright (c) 2020 Zoltan Spagina
// All rights reserved.
// Email: okoskacsaka@gmail.com

import {DomInspector} from "./DomInspector";
import {ArrowexTimer} from "../model/ArrowexTimer";

export class TaskCounter {
    private arrowexTimer: ArrowexTimer;
    private submitButton: Element;
    private taskName: string;
    private currentSubmitButton: Element;
    // private currentTaskName: string;


    constructor(arrowexTimer: ArrowexTimer) {
        this.arrowexTimer = arrowexTimer;
        this.submitButton = null;
        this.taskName = null;
        this.currentSubmitButton = null;
        // this.currentTaskName = null;
    }

    async countTaskSubmits(): Promise<void> {
        await this.countTasksByClick();
        await this.countTasksByCtrlEnter();

    }

    private async countTasksByClick() {
        MutationObserver = window.MutationObserver;
        const observer = new MutationObserver(() => {
            this.updateObservedNodesUponDomChange();
            if (this.isNewEventListenerNeeded()) {
                console.log("adding new event listener")
                this.addNewEventListener();
            }
        });
        observer.observe(document, {
            subtree: true,
            attributes: true
        })

    }

    private async countTasksByCtrlEnter() {
        let isSubmitButtonActiveWhenKeyDown = false;
        document.addEventListener("keydown", () => {
            if (this.submitButton !== null) {
                isSubmitButtonActiveWhenKeyDown = this.isSubmitButtonActive();
            }
        })

        document.addEventListener("keyup", async (e) => {
            if (this.submitButton !== null) {
                if (isSubmitButtonActiveWhenKeyDown && e.ctrlKey && e.key === "Enter") {
                    await this.arrowexTimer.countTask(this.taskName);

                }
            }
        })
    }


    private addNewEventListener() {
        this.submitButton = this.currentSubmitButton;
        // this.taskName = this.currentTaskName;
        this.submitButton.addEventListener("click", () => this.arrowexTimer.countTask(this.taskName));

        console.log("%c EVENT LISTENER ADDED", "background: #222; color: #bada55");
        // alert("event listener added")
    }

    private isNewEventListenerNeeded() {
        let newSubmitButtonRendered = this.isNewSubmitButtonRendered(this.currentSubmitButton);
        // let taskNameChanged = this.currentTaskName !== this.taskName;
        let submitButtonFound = this.currentSubmitButton !== null;

        console.log("new submit button: " + newSubmitButtonRendered)
        // console.log("task name changed" + taskNameChanged)
        console.log("submit button found" + submitButtonFound)
        return submitButtonFound && newSubmitButtonRendered;
    }

    private isNewSubmitButtonRendered(currentSubmitButton: Element) {
        return currentSubmitButton !== null ? !currentSubmitButton.isSameNode(this.submitButton) : true;
    }

    private isSubmitButtonActive() {
        return !this.submitButton.classList.contains("is-disabled");
    }

    private updateObservedNodesUponDomChange() {
        this.taskName = DomInspector.getTaskName();
        this.currentSubmitButton = DomInspector.getSubmitButton();
    }
}

