import { rgbToRgba } from "./utils.js";

export function animateCreate(scene, object, duration = 500, fillFadeDuration = 500) {
    const points = object.getPathSegments();
    const ctx = scene.ctx;

    // Calculate the length of the path
    let totalLength = 0;
    const segmentLengths = [];
    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        const len = Math.hypot(dx, dy);
        segmentLengths.push(len);
        totalLength += len;
    }

    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        let progress = elapsed / duration;
        if (progress > 1) progress = 1;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        scene.draw();

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        let remaining = totalLength * progress;
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

        ctx.strokeStyle = object.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            fadeInFill();
        }
    }

    function fadeInFill() {
        let fadeStart = null;

        function fadeStep(timestamp) {
            if (!fadeStart) fadeStart = timestamp;
            const elapsed = timestamp - fadeStart;
            let fadeProgress = elapsed / fillFadeDuration;
            if (fadeProgress > 1) fadeProgress = 1;

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            scene.draw();

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);

            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }

            ctx.strokeStyle = object.color;
            ctx.fillStyle = rgbToRgba(object.color, fadeProgress);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fill();

            if (fadeProgress < 1) {
                requestAnimationFrame(fadeStep);
            } else {
                scene.add(object);
                scene.draw();
            }
        }

        requestAnimationFrame(fadeStep);
    }

    requestAnimationFrame(step);
}
