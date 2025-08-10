import { GraphicalObject } from "../core/GraphicalObject";

export class Vector extends GraphicalObject {
    constructor(points, options = {}) {
        const defaultOptions = {
            lineWidth: 2,
            arrowheadSize: 20,
            arrowheadAngle: 30,
            vectorBodyWidth: 2
        };

        options = { ...defaultOptions, ...options };

        super(points, options);

        this.options = options;

        this.start = this.points[0];
        this.end = this.points[1];
        this.arrowheadSize = options.arrowheadSize;
        this.arrowheadAngle = options.arrowheadAngle * (Math.PI / 180); // Convert to radians

        this.commands = this.generateCommands();
    }

    generateCommands() {
        const commands = [];

        const angle = Math.atan2(this.end.y - this.start.y, this.end.x - this.start.x);
        const vectorBodyWidth = this.options.vectorBodyWidth;

        // Calculate arrowhead points
        const arrowPoint1 = {
            x: this.end.x - this.arrowheadSize * Math.cos(angle - this.arrowheadAngle),
            y: this.end.y - this.arrowheadSize * Math.sin(angle - this.arrowheadAngle)
        };
        const arrowPoint2 = {
            x: this.end.x - this.arrowheadSize * Math.cos(angle + this.arrowheadAngle),
            y: this.end.y - this.arrowheadSize * Math.sin(angle + this.arrowheadAngle)
        };
        const arrowPointMid = {
            x: (arrowPoint1.x + arrowPoint2.x) / 2,
            y: (arrowPoint1.y + arrowPoint2.y) / 2
        };

        const dx = arrowPoint2.x - arrowPoint1.x;
        const dy = arrowPoint2.y - arrowPoint1.y;

        const length = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / length;
        const uy = dy / length;

        const arrowPointMidRight = {
            x: arrowPointMid.x + ux * vectorBodyWidth,
            y: arrowPointMid.y + uy * vectorBodyWidth
        };
        const arrowPointMidLeft = {
            x: arrowPointMid.x - ux * vectorBodyWidth,
            y: arrowPointMid.y - uy * vectorBodyWidth
        };
        const startPointRight = {
            x: this.start.x + ux * vectorBodyWidth,
            y: this.start.y + uy * vectorBodyWidth
        };
        const startPointLeft = {
            x: this.start.x - ux * vectorBodyWidth,
            y: this.start.y - uy * vectorBodyWidth
        };


        // Draw arrowhead
        commands.push({ type: "M", x: this.end.x, y: this.end.y });
        commands.push({ type: "L", x: arrowPoint1.x, y: arrowPoint1.y });
        commands.push({ type: "L", x: arrowPointMidLeft.x, y: arrowPointMidLeft.y });
        commands.push({ type: "L", x: startPointLeft.x, y: startPointLeft.y });
        commands.push({ type: "L", x: startPointRight.x, y: startPointRight.y });
        commands.push({ type: "L", x: arrowPointMidRight.x, y: arrowPointMidRight.y });
        commands.push({ type: "L", x: arrowPoint2.x, y: arrowPoint2.y });
        commands.push({ type: "L", x: this.end.x, y: this.end.y });

        return commands;
    }
}