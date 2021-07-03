import {Worksheet} from "./Worksheet.js";
import {ArrowexTimer} from "../../model/ArrowexTimer";

function main() {
    const arrowexTimer = new ArrowexTimer();
    const worksheet = new Worksheet(arrowexTimer);

    arrowexTimer.addEventListener(ArrowexTimer.INIT, worksheet.render);

    arrowexTimer.init();
}

main()