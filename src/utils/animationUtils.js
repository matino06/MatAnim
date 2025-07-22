import { rgbToRgba } from "../core/utils.js";
import { applyPathCommand } from "../utils/graphicalUtils.js";


export function drawOutline(ctx, points, segmentLengths, totalLength, outlineProgress, { color, lineWidth }) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    let remaining = totalLength * outlineProgress;
    for (let i = 1; i < points.length; i++) {
        if (remaining <= segmentLengths[i - 1]) {
            const ratio = remaining / segmentLengths[i - 1];
            const x = points[i - 1].x + (points[i].x - points[i - 1].x) * ratio;
            const y = points[i - 1].y + (points[i].y - points[i - 1].y) * ratio;
            const { type, ...rest } = points[i];
            const point = { x, y, type, ...rest };

            applyPathCommand(point, ctx)
            break;
        } else {
            applyPathCommand(points[i], ctx)
            remaining -= segmentLengths[i - 1];
        }
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

export function fadeInFill(ctx, points, fillProgress, { color, lineWidth }) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        applyPathCommand(points[i], ctx)
    }

    ctx.strokeStyle = color;
    ctx.fillStyle = rgbToRgba(color, fillProgress);;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.fill();
}
