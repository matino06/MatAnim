import { GraphicalObject } from "../core/GraphicalObject.js";
import { theme } from "../theme/theme.js"

export class Line extends GraphicalObject {
    constructor(points, options = {}) {
        const defaultOptions = {
            borderColor: theme.colors.foreground,
            fillColor: theme.colors.foreground,
        }

        super(points, { ...defaultOptions, ...options });
        this.generateCommands();
    }

    generateCommands() {
        this.commands = [
            { type: 'L', x: this.points[0].x, y: this.points[0].y },
            { type: 'L', x: this.points[1].x, y: this.points[1].y }
        ];
    }
}