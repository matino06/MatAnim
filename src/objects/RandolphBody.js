import { GraphicalObject } from "../core/GraphicalObject"
import { getQuadraticBezierPoints, getQuarticBezierPoints } from "../utils/geometryUtils";
import { theme } from "../theme/theme";

export class RandolphBody extends GraphicalObject {
    constructor(points, options = {}) {
        const defaultOptions = {
            borderColor: theme.colors.secondary,
            fillColor: theme.colors.secondary,
            lineWidth: 4,
        }
        super(points, { ...defaultOptions, ...options });
        this.setLimbs();
        this.generateCommands();
    }

    setLimbs() {
        this.leftLegBottom = { x: 400, y: 450 };
        this.leftLegKne = { x: 400, y: 370 };
        this.leftLegTop = { x: 440, y: 200 };

        this.rightLegBottom = { x: 580, y: 450 };
        this.rightLegKne = { x: 540, y: 375 };
        this.rightLegTop = { x: 540, y: 200 };

        this.rightShoulder = { x: 600, y: 160 };
        this.rightArm = { x: 650, y: 100 };

        this.leftShoulder = { x: 390, y: 160 };
        this.leftArm = { x: 320, y: 240 };
    }

    pointsToCommands = (bezierPoints) => {
        const lastPoint = bezierPoints[0];
        for (let index = 0; index < bezierPoints.length; index++) {
            const point = bezierPoints[index];
            this.commands.push({ type: 'L', x: point.x, y: point.y });
        }
    }

    generateCommands() {
        this.commands = [];

        this.generateLegCommands(this.leftLegBottom, this.leftLegKne, this.leftLegTop); // Left Leg
        this.generateLegCommands(this.rightLegBottom, this.rightLegKne, this.rightLegTop); // Right Leg
        this.generateArmCommands(this.rightShoulder, this.rightArm);
        this.generateArmCommands(this.leftShoulder, this.leftArm);
        this.commands.push({ type: 'Z' });
    }

    generateLegCommands(legBottomPoint, legKnePoint, legTopPoint) {
        // Define all key leg points
        const legTopPointLeft = {
            x: legTopPoint.x - 15,
            y: legTopPoint.y,
        };
        const legTopPointRight = {
            x: legTopPoint.x + 20,
            y: legTopPoint.y,
        };
        const legMidPointLeft = {
            x: legKnePoint.x - 10,
            y: legKnePoint.y,
        };
        const legMidPointRight = {
            x: legKnePoint.x + 35,
            y: legKnePoint.y,
        };
        const bezierControlPointBottomLeft = {
            x: legKnePoint.x - 35,
            y: legBottomPoint.y,
        };
        const bezierControlPointBottomRight = {
            x: legKnePoint.x + 40,
            y: legBottomPoint.y,
        };
        const bezierControlPointTopLeft = {
            x: legKnePoint.x + 10,
            y: (legKnePoint.y + legTopPoint.y) / 2,
        };
        const bezierControlPointTopRight = {
            x: legKnePoint.x + 40,
            y: (legKnePoint.y + legTopPoint.y) / 2,
        };

        const legSegments = [
            [legTopPointLeft, bezierControlPointTopLeft, legMidPointLeft], // Upper left part of the leg
            [legMidPointLeft, bezierControlPointBottomLeft, legBottomPoint], // Lower left part of the leg
            [legBottomPoint, bezierControlPointBottomRight, legMidPointRight], // Lower right part of the leg
            [legMidPointRight, bezierControlPointTopRight, legTopPointRight], // Upper right part of the leg
        ]

        legSegments.forEach(segment => {
            const bezierPoints = getQuadraticBezierPoints(...segment);
            this.pointsToCommands(bezierPoints);
        });
    }

    generateArmCommands(shoulderPoint, armPoint) {
        // Define all key arm points
        const shoulderBottomPoint = {
            x: shoulderPoint.x,
            y: shoulderPoint.y + 40
        }
        const armBottom = {
            x: armPoint.x,
            y: shoulderPoint.y + 40
        }
        const shoulderTopPoint = {
            x: shoulderPoint.x,
            y: shoulderPoint.y
        }
        const armTop = {
            x: armPoint.x,
            y: shoulderPoint.y
        }
        const armMid = {
            x: armPoint.x + 50,
            y: armPoint.y
        }

        const shouldReverse = shoulderPoint.x < this.leftLegTop.x;

        if (armPoint.y > shoulderBottomPoint.y) {
            const armToShoudlerXDistance = shoulderPoint.x - armPoint.x;
            const xOffsetScalingFactor = (armToShoudlerXDistance > 0 ? 0.9 * Math.log10(armToShoudlerXDistance / 100) : -0.9);
            let xOffset = armToShoudlerXDistance * xOffsetScalingFactor;
            if (xOffset < 50) {
                xOffset = 50;
            }
            if (shouldReverse) {
                xOffset *= -1;
            }

            armTop.x = shoulderTopPoint.x + xOffset;
            armTop.y = shoulderTopPoint.y;

            armMid.x = shoulderTopPoint.x + xOffset;
            armMid.y = armPoint.y;

            armBottom.x = armPoint.x;
            armBottom.y = armPoint.y;
        } else if (armPoint.y < shoulderTopPoint.y) {
            const armToShoudlerXDistance = shoulderPoint.x - armPoint.x;
            const xOffsetScalingFactor = (armToShoudlerXDistance > 0 ? 0.9 * Math.log10(armToShoudlerXDistance / 100) : -0.9);
            let xOffset = armToShoudlerXDistance * xOffsetScalingFactor;
            if (xOffset < 50) {
                xOffset = 50;
            }

            armBottom.x = shoulderBottomPoint.x + xOffset;
            armBottom.y = shoulderBottomPoint.y;

            armMid.x = shoulderBottomPoint.x + xOffset;
            armMid.y = armPoint.y;

            armTop.x = armPoint.x;
            armTop.y = armPoint.y;
        }

        const legSegments = [
            [shoulderBottomPoint, armBottom, armMid, armTop, shoulderTopPoint],
        ]

        if (shouldReverse) {
            legSegments.forEach(segment => {
                const bezierPoints = getQuarticBezierPoints(...segment.reverse());
                this.pointsToCommands(bezierPoints);
            });
        } else {
            legSegments.forEach(segment => {
                const bezierPoints = getQuarticBezierPoints(...segment);
                this.pointsToCommands(bezierPoints);
            });
        }


    }
}
