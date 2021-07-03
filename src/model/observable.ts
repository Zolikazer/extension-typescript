export class Observable {
    private observers: { [index: string]: any } = {};


    addEventListener = (event: string, callback: (ev: Event) => void): void => {
        if (this.observers.hasOwnProperty(event)) {
            this.observers[event].push(callback);
        } else {
            this.observers[event] = [callback];

        }

    }

    notify = (event: string): void => {
        if (this.observers.hasOwnProperty(event)) {
            for (const callback of this.observers[event]) {
                callback();
            }
        }
    }
}
