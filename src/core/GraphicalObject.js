import { theme } from "../theme/theme.js"
import { applyPathCommand } from "../utils/graphicalUtils.js";

export class GraphicalObject {
    constructor(points, { lineWidth = theme.lineWidth, color = theme.colors.primary } = {}) {
        if (new.target === GraphicalObject) {
            throw new Error("GraphicalObject is abstract and cannot be instantiated directly.");
        }

        this.points = points;
        this.lineWidth = lineWidth;
        this.color = color;
    }

    getPathSegments() {
        throw new Error("Method getPathSegments() must be implemented");
    }

    translate(delta) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].x += delta.x;
            this.points[i].y += delta.y;
        }
    }

    render(ctx) {
        const points = this.getPathSegments();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            applyPathCommand(points[i], ctx);
        }

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.fill();
    }
}