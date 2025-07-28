export class AnimationManager {
    constructor(scene) {
        this.scene = scene;
        this.animations = [];
        this.running = false;
        this.lastTimestamp = 0;
    }

    add(animation) {
        this.animations.push(animation);
        if (!this.running) {
            this.running = true;
            this.lastTimestamp = 0;
            requestAnimationFrame(this.step.bind(this));
        }
    }

    step(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const delta = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        // Only redraw if we have animations to process
        const hasAnimations = this.animations.length > 0;

        if (hasAnimations) {
            // Clear and prepare canvas
            this.scene.draw()

            // Apply transformations for animations
            if (this.scene.scaleToScreen) {
                this.scene.applyTransformations();
            }

            // Process animations
            this.animations = this.animations.filter(anim => anim.step(timestamp, delta));

            // Reset transformations
            if (this.scene.scaleToScreen) {
                this.scene.resetTransformations();
            }
        }

        if (this.animations.length > 0) {
            requestAnimationFrame(this.step.bind(this));
        } else {
            this.running = false;
            // Final draw to ensure static objects are rendered correctly
            this.scene.draw();
        }
    }
}