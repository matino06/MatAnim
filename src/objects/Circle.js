import { GraphicalObject } from "../core/GraphicalObject.js"

export class Circle extends GraphicalObject {
    constructor(cx, cy, r, color = "rgb(255, 32, 88)") {
        super();
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        this.color = color;
    }

    getPathSegments() {
        let steps = 100;
        const points = [];
        for (let i = 0; i <= steps; i++) {
            const angle = (i / steps) * 2 * Math.PI;
            points.push({
                x: this.cx + this.r * Math.cos(angle),
                y: this.cy + this.r * Math.sin(angle),
            });
        }
        return points;
    }

    render(ctx) {
        super.render(ctx)
    }
}