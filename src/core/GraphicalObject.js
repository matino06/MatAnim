import { theme } from "../theme/theme.js"
import { applyPathCommand } from "../utils/graphicalUtils.js";
import { transformCommands } from "../utils/svgUtils.js";

export class GraphicalObject {
    constructor(points, {
        lineWidth = theme.lineWidth,
        color = null,
        borderColor = theme.colors.primary,
        fill = true,
        fillColor = theme.colors.primary,
    } = {}) {
        if (new.target === GraphicalObject) {
            throw new Error("GraphicalObject is abstract and cannot be instantiated directly.");
        }

        this.listeners = [];
        this.points = points;
        this.lineWidth = lineWidth;
        this.borderColor = borderColor;
        this.fill = fill;
        this.fillColor = fillColor;

        if (color) {
            this.borderColor = color;
            this.fillColor = color;
        }

        // Track scalling;
        this.lastXScale = 1;
        this.lastYScale = 1;
    }

    getCommands() {
        return this.commands;
    }

    getBoundingBox() {
        if (!this.commands || this.commands.length === 0) {
            return null;
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const cmd of this.commands) {
            ['x', 'x1', 'x2'].forEach(prop => {
                if (cmd[prop] !== null && cmd[prop] !== undefined) {
                    minX = Math.min(minX, cmd[prop]);
                    maxX = Math.max(maxX, cmd[prop]);
                }
            });

            ['y', 'y1', 'y2'].forEach(prop => {
                if (cmd[prop] !== null && cmd[prop] !== undefined) {
                    minY = Math.min(minY, cmd[prop]);
                    maxY = Math.max(maxY, cmd[prop]);
                }
            });
        }

        if (minX === Infinity || minY === Infinity) {
            return null;
        }

        return {
            minX,
            minY,
            maxX,
            maxY,
            width: maxX - minX,
            height: maxY - minY,
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2
        };
    }

    getCenter() {
        const bbox = this.getBoundingBox();
        return bbox ? {
            x: bbox.centerX,
            y: bbox.centerY
        } : { x: 0, y: 0 };
    }

    setWidth() {
        const commands = this.getCommands();
        if (!commands || commands.length === 0) {
            this.width = 0;
            return;
        }

        let minX = Infinity;
        let maxX = -Infinity;

        for (const cmd of commands) {
            if ('x' in cmd) {
                minX = Math.min(minX, cmd.x);
                maxX = Math.max(maxX, cmd.x);
            }

            if (cmd.x1 !== undefined) {
                minX = Math.min(minX, cmd.x1);
                maxX = Math.max(maxX, cmd.x1);
            }
            if (cmd.x2 !== undefined) {
                minX = Math.min(minX, cmd.x2);
                maxX = Math.max(maxX, cmd.x2);
            }
        }

        this.width = maxX - minX;
    }

    setHeight() {
        const commands = this.getCommands();
        if (!commands || commands.length === 0) {
            this.height = 0;
            return;
        }

        let minY = Infinity;
        let maxY = -Infinity;

        for (const cmd of commands) {
            if ('y' in cmd) {
                minY = Math.min(minY, cmd.y);
                maxY = Math.max(maxY, cmd.y);
            }

            if (cmd.y1 !== undefined) {
                minY = Math.min(minY, cmd.y1);
                maxY = Math.max(maxY, cmd.y1);
            }
            if (cmd.y2 !== undefined) {
                minY = Math.min(minY, cmd.y2);
                maxY = Math.max(maxY, cmd.y2);
            }
        }

        this.height = maxY - minY;
    }

    translate(delta) {
        const transformedCommands = transformCommands(
            this.commands, [{ transformType: 'translate', a: delta.x, b: delta.y }]
        );
        this.commands = transformedCommands;

        this.notifyListeners();
    }

    scale(xScale = this.lastXScale, yScale = this.lastYScale, pivot = this.getCenter()) {
        if (xScale === this.lastXScale && yScale === this.lastYScale) {
            return;
        }

        const finalXScale = xScale / this.lastXScale;
        const finalYScale = yScale / this.lastYScale;

        const scaledCommands = transformCommands(
            this.commands, [{ transformType: 'scale', a: finalXScale, b: finalYScale, pivot: pivot }]
        );

        this.commands = scaledCommands;

        this.notifyListeners();

        this.lastXScale = xScale;
        this.lastYScale = yScale;
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

        // Initialize state
        const state = {
            currentX: 0,
            currentY: 0,
            prevControl: null
        };

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

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
        if (this.fill) {
            ctx.fill();
        }
    }
}