import { Animation } from "../core/Animation.js"
import { drawOutline, fadeInFill } from "./animationUtils.js";

export class OutlineThanFillAnimation extends Animation {
    constructor(scene, graphicalObject, duration = 500, fillFadeDuration = 500) {
        super(scene, graphicalObject, duration)

        this.fillFadeDuration = fillFadeDuration;

        this.points = graphicalObject.getPathSegments();
        this.totalLength = 0;
        this.segmentLengths = [];
        for (let i = 1; i < this.points.length; i++) {
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

        if (this.phase === "line") {
            let outlineProgress = elapsed / this.duration;
            if (outlineProgress > 1) {
                this.phase = "fill";
                this.startTime = timestamp;
            }

            drawOutline(this.ctx, this.points, this.segmentLengths, this.totalLength, outlineProgress, this.graphicalObject.color);
            return true;
        } else if (this.phase === "fill") {
            let fillProgress = (elapsed) / this.fillFadeDuration;
            if (fillProgress > 1) {
                this.scene.add(this.object);
                return false;
            }

            fadeInFill(this.ctx, this.points, fillProgress, this.graphicalObject.color);
            return true;
        }
    }
}
