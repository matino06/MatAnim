import { Animation } from "../core/Animation.js"
import { drawOutline, fadeInFill } from "../utils/animationUtils.js";

export class OutlineThanFillAnimation extends Animation {
    constructor(graphicalObject, duration = 500, fillFadeDuration = 500) {
        super(graphicalObject, duration)

        if (!graphicalObject.getCommands()) {
            return;
        }

        this.fill = graphicalObject.fill;
        this.fillFadeDuration = fillFadeDuration;

        this.commands = graphicalObject.getCommands();
        this.totalLength = 0;
        this.segmentLengths = [];
        for (let i = 1; i < this.commands.length; i++) {
            if (this.commands[i].type === 'Z' || this.commands[i - 1].type === 'Z') {
                continue;
            }
            const dx = this.commands[i].x - this.commands[i - 1].x;
            const dy = this.commands[i].y - this.commands[i - 1].y;
            const len = Math.hypot(dx, dy);
            this.segmentLengths.push(len);
            this.totalLength += len;
        }

        this.phase = "line";
    }

    step(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const ctx = this.scene.ctx;

        if (this.phase === "line") {
            let outlineProgress = elapsed / this.duration;
            if (outlineProgress > 1 && !this.fill) {
                this.scene.add(this.graphicalObject, true);
                return false;
            }
            if (outlineProgress > 1) {
                this.phase = "fill";
                this.startTime = timestamp;
                outlineProgress = 1;
            }

            drawOutline(ctx, this.commands, this.segmentLengths, this.totalLength, this.easingFunction(outlineProgress), {
                borderColor: this.graphicalObject.borderColor,
                fillColor: this.graphicalObject.fillColor,
                lineWidth: this.graphicalObject.lineWidth
            });
            return true;
        } else if (this.phase === "fill") {
            let fillProgress = (elapsed) / this.fillFadeDuration;
            if (fillProgress > 1) {
                this.scene.add(this.graphicalObject, true);
                return false;
            }

            fadeInFill(ctx, this.commands, fillProgress,
                {
                    borderColor: this.graphicalObject.borderColor,
                    fillColor: this.graphicalObject.fillColor,
                    lineWidth: this.graphicalObject.lineWidth
                });
            return true;
        }
    }
}
