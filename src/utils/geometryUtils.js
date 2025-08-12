export function getBezierPoints(point0, point1, step = 0.01) {
    const points = [];
    for (let t = 0; t <= 1; t += step) {
        const point = {
            x: point0.x + t * (point1.x - point0.x),
            y: point0.y + t * (point1.y - point0.y)
        }

        points.push(point);
    }
    return points;
}

export function getQuadraticBezierPoints(p0, p1, p2, step = 0.01) {
    const points = [];
    for (let t = 0; t <= 1; t += step) {
        const x = (1 - t) ** 2 * p0.x +
            2 * (1 - t) * t * p1.x +
            t ** 2 * p2.x;
        const y = (1 - t) ** 2 * p0.y +
            2 * (1 - t) * t * p1.y +
            t ** 2 * p2.y;
        points.push({ x, y });
    }
    return points;
}

export function getCubicBezierPoints(p0, p1, p2, p3, step = 0.01) {
    const points = [];
    for (let t = 0; t <= 1; t += step) {
        const x =
            (1 - t) ** 3 * p0.x +
            3 * (1 - t) ** 2 * t * p1.x +
            3 * (1 - t) * t ** 2 * p2.x +
            t ** 3 * p3.x;

        const y =
            (1 - t) ** 3 * p0.y +
            3 * (1 - t) ** 2 * t * p1.y +
            3 * (1 - t) * t ** 2 * p2.y +
            t ** 3 * p3.y;

        points.push({ x, y });
    }
    return points;
}

export function getQuarticBezierPoints(p0, p1, p2, p3, p4, step = 0.01) {
    const points = [];
    for (let t = 0; t <= 1; t += step) {
        const x =
            (1 - t) ** 4 * p0.x +
            4 * (1 - t) ** 3 * t * p1.x +
            6 * (1 - t) ** 2 * t ** 2 * p2.x +
            4 * (1 - t) * t ** 3 * p3.x +
            t ** 4 * p4.x;

        const y =
            (1 - t) ** 4 * p0.y +
            4 * (1 - t) ** 3 * t * p1.y +
            6 * (1 - t) ** 2 * t ** 2 * p2.y +
            4 * (1 - t) * t ** 3 * p3.y +
            t ** 4 * p4.y;

        points.push({ x, y });
    }
    return points;
}

