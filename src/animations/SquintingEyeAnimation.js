import { Animation } from "../core/Animation.js";

const SQUINT_AMOUNT = 10;
export class SquintingEyeAnimation extends Animation {
    constructor(eyeObject, options = {}) {
        const defaultOptions = {
            duration: 200,
        }
        super(eyeObject, { ...defaultOptions, ...options });

        this.lastSquintAmount = 0;
    }

    step(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const progress = Math.min(1, elapsed / this.options.duration);

        const easedProgress = this.options.easingFunction(progress);

        const currentSquintAmount = SQUINT_AMOUNT * easedProgress - this.lastSquintAmount;

        this.graphicalObject.moveEyeTop(currentSquintAmount);

        if (progress >= 1) {
            // Make sure to finish with a desired squint
            this.graphicalObject.moveEyeTop(SQUINT_AMOUNT - this.lastSquintAmount);
            return false;
        } else {
            return true;
        }
    }
}
