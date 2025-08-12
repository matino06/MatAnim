import { GraphicalObject } from "./GraphicalObject";

export class GraphicalObjectComposit extends GraphicalObject {
    constructor(points, options) {
        super(points, options);

        this.isComposite = true;
        this.children = [];
    }

    translate(delta) {
        this.children.forEach(child => {
            child.translate(delta);
        })
        this.notifyListeners();
    }

    scale(xScale = this.lastXScale, yScale = this.lastYScale) {
        this.children.forEach(child => {
            child.scale(xScale, yScale);
        })

        this.lastXScale = xScale;
        this.lastYScale = yScale;
    }

    render(ctx) {
        this.children.forEach(child => child.render(ctx));
    }
}