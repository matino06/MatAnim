import { GraphicalObject } from "../core/GraphicalObject";
import { theme } from "../theme/theme";

export class SpeechBubble extends GraphicalObject {
    constructor(points, width, height, options = {}) {
        const defaultOptions = {
            borderColor: theme.colors.foreground,
            fillColor: theme.colors.background,
            padding: 16,
            radius: 12,
            pointerSize: 20,
            pointerDirection: "bottom"
        };

        options = { ...defaultOptions, ...options };

        super(points, options);

        this.options = options;
        this.width = width;
        this.height = height;
        this.generateCommands();
    }

    generateCommands() {
        const { padding, radius, pointerSize, pointerDirection } = this.options;

        const width = this.width + padding * 2;
        const height = this.height + padding * 2;

        const start = this.points[0];

        const topLeft = { x: start.x - padding, y: start.y - padding };

        this.commands = [];

        this.commands.push({ type: "M", x: topLeft.x + radius, y: topLeft.y });
        this.commands.push({ type: "L", x: topLeft.x + width - radius, y: topLeft.y });
        this.commands.push({ type: "Q", x1: topLeft.x + width, y1: topLeft.y, x: topLeft.x + width, y: topLeft.y + radius });
        this.commands.push({ type: "L", x: topLeft.x + width, y: topLeft.y + height - radius });
        this.commands.push({ type: "Q", x1: topLeft.x + width, y1: topLeft.y + height, x: topLeft.x + width - radius, y: topLeft.y + height });
        this.commands.push({ type: "L", x: topLeft.x + radius, y: topLeft.y + height });
        this.commands.push({ type: "Q", x1: topLeft.x, y1: topLeft.y + height, x: topLeft.x, y: topLeft.y + height - radius });
        this.commands.push({ type: "L", x: topLeft.x, y: topLeft.y + radius });
        this.commands.push({ type: "Q", x1: topLeft.x, y1: topLeft.y, x: topLeft.x + radius, y: topLeft.y });

        if (pointerDirection === "bottom") {
            const startX = start.x + pointerSize;
            const baseY = topLeft.y + height;

            this.commands.push({ type: "M", x: startX, y: baseY });
            this.commands.push({ type: "L", x: startX - pointerSize, y: baseY + pointerSize });
            this.commands.push({ type: "L", x: startX + pointerSize, y: baseY });
            this.commands.push({ type: "L", x: topLeft.x + width - radius, y: baseY });
        }

        this.commands.push({ type: "Z" });
    }
}
