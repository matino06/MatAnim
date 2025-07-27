import { GraphicalObject } from "../core/GraphicalObject.js"

export class Rectangle extends GraphicalObject {
    constructor(points, width, height, options = {}) {
        super(points, options);
        this.width = width;
        this.height = height;
        this.commands = this.generateCommands();
    }

    generateCommands() {
        const point = this.points[0];
        return [
            { type: 'L', x: point.x, y: point.y },
            { type: 'L', x: point.x + this.width, y: point.y },
            { type: 'L', x: point.x + this.width, y: point.y + this.height },
            { type: 'L', x: point.x, y: point.y + this.height },
            { type: 'L', x: point.x, y: point.y }
        ];
    }
}