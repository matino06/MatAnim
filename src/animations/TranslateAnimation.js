import { Animation } from "../core/Animation.js";

export class TranslateAnimation extends Animation {
    constructor(graphicalObject, options = {}) {
        if (
            !options.delta ||
            typeof options.delta.x !== "number" ||
            typeof options.delta.y !== "number"
        ) {
            throw new Error("TranslateAnimation requires a 'delta' option in the form {x: number, y: number}.");
        }

        super(graphicalObject, options);

        this.delta = options.delta;
        this.lastDelta = { x: 0, y: 0 };
    }

    step(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const progress = Math.min(1, elapsed / this.options.duration);

        const easedProgress = this.options.easingFunction(progress);

        const currentDelta = {
            x: this.delta.x * easedProgress,
            y: this.delta.y * easedProgress
        };

        const frameDelta = {
            x: currentDelta.x - this.lastDelta.x,
            y: currentDelta.y - this.lastDelta.y
        };

        this.graphicalObject.translate(frameDelta);
        this.lastDelta = currentDelta;

        if (progress >= 1) {
            // Make sure to finish in desired position
            this.graphicalObject.translate({
                x: this.delta.x - this.lastDelta.x,
                y: this.delta.y - this.lastDelta.y
            })
            return false;
        } else {
            return true;
        }
    }
}
