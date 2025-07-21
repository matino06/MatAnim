export class Scene {
    constructor(canvas, { autoResize = true } = {}) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d');
        this.graphicalObjects = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.resize();

        if (autoResize) {
            window.addEventListener('resize', () => {
                this.resize();
            })
        }
    }

    resize(width = window.innerWidth, height = window.innerHeight) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.draw()
    }

    add(object) {
        this.graphicalObjects.push(object)
    }

    draw() {
        for (const object of this.graphicalObjects) {
            object.render(this.ctx);
        }
    }
}