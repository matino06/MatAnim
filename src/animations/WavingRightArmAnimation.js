import { Animation } from "../core/Animation.js";
import { easeInOutBack } from "../core/easingFunctions.js"
import { MoveRightArmAnimation } from "../animations/MoveRightArmAnimation.js";

const WAVE_AMOUNT = 60;
const MOVE_ARM_BACK_DURATION = 75;
export class WavingRightArmAnimation extends Animation {
    constructor(piCharacter, options = {}) {
        const defaultOptions = {
            duration: 1200,
        }
        super(piCharacter, { ...defaultOptions, ...options });

        this.animationManager = options.animationManager;

        this.lastPosition = { x: 0, y: 0 };
        this.options.duration -= MOVE_ARM_BACK_DURATION;
        this.phase = 0;
    }

    step(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const progress = Math.min(1, elapsed / (this.options.duration / 4));

        // Calculate phase progress (0-1 within each phase)
        const phaseProgress = Math.min(1, progress * 4 - this.phase);
        const easedProgress = easeInOutBack(progress);

        let target;
        switch (this.phase) {
            case 0:
                target = easedProgress;
                break;
            case 1:
                target = (1 - easedProgress);
                break;
            case 2:
                target = easedProgress;
                break;
            case 3:
                target = (1 - easedProgress);
                break;
        }

        const position = {
            x: Math.cos(target) * WAVE_AMOUNT,
            y: -Math.sin(target) * WAVE_AMOUNT
        };
        this.graphicalObject.piCharacterBody.moveRightArm({
            x: position.x - this.lastPosition.x,
            y: position.y - this.lastPosition.y
        });

        this.lastPosition = position;

        // Move to next phase if current completes
        if (phaseProgress >= 1 && this.phase < 3) {
            this.phase++;
            this.startTime = timestamp;
            return true;
        }

        if (progress >= 1) {
            // Final adjustment
            this.graphicalObject.piCharacterBody.moveRightArm({
                x: Math.cos(target) * WAVE_AMOUNT - this.lastPosition.x,
                y: -Math.sin(target) * WAVE_AMOUNT - this.lastPosition.y
            });

            // Move arm to the original position
            this.animationManager.add(new MoveRightArmAnimation(this.graphicalObject, {
                delta: {
                    x: -WAVE_AMOUNT, y: 0
                },
                duration: MOVE_ARM_BACK_DURATION
            }))

            return false;
        }
        return true;
    }
}