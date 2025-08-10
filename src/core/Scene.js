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
            window.addEventListener('resize', () => this.resize(true));
        }
    }

    resize(forceDraw = false) {
        const cssWidth = this.canvas.clientWidth;
        const cssHeight = this.canvas.clientHeight;
        const dpr = window.devicePixelRatio || 1;

        // Calculate physical resolution
        const displayWidth = Math.round(cssWidth * dpr);
        const displayHeight = Math.round(cssHeight * dpr);

        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight || forceDraw) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;

            // Set CSS dimesions to be the same
            this.canvas.style.width = cssWidth + "px";
            this.canvas.style.height = cssHeight + "px";

            // Reset dimesions and scaling context
            this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

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

    updateScaleParams() {
        // CSS dimensions
        const cssWidth = this.canvas.clientWidth;
        const cssHeight = this.canvas.clientHeight;

        if (cssWidth === 0 || cssHeight === 0) {
            this.scaleX = 1;
            this.scaleY = 1;
            this.offsetX = 0;
            this.offsetY = 0;
            return;
        }

        const scaleX = cssWidth / this.expected_screen_width;
        const scaleY = cssHeight / this.expected_screen_height;

        // Maintain aspect ratio with uniform scaling
        this.scaleX = Math.min(scaleX, scaleY);
        this.scaleY = this.scaleX;

        // Calculate centering offset
        this.offsetX = (cssWidth - this.expected_screen_width * this.scaleX) / 2;
        this.offsetY = (cssHeight - this.expected_screen_height * this.scaleY) / 2;
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