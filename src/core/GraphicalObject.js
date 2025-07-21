export class GraphicalObject {
    constructor() {
        if (new.target === GraphicalObject) {
            throw new Error("GraphicalObject is abstract and cannot be instantiated directly.");
        }
    }

    getPathSegments() {
        throw new Error("Method getPathSegments() must be implemented");
    }

    render(ctx) {
        const points = this.getPathSegments();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();
    }
}
