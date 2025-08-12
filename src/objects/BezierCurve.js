import { GraphicalObject } from "../core/GraphicalObject";
import { getBezierPoints } from "../utils/geometryUtils";

export class BezierCurve extends GraphicalObject {
    constructor(points, options = {}) {
        super(points, options);

        this.generateCommands();
    }

    generateCommands() {
        this.commands = [];
        const bezierPoints = getBezierPoints(this.points);
        for (let index = 0; index < bezierPoints.length; index++) {
            const point = bezierPoints[index];
            this.commands.push({ type: 'L', x: point.x, y: point.y });
        }

        if (this.fill) {
            this.commands.push({ type: 'Z' });
        }
    }
}