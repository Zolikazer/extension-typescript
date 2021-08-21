// Copyright (c) 2020 Zoltan Spagina
// All rights reserved.
// Email: okoskacsaka@gmail.com


import {ChromeStorage} from "../../chrome/ChromeStorage";
import {renderTask} from "../../common/utils";


async function render(chromeStorage: ChromeStorage) {
    const tasks = await chromeStorage.get("tasks");
    let taskStats = document.getElementById("task-stats");
    for (const [taskName, taskData] of Object.entries(tasks.tasks)) {
        taskStats.append(renderTask(taskName, taskData));
    }
    document.body.style.height = document.body.scrollHeight + 10 + "px";

}

const chromeStorage = new ChromeStorage();

render(chromeStorage);
