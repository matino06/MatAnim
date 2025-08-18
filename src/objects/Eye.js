import { GraphicalObjectComposit } from "../core/GraphicalObjectComposit";
import { Circle } from "./Circle";
import { BezierCurve } from "./BezierCurve";

export class Eye extends GraphicalObjectComposit {
    constructor(points, options = {}) {
        const defaultOptions = {
            eyeDirectionDeg: 25,
            irisRadius: 10,
            pupileRadius: 1
        };
        options = { ...defaultOptions, ...options };

        if (options.eyeDirectionDeg < 0) {
            options.eyeDirectionDeg = 360 + (options.eyeDirectionDeg % 360);
        }
        super(points, options);

        this.options = options;
        this.eyeDirectionDeg = options.eyeDirectionDeg % 360;
        this.constructEye();
    }

    moveEyeTop(delta) {
        const position = this.points[0];
        this.eyeBall.commands = new BezierCurve(
            [
                { x: position.x + 40, y: position.y + 0 + delta }, // top point
                { x: position.x + 0, y: position.y + 0 }, // top left
                { x: position.x + 0, y: position.y + 80 }, // bottom left
                { x: position.x + 80, y: position.y + 80 }, // bottom right
                { x: position.x + 80, y: position.y + 0 }, // top right
                { x: position.x + 40, y: position.y + 0 + delta }, // top point
            ],
            { fill: true, color: "white" },
        ).commands;

        this.eyeBall.squintAmount = delta;

        this.eyeBall.reapplyTranformations();

        this.notifyListeners();
    }

    constructEye() {
        const position = this.points[0];
        this.eyeBall = new BezierCurve(
            [
                { x: position.x + 40, y: position.y + 0 }, // top point
                { x: position.x + 0, y: position.y + 0 }, // top left
                { x: position.x + 0, y: position.y + 80 }, // bottom left
                { x: position.x + 80, y: position.y + 80 }, // bottom right
                { x: position.x + 80, y: position.y + 0 }, // top right
                { x: position.x + 40, y: position.y + 0 }, // top point
            ],
            { fill: true, color: "white" },
        );
        this.children.push(this.eyeBall);

        const irisPosition = this.calculateIrisPositions(this.eyeDirectionDeg);
        this.iris = new Circle([irisPosition], this.options.irisRadius, { color: 'black' });
        this.children.push(this.iris);

        const pupilePosition = this.calculatePupilePositions();
        const pupile = new Circle([pupilePosition], this.options.pupileRadius, { color: 'white' });
        this.children.push(pupile);
    }

    calculateIrisPositions(directionDegres) {
        const bezierEyeBallPoints = this.eyeBall.bezierPoints;
        const bezierPointsLength = bezierEyeBallPoints.length;

        const eyeDirectionRatio = (directionDegres / 360);

        let index;
        if (eyeDirectionRatio > 0.25) {
            index = Math.round(bezierPointsLength * (eyeDirectionRatio - 0.25));
        } else {
            index = Math.round(bezierPointsLength * (eyeDirectionRatio + 0.74));
        }

        const eyeDirectionRad = directionDegres * Math.PI / 180
        const irisXOffset = Math.cos(eyeDirectionRad) * this.options.irisRadius;
        const irisYOffset = Math.sin(eyeDirectionRad) * this.options.irisRadius;

        const irisPosition = {
            x: bezierEyeBallPoints[index].x - irisXOffset,
            y: bezierEyeBallPoints[index].y + irisYOffset,
        }
        return irisPosition;
    }

    calculatePupilePositions() {
        const irisPosition = this.iris.getCenter();
        const irisRadius = this.iris.r;
        const eyeDirectionRad = this.eyeDirectionDeg * Math.PI / 180

        const pupilePosition = {
            x: irisPosition.x - irisRadius * Math.cos(eyeDirectionRad) * 0.7,
            y: irisPosition.y + irisRadius * Math.sin(eyeDirectionRad) * 0.7,
        }

        return pupilePosition;
    }
}