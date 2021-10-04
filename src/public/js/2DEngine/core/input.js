import {Vector2} from "../math/math.js";

export class Input {

    constructor(scrollCallbacks) {
        this._activeKey = -1;
        this._activeMouseButton = -1;
        this._currentMousePosition = new Vector2(0,0);
        this._scrollCallbacks = scrollCallbacks;
    }

    getMousePosition() {
        return this._currentMousePosition;
    }

    getActiveKeyCode() {
        return this._activeKey;
    }

    getActiveMouseButton() {
        return this._activeMouseButton;
    }

    isKeyPressed(key) {
        return this._activeKey === key;
    }

    isMouseButtonPressed(button) {
        return this._activeMouseButton === button;
    }

    onMouseDown(event) {
        this._activeMouseButton = event.button;
    }

    onMouseUp() {
        this._activeMouseButton = -1;
    }

    onKeyDown(event) {
        this._activeKey = event.code;
    }

    onScroll(event) {
        for(let i = 0; i < this._scrollCallbacks.length; i++)
            this._scrollCallbacks[i](event.deltaX, event.deltaY);
    }

    onKeyUp() {
        this._activeKey = -1;
    }

    onMouseMove(event) {
        let self = this;
        let xPosition = event.pageX;
        let yPosition = event.pageY;

        const frameMousePosition = new Vector2(xPosition, yPosition);
        const mouseDelta =  (frameMousePosition - self._currentMousePosition) * 0.002;

        self._currentMousePosition = frameMousePosition;
    }
}
