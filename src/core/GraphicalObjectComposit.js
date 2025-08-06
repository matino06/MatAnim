import { GraphicalObject } from "./GraphicalObject";

export class GraphicalObjectComposit extends GraphicalObject {
    constructor(points, options) {
        super(points, options);

        this.isComposite = true;
        this.children = [];
    }

    translate(delta) {
        this.points.forEach(point => {
            point.x += delta.x;
            point.y += delta.y;
        })

        this.children.forEach(child => {
            child.translate(delta);
        })
    }

    render(ctx) {
        this.children.forEach(child => child.render(ctx));
    }
}