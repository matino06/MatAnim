export class Animation {
    constructor(scene, graphicalObject, duration = 500) {
        if (new.target === Animation) {
            throw new Error("Animation is abstract and cannot be instantiated directly.");
        }
        this.scene = scene;
        this.graphicalObject = graphicalObject;
        this.ctx = scene.ctx;
        this.duration = duration;
        this.startTime = null;
    }

    step(timestamp) {
        throw new Error("Method step() must be implemented");
    }
}
