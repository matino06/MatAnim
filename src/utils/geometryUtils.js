function binomialCoefficient(n, k) {
    let res = 1;
    for (let i = 0; i < k; i++) {
        res *= (n - i) / (i + 1);
    }
    return res;
}

export function getBezierPoints(points, step = 0.01) {
    const n = points.length - 1;
    const result = [];

    for (let t = 0; t <= 1; t += step) {
        let x = 0;
        let y = 0;

        for (let i = 0; i <= n; i++) {
            const coeff = binomialCoefficient(n, i) *
                (1 - t) ** (n - i) *
                t ** i;
            x += coeff * points[i].x;
            y += coeff * points[i].y;
        }

        result.push({ x, y });
    }

    return result;
}
