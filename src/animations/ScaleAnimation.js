import { Animation } from "../core/Animation.js";

export class ScaleAnimation extends Animation {
    constructor(graphicalObject, options = {}) {
        if (
            (!options.xScale || typeof options.xScale !== "number")
            &&
            (!options.yScale || typeof options.yScale !== "number")
        ) {
            throw new Error("Invalid options: xScale or yScale must be provided and must be a number.");
        }

        super(graphicalObject, options);

        this.lastXScale = structuredClone(graphicalObject.lastXScale);
        this.lastYScale = structuredClone(graphicalObject.lastYScale);
        this.xScaleDelta = options.xScale - this.lastXScale;
        this.yScaleDelta = options.yScale - this.lastYScale;
    }

    step(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const progress = Math.min(1, elapsed / this.options.duration);

        const easedProgress = this.options.easingFunction(progress);

        const currentXScale = this.lastXScale + this.xScaleDelta * easedProgress;
        const currentYScale = this.lastYScale + this.yScaleDelta * easedProgress;

        this.graphicalObject.scale(currentXScale, currentYScale);

        if (progress >= 1) {
            // Make sure to finish on desired scale
            this.graphicalObject.translate({
                x: this.lastXScale + this.xScaleDelta,
                y: this.lastYScale + this.yScaleDelta
            })
            return false;
        } else {
            return true;
        }
    }
}
