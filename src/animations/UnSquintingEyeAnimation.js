import { Animation } from "../core/Animation.js";

export class UnSquintingEyeAnimation extends Animation {
    constructor(eyeObject, options = {}) {
        if (eyeObject.eyeBall.squintAmount === undefined) {
            throw new Error("UnSquintingEyeAnimation requires 'eyeObject' to have a 'squintAmount' property.");
        }

        const defaultOptions = {
            duration: 200,
        }
        super(eyeObject, { ...defaultOptions, ...options });

        this.squintAmount = structuredClone(eyeObject.eyeBall.squintAmount);
        this.lastSquintAmount = 0;
    }

    step(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const progress = Math.min(1, elapsed / this.options.duration);

        const easedProgress = this.options.easingFunction(progress);

        const currentSquintAmount = this.squintAmount - this.squintAmount * easedProgress;

        this.graphicalObject.moveEyeTop(currentSquintAmount);

        this.lastSquintAmount = currentSquintAmount;

        if (progress >= 1) {
            // Make sure to finish with a desired squint
            this.graphicalObject.moveEyeTop(0);
            return false;
        } else {
            return true;
        }
    }
}
