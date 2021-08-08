import {Observable} from "../../../src/model/Observable";

describe("Observable", () => {
    it('should store event listeners and call them on event', function () {
        const observable = new Observable();
        const eventName = "foo";
        const mockCallback = jest.fn();
        observable.addEventListener(eventName, mockCallback);
        observable.notify(eventName);
        expect(mockCallback).toBeCalledTimes(1);
    });
})
