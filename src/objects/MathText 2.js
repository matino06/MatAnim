import { GraphicalObject } from "../core/GraphicalObject";
import { convertSvgToCommands } from "../utils/svgUtils";

export class MathText extends GraphicalObject {
    constructor(points, latex, options = {}) {
        const defaultOptions = {
            lineWidth: 0.5,
            fontSize: 16
        };

        super(points, { ...defaultOptions, ...options });
        this.latex = latex;
        this.fontSize = options.fontSize || defaultOptions.fontSize;
        this.commands = this.generateCommands();
    }

    generateCommands() {
        return convertSvgToCommands(
            this.latex,
            this.fontSize,
            this.getPosition()
        );
    }

    getCommands() {
        return super.getCommands();
    }

    getPosition() {
        return { x: this.points[0].x, y: this.points[0].y + this.fontSize };
    }

    translate(delta) {
        super.translate(delta);
    }

    render(ctx) {
        super.render(ctx);
    }
}