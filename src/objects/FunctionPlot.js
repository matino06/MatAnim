import { GraphicalObject } from "../core/GraphicalObject";
import { theme } from "../theme/theme";

export class FunctionPlot extends GraphicalObject {
    constructor(coordinateSystem, func, options = {}) {
        const defaultOptions = {
            borderColor: theme.colors.secondary,
            lineWidth: 3,
            step: 0.01,
            dashed: false,
            dashLength: 17,
            gapLength: 6
        }

        options = { ...defaultOptions, ...options };

        super([], options);
        this.fill = false;

        this.coordinateSystem = coordinateSystem;
        this.func = func;
        this.step = options.step;
        this.dashed = options.dashed;
        this.dashLength = options.dashLength;
        this.gapLength = options.gapLength;
        this.commands = this.generateCommands();
    }

    getCenter() {
        return this.coordinateSystem.pointToCoords(0, 0);
    }

    generateCommands() {
        const commands = [];
        const points = [];
        const [xMin, xMax] = this.coordinateSystem.xRange;

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
                continue;
            }

            const point = this.coordinateSystem.pointToCoords(x, y);
            if (point !== undefined) {
                points.push(point);
            }
            x += this.step;
        }

        if (points.length < 2) {
            return commands;
        }

        if (!this.dashed) {
            commands.push({ type: "M", x: points[0].x, y: points[0].y });
            for (let i = 1; i < points.length; i++) {
                commands.push({ type: "L", x: points[i].x, y: points[i].y });
            }
            return commands;
        }

        let isDrawingDash = true;
        let prevPoint = points[0];
        let segmentLength = 0;

        commands.push({ type: "M", x: prevPoint.x, y: prevPoint.y });

        for (let i = 1; i < points.length; i++) {
            const currentPoint = points[i];
            segmentLength += Math.hypot(currentPoint.x - prevPoint.x, currentPoint.y - prevPoint.y);

            if (isDrawingDash && segmentLength > this.dashLength) {
                isDrawingDash = false;
                segmentLength = 0;
                commands.push({ type: "M", x: currentPoint.x, y: currentPoint.y });
            } else if (!isDrawingDash && segmentLength >= this.gapLength) {
                isDrawingDash = true;
                segmentLength = 0;
                commands.push({ type: "M", x: currentPoint.x, y: currentPoint.y });
            } else if (!isDrawingDash) {
                commands.pop();
                commands.push({ type: "M", x: currentPoint.x, y: currentPoint.y });
            } else {
                commands.push({ type: "L", x: currentPoint.x, y: currentPoint.y });
            }
            prevPoint = currentPoint;
        }

        return commands;
    }
}