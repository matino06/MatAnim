import { GraphicalObject } from "../core/GraphicalObject";
import { getBezierPoints } from "../utils/geometryUtils";

export class BezierCurve extends GraphicalObject {
    constructor(points, options = {}) {
        super(points, options);

        this.generateCommands();
    }

    generateCommands() {
        this.commands = [];
        this.bezierPoints = getBezierPoints(this.points);
        for (let index = 0; index < this.bezierPoints.length; index++) {
            const point = this.bezierPoints[index];
            this.commands.push({ type: 'L', x: point.x, y: point.y });
        }

        if (this.fill) {
            this.commands.push({ type: 'Z' });
        }
    }
}