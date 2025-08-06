import { GraphicalObjectComposit } from "../core/GraphicalObjectComposit";
import { NumberLine } from "./NumberLine";
import { MathText } from "./MathText";

export class CoordinateSystem extends GraphicalObjectComposit {
    constructor(points, xRange, yRange, options = {}) {
        CoordinateSystem.validateRange(xRange, 'xRange');
        CoordinateSystem.validateRange(yRange, 'yRange');
        super(points, options);

        this.xRange = xRange;
        this.yRange = yRange;
        this.xTicks = [];
        this.yTicks = [];
        this.isConstructing = true;

        // Configuration with sensible defaults
        const defaultOptions = {
            hasTicks: true,
            ticks: null,
            tickStep: null,
            skipTicks: [],
            hasLabels: true,
            tickLabels: null,
            tickHeight: 25,
            tickWidth: 2,
            lineWidth: 2,
            labelFontSize: null,
            autoFontScaling: true,
            fontScaleFactor: 0.025
        };

        this.options = { ...defaultOptions, ...options };

        this.constructTheCoordinateSystem();
    }

    static validateRange(range, name) {
        if (!Array.isArray(range) || range.length !== 2) {
            throw new Error(`${name} must be an array of two numbers.`);
        }
        const [min, max] = range;
        if (typeof min !== 'number' || typeof max !== 'number') {
            throw new Error(`${name} must contain only numbers.`);
        }
        if (min > 0) {
            throw new Error(`${name}: first number must be less than or equal to 0.`);
        }
        if (max <= min) {
            throw new Error(`${name}: second number must be greater than the first.`);
        }
    }


    ////////////////////////////////////////////////////////////////////////////
    /* CREATING COORDINATE SYSTEM COMPONENTS AND ADDING THEM TO CHILDREN LIST */
    ////////////////////////////////////////////////////////////////////////////

    constructTheCoordinateSystem() {
        const xAxis = new NumberLine(this.points, this.xRange, {
            hasTicks: this.options.hasTicks,
            tickStep: this.options.tickStep,
            skipTicks: [0],
            hasLabels: this.options.hasLabels,
            labelFontSize: this.options.labelFontSize,
        })
        this.children.push(xAxis)

        const fontSize = xAxis.options.labelFontSize;

        const originCoordinates = xAxis.pointToCoords(0);
        const xAxisLenth = xAxis.getLineLength();

        const xAxisRangeSpan = this.xRange[1] - this.xRange[0];
        const yAxisRangeSpan = this.yRange[1] - this.yRange[0];
        const yAxisLength = xAxisLenth * (yAxisRangeSpan / xAxisRangeSpan);
        const yAxisPoints = [];
        yAxisPoints.push(
            {
                x: originCoordinates.x,
                y: originCoordinates.y + yAxisLength * (-this.yRange[0] / yAxisRangeSpan),
            },
            {
                x: originCoordinates.x,
                y: originCoordinates.y - yAxisLength * (this.yRange[1] / yAxisRangeSpan),
            }
        );

        const yAxis = new NumberLine(yAxisPoints, this.yRange, {
            rotation: 90,
            hasTicks: this.options.hasTicks,
            tickStep: xAxis.tickStep,
            skipTicks: [0],
            hasLabels: this.options.hasLabels,

            labelFontSize: fontSize
        },);
        this.children.push(yAxis);

        // const originTickLabelXOffset = yAxis.tickLabelXOffset;
        // const originTickLabelYOffset = xAxis.tickLabelYOffset;
        // const originTickLabelCoords = {
        //     x: originCoordinates.x + originTickLabelXOffset,
        //     y: originCoordinates.y + originTickLabelYOffset,
        // };

        // const originLabel = new MathText([originTickLabelCoords], '0', { fontSize: fontSize });
        // originLabel.translate({ x: -originLabel.width, y: 0 })
        // this.children.push(originLabel);
    }
}