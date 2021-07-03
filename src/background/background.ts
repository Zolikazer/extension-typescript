import {ChromeStorage} from "../storage/chromeStorage";

const storage = new ChromeStorage();
const button = document.getElementById("btn")

let taskCount;
button.addEventListener("click", async () => {
    taskCount = await storage.get("taskCount");
    console.log(taskCount);
})