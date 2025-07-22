import { rgbToRgba } from "../core/utils.js";
import { applyPathCommand } from "../utils/graphicalUtils.js";


export function drawOutline(ctx, points, segmentLengths, totalLength, outlineProgress, { borderColor, fillColor, lineWidth }) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    let remaining = totalLength * outlineProgress;
    for (let i = 1; i < points.length; i++) {
        if (remaining <= segmentLengths[i - 1]) {
            const ratio = remaining / segmentLengths[i - 1];
            const x = points[i - 1].x + (points[i].x - points[i - 1].x) * ratio;
            const y = points[i - 1].y + (points[i].y - points[i - 1].y) * ratio;
            const { type, ...rest } = points[i];
            const point = { ...rest, x, y, type };

            applyPathCommand(point, ctx)
            break;
        } else {
            applyPathCommand(points[i], ctx)
            remaining -= segmentLengths[i - 1];
        }
    }

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

export function fadeInFill(ctx, points, fillProgress, { borderColor, fillColor, lineWidth }) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        applyPathCommand(points[i], ctx)
    }

    ctx.strokeStyle = borderColor;
    ctx.fillStyle = rgbToRgba(fillColor, fillProgress);;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.fill();
}
