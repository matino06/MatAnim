import { GraphicalObjectComposit } from "../core/GraphicalObjectComposit";
import { PiCharacterBody } from "./PiCharacterBody";
import { Eye } from "./Eye";
import { BezierCurve } from "./BezierCurve";

export class PiCharacter extends GraphicalObjectComposit {
    constructor(points, options = {}) {
        super(points, options);

        this.constructPiCharacter();
    }

    constructPiCharacter() {
        this.leftEye = new Eye([{ x: 45, y: 5 }]);
        this.children.push(this.leftEye);

        this.rightEye = new Eye([{ x: 85, y: 5 }]);
        this.children.push(this.rightEye);

        this.piCharacterBody = new PiCharacterBody([{ x: 0, y: 20 }]);
        this.children.push(this.piCharacterBody);

        this.mouth = new BezierCurve(
            [
                { x: 75, y: 38 },
                { x: 105, y: 38 },
                { x: 105, y: 38 },
                { x: 105, y: 45 },
                { x: 75, y: 38 },
            ],
            { color: "black" },
        );
        this.children.push(this.mouth);

        this.translate({ x: this.points[0].x, y: this.points[0].y })
    }
}