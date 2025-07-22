import { GraphicalObject } from "../core/GraphicalObject.js";
import { theme } from "../theme/theme.js"

export class Line extends GraphicalObject {
    constructor(points, options = {}) {
        const defaultOptions = {
            borderColor: theme.colors.foreground,
            fillColor: theme.colors.foreground,
            lineWidth: theme.lineWidth
        }

        super(points, { ...defaultOptions, ...options });
    }

    getPathSegments() {
        return [
            { type: 'L', x: this.points[0].x, y: this.points[0].y },
            { type: 'L', x: this.points[1].x, y: this.points[1].y }
        ]
    }

    translate(delta) {
        super.translate(delta);
    }

    render(ctx) {
        super.render(ctx);
    }
}