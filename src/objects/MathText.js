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
        this.generateCommands();
    }

    generateCommands() {
        this.commands = convertSvgToCommands(
            this.latex,
            this.fontSize,
            this.getPosition()
        );
        this.setWidth();
        this.setHeight();
    }


    setFontSize(fontSize) {
        this.fontSize = fontSize;
        this.generateCommands();
    }

    getPosition() {
        return { x: this.points[0].x, y: this.points[0].y + this.fontSize };
    }
}