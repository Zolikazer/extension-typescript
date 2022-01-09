export const isTest = (): boolean => {
    return document.location.href.includes("file:///");
}

export function getWorkedTimeString(workedTimeInSeconds: number): string {
    return new Date(workedTimeInSeconds * 1000).toISOString().substr(11, 5);
}

export function calculateRph(workedSeconds: number, taskCount: number): number {
    if (taskCount === 0) {
        return 0;
    }
    return parseInt(String(workedSeconds / taskCount));

}

export function renderTask(taskName: string, taskData: { [index: string]: any }) {
    let dRenderedTask = document.createElement("div");
    dRenderedTask.setAttribute("id", taskName);
    dRenderedTask.setAttribute("class", "tasks");

    dRenderedTask.append(renderTaskName());
    dRenderedTask.append(renderTaskStat());
    dRenderedTask.append(document.createElement("hr"));

    return dRenderedTask;


    function renderTaskName() {
        let dTaskName = document.createElement("p");
        dTaskName.innerHTML = taskName;
        dTaskName.setAttribute("class", "font-bold");

        return dTaskName;
    }

    function renderTaskStat() {
        let dTaskStat = document.createElement("p");
        let numberOfSolvedTasks = taskData.taskCount;
        let taskWorkedMinutes = parseInt(String(taskData.time / 1000 / 60));
        let taskWorkedSeconds = parseInt(String(taskData.time / 1000));

        dTaskStat.innerHTML = `Tasks: ${numberOfSolvedTasks} Time: ${taskWorkedMinutes} (m) RPH: ${calculateRph(taskWorkedSeconds, numberOfSolvedTasks)} (s)`;

        return dTaskStat;
    }


}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
