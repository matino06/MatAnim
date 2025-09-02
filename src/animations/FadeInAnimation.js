import { Animation } from "../core/Animation.js";
import Color from "color";

export class FadeInAnimation extends Animation {
    constructor(graphicalObject, options = {}) {
        super(graphicalObject, options);

        this.animationsTypeForComposit = true;

        this.borderColor = graphicalObject.borderColor;
        this.borderOpacity = Color(this.borderColor).alpha();
        this.fillColor = graphicalObject.fillColor;
        this.fillOpacity = Color(this.fillColor).alpha();

        this.graphicalObject.borderColor = Color(this.borderColor).alpha(0).string();
        if (this.graphicalObject.fill) {
            this.graphicalObject.fillColor = Color(this.fillColor).alpha(0).string();
        }

        this.added = false;
    }

    step(timestamp) {
        if (!this.added) {
            this.added = true;
            this.scene.add(this.graphicalObject, { toTop: this.options.toTop });
        }
        if (!this.startTime) this.startTime = timestamp;
        const elapsed = timestamp - this.startTime;
        const progress = Math.min(1, elapsed / this.options.duration);

        const easedProgress = this.options.easingFunction(progress);

        this.graphicalObject.borderColor = Color(this.borderColor).alpha(this.borderOpacity * (easedProgress)).string();
        if (this.graphicalObject.fill) {
            this.graphicalObject.fillColor = Color(this.fillColor).alpha(this.fillOpacity * (easedProgress)).string();
        }

        if (progress >= 1) {
            this.graphicalObject.borderColor = Color(this.borderColor).alpha(this.borderOpacity).string();
            console.log(this.graphicalObject.borderColor)
            if (this.graphicalObject.fill) {
                this.graphicalObject.fillColor = Color(this.fillColor).alpha(this.fillOpacity).string();
            }
            return false;
        } else {
            return true;
        }
    }
}
