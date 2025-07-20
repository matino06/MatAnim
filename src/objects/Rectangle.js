import { Object } from "../core/Object.js"

export class Rectangle extends Object {
    constructor(x, y, width, height, color = "rgb(255, 32, 88)") {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color
    }

    getPathSegments() {
        return [
            { x: this.x, y: this.y },
            { x: this.x + this.width, y: this.y },
            { x: this.x + this.width, y: this.y + this.height },
            { x: this.x, y: this.y + this.height },
            { x: this.x, y: this.y }
        ];
    }

    render(ctx) {
        super.render(ctx);
    }
}