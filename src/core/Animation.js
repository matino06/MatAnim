export class Animation {
    constructor(graphicalObject, duration = 500) {
        if (new.target === Animation) {
            throw new Error("Animation is abstract and cannot be instantiated directly.");
        }
        this.graphicalObject = graphicalObject;
        this.duration = duration;
        this.startTime = null;
    }

    setScene(scene) {
        this.scene = scene;
    }

    graphicalObjectIsComposite() {
        return this.graphicalObject.isComposite;
    }

    step(timestamp) {
        throw new Error("Method step() must be implemented");
    }
}
