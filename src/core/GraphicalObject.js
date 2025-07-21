export class GraphicalObject {
    constructor(points) {
        if (new.target === GraphicalObject) {
            throw new Error("GraphicalObject is abstract and cannot be instantiated directly.");
        }

        this.points = points;
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
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.fill();
    }
}
