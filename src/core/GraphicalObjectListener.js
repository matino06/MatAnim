export class GraphicalObjectListener {
    constructor(scene) {
        this.scene = scene;
    }

    graphicalObjestChanged() {
        this.scene.draw();
    }
}