import { GraphicalObject } from "../core/GraphicalObject.js";

export class Line extends GraphicalObject {
    constructor(points, { lineWidth = 2, color = "rgb(255, 32, 88)" } = {}) {
        super(points);
        this.lineWidth = lineWidth;
        this.color = color;
    }

    getPathSegments() {
        return [
            { x: this.points[0].x, y: this.points[0].y },
            { x: this.points[1].x, y: this.points[1].y }
        ]
    }

    translate(delta) {
        super.translate(delta);
    }

    render(ctx) {
        super.render(ctx);
    }
}