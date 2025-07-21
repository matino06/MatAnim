export class Scene {
    constructor(canvas, { autoResize = true } = {}) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d');
        this.graphicalObjects = [];
        this.resize();

        if (autoResize) {
            window.addEventListener('resize', () => {
                this.resize();
            })
        }
    }

    resize(width = window.innerWidth, height = window.innerHeight) {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = rect.width;
        this.height = rect.height;
        this.draw();
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