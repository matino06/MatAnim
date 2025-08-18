import { Animation } from "../core/Animation.js";

export class MoveRightArmAnimation extends Animation {
    constructor(piCharacter, options = {}) {
        if (!options.delta
            ||
            (!options.delta.x || typeof options.delta.x !== "number")
            &&
            (!options.delta.y || typeof options.delta.y !== "number")
        ) {
            throw new Error("Invalid options: delta must be provided and must have two numbers x and y.");
        }

        const defaultOptions = {
            duration: 1000,
        }
        super(piCharacter, { ...defaultOptions, ...options });

        this.delta = options.delta;

        this.lastPosition = { x: 0, y: 0 };
    }

    step(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const progress = elapsed / this.options.duration;

        const easedProgress = this.options.easingFunction(progress);

        const position = {
            x: this.delta.x * easedProgress,
            y: this.delta.y * easedProgress
        };
        this.graphicalObject.piCharacterBody.moveRightArm({
            x: position.x - this.lastPosition.x,
            y: position.y - this.lastPosition.y
        });

        this.lastPosition = position;

        if (progress >= 1) {
            this.graphicalObject.piCharacterBody.moveRightArm({
                x: this.delta.x - this.lastPosition.x,
                y: this.delta.y - this.lastPosition.y
            });

            return false;
        }
        return true;
    }
}