import { GraphicalObjectListener } from "../core/GraphicalObjectListener.js"

export class Scene {
    constructor(canvas, {
        autoResize = true,
        scaleToScreen = true,
        expected_screen_width = 1400,
        expected_screen_height = 719
    } = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.graphicalObjects = [];
        this.graphicalObjectListener = new GraphicalObjectListener(this);
        this.scaleToScreen = scaleToScreen;
        this.expected_screen_width = expected_screen_width;
        this.expected_screen_height = expected_screen_height;

        // Store transformation parameters
        this.scaleX = 1;
        this.scaleY = 1;
        this.offsetX = 0;
        this.offsetY = 0;

        this.resize(true);

        if (autoResize) {
            window.addEventListener('resize', () => this.resize());
        }
    }

    resize(forceDraw = false) {
        const cssWidth = this.canvas.clientWidth;
        const cssHeight = this.canvas.clientHeight;
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = Math.round(cssWidth * dpr);
        const displayHeight = Math.round(cssHeight * dpr);

        if (displayWidth !== this.canvas.width || displayHeight !== this.canvas.height || forceDraw) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            this.updateScaleParams();
            this.draw();
        }
    }

    add(object, reDraw = true) {
        this.graphicalObjects.push(object);
        object.addListener(this.graphicalObjectListener);

        if (reDraw) {
            this.draw();
        }
    }

    remove(object, reDraw = true) {
        this.graphicalObjects = this.graphicalObjects
            .filter(graphicalObject => graphicalObject !== object);

        if (reDraw) {
            this.draw();
        }
    }

    updateScaleParams() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        if (w === 0 || h === 0) {
            this.scaleX = 1;
            this.scaleY = 1;
            this.offsetX = 0;
            this.offsetY = 0;
            return;
        }

        const scaleX = w / this.expected_screen_width;
        const scaleY = h / this.expected_screen_height;

        // Maintain aspect ratio with uniform scaling
        this.scaleX = Math.min(scaleX, scaleY);
        this.scaleY = this.scaleX;

        // Calculate centering offset
        this.offsetX = (w - this.expected_screen_width * this.scaleX) / 2;
        this.offsetY = (h - this.expected_screen_height * this.scaleY) / 2;
    }


    applyTransformations() {
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scaleX, this.scaleY);
    }

    resetTransformations() {
        this.ctx.restore();
    }

    drawStaticObjects() {
        if (this.scaleToScreen) {
            this.resetTransformations();
        }
        if (this.scaleToScreen) {
            this.applyTransformations();
        }

        for (const object of this.graphicalObjects) {
            object.render(this.ctx);
        }

        if (this.scaleToScreen) {
            this.resetTransformations();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawStaticObjects();
    }
}