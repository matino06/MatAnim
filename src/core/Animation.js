import { easeInOutSine } from "./easingFunctions";

export class Animation {
    constructor(graphicalObject, options = {}) {
        if (new.target === Animation) {
            throw new Error("Animation is abstract and cannot be instantiated directly.");
        }

        const defaultOptions = {
            duration: 1000,
            easingFunction: (x) => { return x; }
        };

        this.options = { ...defaultOptions, ...options };
        this.animationsTypeForComposit = false;
        this.graphicalObject = graphicalObject;
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
