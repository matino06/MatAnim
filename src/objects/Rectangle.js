import { GraphicalObject } from "../core/GraphicalObject.js"

export class Rectangle extends GraphicalObject {
    constructor(points, width, height, options = {}) {
        super(points, options);
        this.width = width;
        this.height = height;
    }

    getPathSegments() {
        const point = this.points[0];
        return [
            { x: point.x, y: point.y },
            { x: point.x + this.width, y: point.y },
            { x: point.x + this.width, y: point.y + this.height },
            { x: point.x, y: point.y + this.height },
            { x: point.x, y: point.y }
        ];
    }

    translate(delta) {
        super.translate(delta);
    }

    render(ctx) {
        super.render(ctx);
    }
}