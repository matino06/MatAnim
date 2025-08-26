import { Animation } from "../core/Animation.js";
import Color from "color";

export class FadeOutAnimation extends Animation {
    constructor(graphicalObject, options = {}) {
        super(graphicalObject, options);

        this.animationsTypeForComposit = true;

        this.borderColor = graphicalObject.borderColor;
        this.borderOpacity = Color(this.borderColor).alpha();
        this.fillColor = graphicalObject.fillColor;
        this.fillOpacity = Color(this.fillColor).alpha();
    }

    step(timestamp) {
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const progress = Math.min(1, elapsed / this.options.duration);

        const easedProgress = this.options.easingFunction(1 - progress);

        this.graphicalObject.borderColor = Color(this.borderColor).alpha(this.borderOpacity * (easedProgress)).string();
        if (this.graphicalObject.fill) {
            this.graphicalObject.fillColor = Color(this.fillColor).alpha(this.fillOpacity * (easedProgress)).string();
        }

        if (progress >= 1) {
            this.scene.remove(this.graphicalObject);
            return false;
        } else {
            return true;
        }
    }
}
