import { GraphicalObject } from "../core/GraphicalObject";
import { theme } from "../theme/theme";

export class FunctionPlot extends GraphicalObject {
    constructor(coordinateSystem, func, options = {}) {
        const defaultOptions = {
            lineWidth: 2,
            step: 0.1,
        }

        options = { ...defaultOptions, ...options };

        super([], options);
        this.fill = false;

        this.coordinateSystem = coordinateSystem;
        this.func = func;
        this.step = options.step;
        this.commands = this.generateCommands();
    }

    generateCommands() {
        const commands = [];
        const points = [];
        const [xMin, xMax] = this.coordinateSystem.xRange;
        let lastPointDefined = false;

        let x = xMin;
        while (x <= xMax) {
            let y;

            try {
                y = this.func(x);
            } catch (e) {
                y = undefined;
            }

            if (typeof y !== "number" || isNaN(y)) {
                x += this.step;
                lastPointDefined = false;
                continue;
            }

            const point = this.coordinateSystem.pointToCoords(x, y);
            if (point === undefined) {
                x += this.step;
                lastPointDefined = false;
                continue
            }
            points.push(point);

            if (!lastPointDefined) {
                commands.push({ type: "M", x: point.x, y: point.y });
                lastPointDefined = true;
            } else {
                commands.push({ type: "L", x: point.x, y: point.y });
            }

            x += this.step;
        }

        return commands;
    }
}