import { theme } from "../theme/theme.js"
import { applyPathCommand } from "../utils/graphicalUtils.js";

export class GraphicalObject {
    constructor(points, {
        lineWidth = theme.lineWidth,
        borderColor = theme.colors.primary,
        fillColor = theme.colors.primary
    } = {}) {
        if (new.target === GraphicalObject) {
            throw new Error("GraphicalObject is abstract and cannot be instantiated directly.");
        }

        this.points = points;
        this.lineWidth = lineWidth;
        this.borderColor = borderColor;
        this.fillColor = fillColor;
    }

    getCommands() {
        return this.commands;
    }

    translate(delta) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].x += delta.x;
            this.points[i].y += delta.y;
        }
        this.commands = this.generateCommands();
    }

    scale(a, b) {

    }

    render(ctx) {
        const points = this.getCommands();
        if (points.length === 0) return;

        // Inicijaliziraj stanje
        const state = {
            currentX: 0,
            currentY: 0,
            prevControl: null
        };

        ctx.beginPath();

        for (let i = 0; i < points.length; i++) {
            const command = points[i];

            // First command has to be moveTo
            if (i === 0 && command.type !== 'M') {
                ctx.moveTo(command.x || 0, command.y || 0);
                state.currentX = command.x || 0;
                state.currentY = command.y || 0;
            } else {
                applyPathCommand(command, ctx, state);
            }
        }

        ctx.strokeStyle = this.borderColor;
        ctx.fillStyle = this.fillColor;
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
        ctx.fill();
    }
}