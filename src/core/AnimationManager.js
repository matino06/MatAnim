export class AnimationManager {
    constructor(scene) {
        this.scene = scene;
        this.animations = [];
        this.running = false;
    }

    add(animation) {
        this.animations.push(animation);
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }

    step(timestamp) {
        this.animations = this.animations.filter(anim => anim.step(timestamp));

        if (this.animations.length > 0) {
            requestAnimationFrame(this.step.bind(this));
        } else {
            this.running = false;
        }
    }
}
