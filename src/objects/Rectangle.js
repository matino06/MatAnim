import { GraphicalObject } from "../core/GraphicalObject.js"

export class Rectangle extends GraphicalObject {
    constructor(points, width, height, options = {}) {
        super(points, options);
        this.width = width;
        this.height = height;
        this.generateCommands();
    }

    generateCommands() {
        const center = this.points[0];
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        const topLeft = {
            x: center.x - halfWidth,
            y: center.y - halfHeight
        };

        this.commands = [
            { type: 'L', x: topLeft.x, y: topLeft.y },
            { type: 'L', x: topLeft.x + this.width, y: topLeft.y },
            { type: 'L', x: topLeft.x + this.width, y: topLeft.y + this.height },
            { type: 'L', x: topLeft.x, y: topLeft.y + this.height },
            { type: 'L', x: topLeft.x, y: topLeft.y }
        ];
    }
}