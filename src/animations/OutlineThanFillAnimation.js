import { Animation } from "../core/Animation.js"
import { drawOutline, fadeInFill } from "../utils/animationUtils.js";

export class OutlineThanFillAnimation extends Animation {
    constructor(graphicalObject, options = {}) {
        const outlineDefaults = {
            fillFadeDuration: 1000,
            toTop: true,
        };

        super(graphicalObject, options);
        this.options = { ...outlineDefaults, ...this.options };
        this.animationsTypeForComposit = true;

        if (!graphicalObject.getCommands()) {
            return;
        }

        this.fill = graphicalObject.fill;
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
            let outlineProgress = elapsed / this.options.duration;
            if (outlineProgress > 1 && !this.fill) {
                this.scene.add(this.graphicalObject, { toTop: this.options.toTop });
                return false;
            }
            if (outlineProgress > 1) {
                this.phase = "fill";
                this.startTime = timestamp;
                outlineProgress = 1;
            }

            const outlineProgresWithEasingFunction = this.options.easingFunction(outlineProgress);

            if (!this.options.toTop) {
                ctx.globalCompositeOperation = 'destination-over';
            }

            drawOutline(
                ctx,
                this.commands,
                this.segmentLengths,
                this.totalLength,
                outlineProgresWithEasingFunction,
                {
                    borderColor: this.graphicalObject.borderColor,
                    fillColor: this.graphicalObject.fillColor,
                    lineWidth: this.graphicalObject.lineWidth
                }
            );

            if (!this.options.toTop) {
                ctx.globalCompositeOperation = 'source-over';
            }

            return true;
        } else if (this.phase === "fill") {
            let fillProgress = elapsed / this.options.fillFadeDuration;
            if (fillProgress > 1) {
                this.scene.add(this.graphicalObject, { toTop: this.options.toTop });
                return false;
            }

            const fillProgresWithEasingFunction = this.options.easingFunction(fillProgress);

            if (!this.options.toTop) {
                ctx.globalCompositeOperation = 'destination-over';
            }

            fadeInFill(
                ctx,
                this.commands,
                fillProgresWithEasingFunction,
                {
                    borderColor: this.graphicalObject.borderColor,
                    fillColor: this.graphicalObject.fillColor,
                    lineWidth: this.graphicalObject.lineWidth
                }
            );

            if (!this.options.toTop) {
                ctx.globalCompositeOperation = 'source-over';
            }

            return true;
        }
    }
}