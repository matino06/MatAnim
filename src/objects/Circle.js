import { GraphicalObject } from "../core/GraphicalObject.js"

export class Circle extends GraphicalObject {
    constructor(points, r, options = {}) {
        super(points, options);
        this.r = r;
        this.commands = this.generateCommands();
    }

    generateCommands() {
        let steps = 100;
        const point = this.points[0];
        const points = [];
        for (let i = 0; i <= steps; i++) {
            const angle = (i / steps) * 2 * Math.PI;
            points.push({
                type: 'L',
                x: point.x + this.r * Math.cos(angle),
                y: point.y + this.r * Math.sin(angle),
            });
        }
        return points;
    }

    getCommands() {
        return super.getCommands();
    }

    translate(delta) {
        super.translate(delta);
    }

    render(ctx) {
        super.render(ctx)
    }
}