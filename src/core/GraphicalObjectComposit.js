import { GraphicalObject } from "./GraphicalObject";

export class GraphicalObjectComposit extends GraphicalObject {
    constructor(points, options) {
        super(points, options);

        this.isComposite = true;
        this.children = [];
    }

    getBoundingBox() {
        if (this.children.length === 0) {
            return null;
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const child of this.children) {
            const bbox = child.getBoundingBox();

            if (!bbox) continue;

            minX = Math.min(minX, bbox.minX);
            minY = Math.min(minY, bbox.minY);
            maxX = Math.max(maxX, bbox.maxX);
            maxY = Math.max(maxY, bbox.maxY);
        }

        if (minX === Infinity) {
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

    translate(delta) {
        this.children.forEach(child => {
            child.translate(delta);
        })
        this.notifyListeners();
    }

    scale(xScale = this.lastXScale, yScale = this.lastYScale, pivot = this.getCenter()) {
        this.children.forEach(child => {
            child.scale(xScale, yScale, pivot);
        });

        this.lastXScale = xScale;
        this.lastYScale = yScale;
    }

    render(ctx) {
        this.children.forEach(child => child.render(ctx));
    }
}