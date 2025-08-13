import { GraphicalObject } from "../core/GraphicalObject.js"

export class Circle extends GraphicalObject {
    constructor(points, r, options = {}) {
        super(points, options);
        this.r = r;
        this.generateCommands();
    }

    generateCommands() {
        let steps = 100;
        const point = this.points[0];
        const commands = [];
        for (let i = 0; i <= steps; i++) {
            const angle = (i / steps) * 2 * Math.PI;
            commands.push({
                type: 'L',
                x: point.x + this.r * Math.cos(angle),
                y: point.y + this.r * Math.sin(angle),
            });
        }
        this.commands = commands;
    }

    getCenter() {
        return this.points[0];
    }
}