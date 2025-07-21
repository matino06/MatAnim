import { rgbToRgba } from "../core/utils.js";

export function drawOutline(ctx, points, segmentLengths, totalLength, outlineProgress, color, lineWidth = 2) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    let remaining = totalLength * outlineProgress;
    for (let i = 1; i < points.length; i++) {
        if (remaining <= segmentLengths[i - 1]) {
            const ratio = remaining / segmentLengths[i - 1];
            const x = points[i - 1].x + (points[i].x - points[i - 1].x) * ratio;
            const y = points[i - 1].y + (points[i].y - points[i - 1].y) * ratio;
            ctx.lineTo(x, y);
            break;
        } else {
            ctx.lineTo(points[i].x, points[i].y);
            remaining -= segmentLengths[i - 1];
        }
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

export function fadeInFill(ctx, points, fillProgress, color) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.fillStyle = rgbToRgba(color, fillProgress);
    ctx.fill();
}
