import { GraphicalObjectComposit } from "../core/GraphicalObjectComposit";
import { theme } from "../theme/theme.js"
import { NumberLine } from "./NumberLine";
import { Rectangle } from "./Rectangle.js"
import { Line } from "./Line"
import Color from "color";

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
            xTicks: null,
            yTicks: null,
            tickStep: null,
            skipXTicks: [],
            skipYTicks: [],
            hasLabels: true,
            xTickLabels: null,
            yTickLabels: null,
            tickHeight: null,
            tickWidth: null,
            lineWidth: null,
            labelFontSize: null,
            autoFontScaling: true,
            fontScaleFactor: 0.025,
            skipLastLabel: false,
            skipLastLabel: false,
            hasGrid: true,
            hasBorder: true,
            xAxisLabel: 'x',
            yAxisLabel: 'y',
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

    pointToCoords(x, y) {
        if (this.xRange[0] > x || this.xRange[1] < x) {
            return undefined;
        }
        if (this.yRange[0] > y || this.yRange[1] < y) {
            return undefined;
        }

        const xAxis = this.children[this.children.length - 2];
        const yAxis = this.children[this.children.length - 1];

        const cords = {
            x: xAxis.pointToCoords(x).x,
            y: yAxis.pointToCoords(y).y,
        };

        return cords;
    }


    ////////////////////////////////////////////////////////////////////////////
    /* CREATING COORDINATE SYSTEM COMPONENTS AND ADDING THEM TO CHILDREN LIST */
    ////////////////////////////////////////////////////////////////////////////

    constructTheCoordinateSystem() {
        const xAxis = new NumberLine(structuredClone(this.points), this.xRange, {
            hasTicks: this.options.hasTicks,
            ticks: this.options.xTicks,
            tickStep: this.options.tickStep,
            skipTicks: [0, ...this.options.skipXTicks],
            hasLabels: this.options.hasLabels,
            tickLabels: this.options.xTickLabels,
            skipFirstLabel: this.options.skipFirstLabel,
            skipLastLabel: this.options.skipLastLabel,
            labelFontSize: this.options.labelFontSize,
            tickHeight: this.options.tickHeight,
            tickWidth: this.options.tickWidth,
            lineWidth: this.options.lineWidth,
            constructImmediately: false,
            label: this.options.xAxisLabel,
            tickLabelColor: this.options.tickLabelColor,
        })
        this.children.push(xAxis)

        const filterFirstAndLastTickLabel = (axis) => {
            axis.ticks.forEach(tick => {
                if (tick.value === axis.range[0]) {
                    axis.options.skipFirstLabel = true;
                }
                if (tick.value === axis.range[0]) {
                    axis.options.skipLastLabel = true;
                }
            })
        }

        filterFirstAndLastTickLabel(xAxis)
        xAxis.constructTheNumberLine();

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
            ticks: this.options.yTicks,
            tickStep: xAxis.options.tickStep,
            skipTicks: [0],
            hasLabels: this.options.hasLabels,
            tickLabels: this.options.yTickLabels,
            skipFirstLabel: this.options.skipFirstLabel,
            skipLastLabel: this.options.skipLastLabel,
            labelFontSize: fontSize,
            tickHeight: this.options.tickHeight,
            tickWidth: this.options.tickWidth,
            lineWidth: this.options.lineWidth,
            constructImmediately: false,
            label: this.options.yAxisLabel,
            tickLabelColor: this.options.tickLabelColor,
        },);
        this.children.push(yAxis);

        filterFirstAndLastTickLabel(yAxis)
        yAxis.constructTheNumberLine();

        const gridLineColor = Color(theme.colors.foreground);
        if (this.options.hasGrid) {
            this.addGridToChildren(xAxis, yAxis, gridLineColor);
        }

        if (this.options.hasBorder) {
            const borderWidth = xAxis.getLineLength();
            const borderHeight = yAxis.getLineLength();

            const border = new Rectangle([originCoordinates], borderWidth, borderHeight, {
                fill: false,
                borderColor: gridLineColor,
            });
            this.children.unshift(border);
        }
    }

    addGridToChildren(xAxis, yAxis, gridLineColor) {
        const addGridLines = (ticks, lineStart, lineEnd, axisType, opacity) => {
            ticks.forEach(tick => {
                let start, end;

                if (axisType === 'x') {
                    // Vertical grid lines
                    start = {
                        x: tick.position.x,
                        y: lineStart.y
                    };
                    end = {
                        x: tick.position.x,
                        y: lineEnd.y
                    };
                } else if (axisType === 'y') {
                    // Horizontal grid lines
                    start = {
                        x: lineStart.x,
                        y: tick.position.y
                    };
                    end = {
                        x: lineEnd.x,
                        y: tick.position.y
                    };
                }

                const gridLine = new Line([start, end], {
                    borderColor: gridLineColor.alpha(opacity).string()
                });

                this.children.unshift(gridLine);
            });
        }

        const xTicks = xAxis.ticks;
        const yAxisStart = yAxis.points[0];
        const yAxisEnd = yAxis.points[1];
        const tickLineOpacity = 0.25;

        addGridLines(xTicks, yAxisStart, yAxisEnd, 'x', tickLineOpacity);

        const yTicks = yAxis.ticks;
        const xAxisStart = xAxis.points[0];
        const xAxisEnd = xAxis.points[1];

        addGridLines(yTicks, xAxisStart, xAxisEnd, 'y', tickLineOpacity);

        // If x and y axis have mid ticks add mid tick lines to grid
        const xMidTicks = xAxis.midTicks;
        const yMidTicks = yAxis.midTicks;
        if (xMidTicks && yMidTicks) {
            const midTickLineOpacity = 0.15;
            addGridLines(xMidTicks, yAxisStart, yAxisEnd, 'x', midTickLineOpacity);
            addGridLines(yMidTicks, xAxisStart, xAxisEnd, 'y', midTickLineOpacity);
        }
    }

}