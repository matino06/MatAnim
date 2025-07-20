export class Animator {
    constructor(drawCallback) {
        this.drawCallback = drawCallback;
        this.running = false;
        this._frameId = null;
    }

    start() {
        if (this.running) return;
        this.running = true;

        const loop = () => {
            if (!this.running) return;
            this.drawCallback();
            this._frameId = requestAnimationFrame(loop);
        };

        loop();
    }

    stop() {
        this.running = false;
        if (this._frameId) {
            cancelAnimationFrame(this._frameId);
        }
    }
}
