// Copyright (c) 2020 Zoltan Spagina
// All rights reserved.
// Email: okoskacsaka@gmail.com

import {DomInspector} from "./DomInspector";
import {ArrowexTimer} from "../model/ArrowexTimer";

export class TaskCounter {
    private domInspector: DomInspector;
    private arrowexTimer: ArrowexTimer;
    private submitButton: Element;
    private taskName: string;
    private isSubmitButtonActiveWhenKeyDown: boolean;

    constructor(domInspector: DomInspector, arrowexTimer: ArrowexTimer) {
        this.arrowexTimer = arrowexTimer;
        this.submitButton = null;
        this.taskName = null;
        this.domInspector = domInspector;
        this.isSubmitButtonActiveWhenKeyDown = false;
    }

    async run(): Promise<void> {
        await this.countTasksByClick();
        await this.countTasksByCtrlEnter();

    }

    private async countTasksByClick() {
        MutationObserver = window.MutationObserver;
        let currentSubmitButton = null;
        let currentTaskName = null;

        const observer = new MutationObserver(() => {
            console.log("Checking if submit");
            currentTaskName = this.domInspector.getTaskName();
            currentSubmitButton = this.domInspector.getSubmitButton();


            let newSubmitButtonRendered = this.isNewSubmitButtonRendered(currentSubmitButton);
            let taskNameChanged = currentTaskName !== this.taskName;
            let submitButtonFound = currentSubmitButton !== null;

            if (submitButtonFound && (newSubmitButtonRendered || taskNameChanged)) {
                this.submitButton = currentSubmitButton;
                this.taskName = currentTaskName;
                currentSubmitButton.addEventListener("click", () => this.tryToCountTask());

                console.log("%c EVENT LISTENER ADDED", "background: #222; color: #bada55");
            }
        })

        observer.observe(document, {
            subtree: true,
            attributes: true
        })

    }


    private isNewSubmitButtonRendered(currentSubmitButton: Element) {
        return currentSubmitButton !== null ? !currentSubmitButton.isSameNode(this.submitButton) : true;
    }

    private async countTasksByCtrlEnter() {
        document.addEventListener("keydown", () => {
            if (this.submitButton !== null) {
                this.isSubmitButtonActiveWhenKeyDown = this.isSubmitButtonActive();
            }
        })

        document.addEventListener("keyup", async (e) => {
            console.log(e)
            if (this.submitButton !== null) {
                if (this.isSubmitButtonActiveWhenKeyDown && e.ctrlKey && e.key === "Enter") {
                    await this.arrowexTimer.countTask(this.taskName);

                }
            }
        })
    }

    private isSubmitButtonActive() {
        return !this.submitButton.classList.contains("is-disabled");
    }

    private async tryToCountTask() {
        if (this.arrowexTimer.isCounting) {
            console.log("it is counting...")
            await this.arrowexTimer.countTask(this.taskName);

        } else {
            alert("Message from Arrow Timer Extension\n\n" +
                "You have submitted a task but the Arrow Timer Extension is not started!\n\n" +
                "You can disable this warning in the settings.")
        }

    }

}

