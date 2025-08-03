import { Animation } from "../core/Animation.js"
import { drawOutline, fadeInFill } from "../utils/animationUtils.js";

export class OutlineThanFillAnimation extends Animation {
    constructor(scene, graphicalObject, duration = 500, fillFadeDuration = 500) {
        super(scene, graphicalObject, duration)

        if (!graphicalObject.getCommands()) {
            return;
        }

        this.fillFadeDuration = fillFadeDuration;

        this.points = graphicalObject.getCommands();
        this.totalLength = 0;
        this.segmentLengths = [];
        for (let i = 1; i < this.points.length; i++) {
            if (this.points[i].type === 'Z' || this.points[i - 1].type === 'Z') {
                continue;
            }
            const dx = this.points[i].x - this.points[i - 1].x;
            const dy = this.points[i].y - this.points[i - 1].y;
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
            if (outlineProgress > 1) {
                this.phase = "fill";
                this.startTime = timestamp;
                outlineProgress = 1;
            }

            drawOutline(ctx, this.points, this.segmentLengths, this.totalLength, outlineProgress, {
                borderColor: this.graphicalObject.borderColor,
                fillColor: this.graphicalObject.fillColor,
                lineWidth: this.graphicalObject.lineWidth
            });
            return true;
        } else if (this.phase === "fill") {
            let fillProgress = (elapsed) / this.fillFadeDuration;
            if (fillProgress > 1) {
                this.scene.add(this.graphicalObject, false);
                return false;
            }

            fadeInFill(ctx, this.points, fillProgress, {
                borderColor: this.graphicalObject.borderColor,
                fillColor: this.graphicalObject.fillColor,
                lineWidth: this.graphicalObject.lineWidth
            });
            return true;
        }
    }
}
