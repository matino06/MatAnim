import { rgbToRgba } from "../core/utils.js";
import { applyPathCommand } from "../utils/graphicalUtils.js";

/** 
 * Draws a partial outline of a path based on the given progress.
 *
 * This function progressively renders a stroked path by traversing through
 * the provided command list, stopping when the accumulated length reaches
 * the specified outlineProgress (0 to 1).
 */
export function drawOutline(ctx, commands, segmentLengths, totalLength, outlineProgress, { borderColor, lineWidth }) {
    const state = {
        currentX: commands[0].x || 0,
        currentY: commands[0].y || 0,
        prevControl: null
    };

    ctx.beginPath();
    ctx.moveTo(commands[0].x, commands[0].y);

    let remaining = totalLength * outlineProgress;
    for (let i = 1; i < commands.length; i++) {
        if (remaining <= segmentLengths[i - 1]) {
            const ratio = remaining / segmentLengths[i - 1];
            const x = commands[i - 1].x + (commands[i].x - commands[i - 1].x) * ratio;
            const y = commands[i - 1].y + (commands[i].y - commands[i - 1].y) * ratio;
            const { type, ...rest } = commands[i];
            const point = { ...rest, x, y, type };
            applyPathCommand(point, ctx, state)
            break;
        } else {
            applyPathCommand(commands[i], ctx, state)
            remaining -= segmentLengths[i - 1];
        }
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

export function fadeInFill(ctx, commands, fillProgress, { borderColor, fillColor, lineWidth }) {
    const state = {
        currentX: commands[0].x || 0,
        currentY: commands[0].y || 0,
        prevControl: null
    };

    ctx.beginPath();
    ctx.moveTo(commands[0].x, commands[0].y);

    for (let i = 1; i < commands.length; i++) {
        applyPathCommand(commands[i], ctx, state)
    }

    ctx.strokeStyle = borderColor;
    ctx.fillStyle = rgbToRgba(fillColor, fillProgress);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.fill();
}
