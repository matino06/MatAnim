export class AnimationManager {
    constructor(scene) {
        this.scene = scene;
        this.animations = [];
        this.pendingAnimations = [];
        this.running = false;
        this.lastTimestamp = 0;
        this.inStep = false;
    }

    add(animation) {
        if (this.inStep) {
            // Queue if we're currently in step()
            this.pendingAnimations.push(animation);
        } else {
            this._addAnimationDirectly(animation);
        }
    }

    _addAnimationDirectly(animation) {
        if (animation.animationsTypeForComposit && animation.graphicalObjectIsComposite()) {
            const AnimationClass = animation.constructor;
            const animationOptions = animation.options;
            const compositeObject = animation.graphicalObject;
            compositeObject.children.forEach(child => {
                const childAnimation = new AnimationClass(child, animationOptions);
                this._addAnimationDirectly(childAnimation);
            });
            return;
        } else {
            console.log(animation)
            animation.setScene(this.scene);
            this.animations.push(animation);
        }
        if (!this.running) {
            this.running = true;
            this.lastTimestamp = 0;
            requestAnimationFrame(this.step.bind(this));
        }
    }

    step(timestamp) {
        this.inStep = true; // Mark as in step process

        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const delta = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        const hasAnimations = this.animations.length > 0;

        if (hasAnimations) {
            this.scene.draw();
            if (this.scene.scaleToScreen) {
                this.scene.applyTransformations();
            }

            this.animations = this.animations.filter(anim => anim.step(timestamp, delta));

            if (this.scene.scaleToScreen) {
                this.scene.resetTransformations();
            }
        }

        this.inStep = false; // Step process complete

        // Add pending animations after step completes
        if (this.pendingAnimations.length > 0) {
            this.pendingAnimations.forEach(anim => this._addAnimationDirectly(anim));
            this.pendingAnimations = [];
        }

        if (this.animations.length > 0) {
            requestAnimationFrame(this.step.bind(this));
        } else {
            this.running = false;
            this.scene.draw();
        }
    }
}