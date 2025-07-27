import { theme } from "../theme/theme.js"
import { applyPathCommand } from "../utils/graphicalUtils.js";
import { transformCommands } from "../utils/svgUtils.js";

export class GraphicalObject {
    constructor(points, {
        lineWidth = theme.lineWidth,
        borderColor = theme.colors.primary,
        fillColor = theme.colors.primary
    } = {}) {
        if (new.target === GraphicalObject) {
            throw new Error("GraphicalObject is abstract and cannot be instantiated directly.");
        }

        this.listeners = [];
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
        this.notifyListeners();
    }

    scale(a, b) {
        const scaledCommands = transformCommands(this.getCommands(), [{ transformType: 'scale', a, b }]);
        this.commands = scaledCommands;
        this.notifyListeners();
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => {
            listener.graphicalObjestChanged();
        });
    }

    render(ctx) {
        const points = this.getCommands();
        if (points.length === 0) return;

        // Initialize stanje
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