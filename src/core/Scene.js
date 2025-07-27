import { GraphicalObjectListener } from "../core/GraphicalObjectListener.js"

export class Scene {
    constructor(canvas, { autoResize = true } = {}) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d');
        this.graphicalObjects = [];
        this.graphicalObjectListener = new GraphicalObjectListener(this);
        this.resize();

        if (autoResize) {
            window.addEventListener('resize', () => {
                this.resize();
            })
        }
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = rect.width;
        this.height = rect.height;
        this.draw();
    }

    add(object) {
        this.graphicalObjects.push(object);
        object.addListener(this.graphicalObjectListener);
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const object of this.graphicalObjects) {
            object.render(this.ctx);
        }
    }
}