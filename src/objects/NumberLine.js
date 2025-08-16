import { GraphicalObjectComposit } from "../core/GraphicalObjectComposit";
import { Line } from "./Line";
import { MathText } from "./MathText";
import { theme } from "../theme/theme";

export class NumberLine extends GraphicalObjectComposit {
    constructor(points, range, options = {}) {
        NumberLine.validateTicks(options.ticks, range);

        const allowedRotations = [0, 90];
        if (options.rotation && !allowedRotations.includes(options.rotation)) {
            throw new Error("Given Rotation not Supported!");
        }
        super(points, options);

        this.range = range;
        this.ticks = [];
        this.isConstructing = true;

        // Configuration with sensible defaults
        const defaultOptions = {
            rotation: 0,
            hasTicks: true,
            hasMidTicks: true,
            ticks: null,
            tickStep: null,
            skipTicks: [],
            hasLabels: true,
            tickLabels: null,
            skipFirstLabel: false,
            skipLastLabel: false,
            tickHeight: null,
            tickWidth: null,
            lineWidth: null,
            labelFontSize: null,
            label: 'x',
            hasArrow: true,
            arrowLength: null,
            arrowAngle: 30,
            autoFontScaling: true,
            fontScaleFactor: 0.012,
            constructImmediately: true,
        };

        this.options = { ...defaultOptions, ...options };

        if (this.options.hasTicks) {
            let ticks;
            if (this.options.ticks) {
                this.options.tickStep = null;
                ticks = this.options.ticks;
            } else {
                ticks = this.calculateDefaultTicks();
            }
            if (this.options.tickLabels) {
                this.tickLabels = this.options.tickLabels;
            }
            this.setTicks(ticks);
            if (this.options.hasMidTicks) {
                this.setMidTicks();
            }

            this.filterTicks();
        }

        if (this.options.hasLabels) {
            this.determineFontSize();
        }

        this.configureDimensions();

        if (this.options.constructImmediately) {
            this.constructTheNumberLine();
        }
        this.isConstructing = false;
    }

    static validateTicks(ticks, range) {
        if (!ticks) {
            return;
        }

        const [min, max] = range;
        if (ticks.some(tick => tick < min || tick > max)) {
            throw new Error("Ticks out of Range!");
        }
    }

    configureDimensions() {
        if (!this.options.tickHeight) {
            const labelSizeToTickHeightScalingFactor = 1.5;
            this.options.tickHeight = this.options.labelFontSize * labelSizeToTickHeightScalingFactor;
        }

        if (!this.options.tickWidth) {
            const tickHeightToTickWidthScalingFactor = 0.07;
            this.options.tickWidth = Math.max(
                1,
                this.options.tickHeight * tickHeightToTickWidthScalingFactor,
            );
        }

        if (!this.options.lineWidth) {
            const tickHeightToLineWidthScalingFactor = 0.07;
            this.options.lineWidth = Math.max(
                1,
                this.options.tickHeight * tickHeightToLineWidthScalingFactor,
            );
        }

        if (!this.options.arrowLength) {
            const labelSizeToArrowLengthScalingFactor = 1.5;
            this.options.arrowLength = this.options.labelFontSize * labelSizeToArrowLengthScalingFactor;
        }

        const { rotation, tickHeight, tickWidth } = this.options;

        if (rotation % 90 !== 0) {
            console.warn("Non-orthogonal rotations may cause rendering issues");
        }

        // Handle dimension swapping for vertical orientation
        const isVertical = rotation % 180 !== 0;
        this.tickHeight = tickHeight;
        this.tickWidth = tickWidth;

        // Configure tick label offsets
        this.tickLabelXOffset = isVertical ? -this.tickHeight : 0;
        this.tickLabelYOffset = isVertical ? 0 : this.tickHeight;
    }

    determineFontSize() {
        if (this.options.labelFontSize) return;

        if (!this.options.autoFontScaling) {
            this.options.labelFontSize = 12; // Fallback size
            return;
        }

        let minTickStep = Infinity;

        if (!this.options.tickStep) {
            if (this.ticks.length < 2) minTickStep = 2;

            for (let i = 1; i < this.ticks.length; i++) {
                let step = this.ticks[i].value - this.ticks[i - 1].value;
                if (step < minTickStep) {
                    minTickStep = step;
                }
            }
        } else {
            minTickStep = this.options.tickStep;
        }

        const minTickStepSqrt = Math.pow(minTickStep, 1 / 2);

        // Calculate based on line length and tick density
        const [p0, p1] = this.points;
        const lineLength = this.getLineLength();
        this.options.labelFontSize = this.options.fontScaleFactor * (minTickStepSqrt * lineLength);
    }

    calculateDefaultTicks() {
        const [min, max] = this.range;
        const rangeSpan = max - min;

        // Special case: single point
        if (rangeSpan === 0) {
            return [{ value: min, position: this.pointToCoords(min) }];
        }

        this.options.tickStep = this.options.tickStep;
        if (!this.options.tickStep) {
            // Calculate optimal tick spacing
            const targetTicks = 10;
            const rawStep = rangeSpan / targetTicks;
            const stepPower = Math.pow(10, Math.floor(Math.log10(rawStep)));
            const normalizedStep = rawStep / stepPower;

            // "Nice" step values (1, 2, 5, 10)
            const niceSteps = [1, 2, 5, 10];
            const step = niceSteps.find(s => s >= normalizedStep) * stepPower || stepPower * 10;
            this.options.tickStep = step;
        }

        // Generate tick values
        let current = Math.ceil(min / this.options.tickStep) * this.options.tickStep;
        const ticks = [];

        while (current <= max) {
            if (!this.options.skipTicks.includes(current)) {
                ticks.push(current);
            }
            current += this.options.tickStep;
        }

        return ticks;
    }


    filterTicks() {
        const arrowAngleRad = this.options.arrowAngle * Math.PI / 180;
        const arrowLength = this.options.arrowLength * Math.cos(arrowAngleRad);
        const arrowMargine = 5;

        let countToRemoveTicks = 0;
        const numberLineEndCoords = this.points[1];
        this.ticks.forEach(tick => {
            const tickCoords = tick.position;
            const tickToEndDistance = Math.hypot(numberLineEndCoords.x - tickCoords.x, numberLineEndCoords.y - tickCoords.y);

            if (tickToEndDistance < arrowLength + arrowMargine) {
                countToRemoveTicks++;
            }
        })

        if (countToRemoveTicks > 0) {
            this.ticks.splice(-countToRemoveTicks);
        }

        if (this.options.hasArrow && this.ticks[0].value === this.range[0]) {
            this.ticks.shift();
        }
    }


    pointToCoords(value) {
        const [min, max] = this.range;
        const t = (value - min) / (max - min);
        return {
            x: this.points[0].x + t * (this.points[1].x - this.points[0].x),
            y: this.points[0].y + t * (this.points[1].y - this.points[0].y)
        };
    }

    /////////////////////////
    /* GETTERS AND SETTERS */
    /////////////////////////

    getLineLength() {
        const [p0, p1] = this.points;
        return Math.hypot(p1.x - p0.x, p1.y - p0.y);
    }

    getCenter() {
        return this.pointToCoords(0);
    }

    setTicks(ticks) {
        this.ticks = [];
        const [min, max] = this.range;

        ticks.forEach((tick, index) => {
            if (!this.options.skipTicks.includes(tick)) {
                const tickLabel = this.tickLabels ? this.tickLabels[index] : tick;
                this.ticks.push({
                    value: tick,
                    position: this.pointToCoords(tick),
                    label: tickLabel,
                });
            }
        })

        // Ensure at least one tick
        if (ticks.length === 0) {
            const midValue = (min + max) / 2;
            if (!this.options.skipTicks.includes(midValue)) {
                this.ticks.push({
                    value: midValue,
                    position: this.pointToCoords(midValue),
                    label: midValue,
                });
            }
        }

        if (!this.isConstructing) {
            this.constructTheNumberLine();
        }
    }

    setMidTicks() {
        // Can't set mid ticks if there is no tick step
        if (!this.options.tickStep) {
            return;
        }

        this.midTicks = [];
        const [min, max] = this.range;
        const step = this.options.tickStep;
        let current = this.ticks[0].value + step / 2;

        while (current < max) {
            this.midTicks.push({
                value: current,
                position: this.pointToCoords(current),
            });
            current += step;
        }
    }

    setTickLabels(tickLabels) {
        if (this.ticks.length != tickLabels.length) {
            throw new Error("Number of tick labels doesn't equal the number of ticks!");
        }

        this.ticks.forEach((tick, index) => {
            tick.position = this.pointToCoords(tick.value);
            tick.label = tickLabels[index];
        });

        if (!this.isConstructing) {
            this.constructTheNumberLine();
        }
    }


    /////////////////////////////////////////////////////////////////////
    /* CREATING NUMBERLINE COMPONENTS AND ADDING THEM TO CHILDREN LIST */
    /////////////////////////////////////////////////////////////////////

    constructTheNumberLine() {
        this.children = [];

        this.addLineToChildren();
        if (this.options.hasTicks) {
            this.addTicksToChildren();
        }
        if (this.options.hasLabels) {
            this.addTickLabelsToChldren();
        }
        if (this.options.hasMidTicks && this.options.tickStep) {
            this.addMidTicksToChildren();
        }
        if (this.options.label) {
            this.addLabelToChildren();
        }
        if (this.options.hasArrow) {
            this.addArrowToChildren();
        }
    }

    addLineToChildren() {
        const line = new Line(structuredClone(this.points), {
            lineWidth: this.options.lineWidth,
        });
        this.children.push(line);
    }

    addTicksToChildren() {
        for (const tick of this.ticks) {
            const center = tick.position;
            const tickPoints = []
            if (this.options.rotation === 90) {
                tickPoints.push(
                    {
                        x: center.x - this.tickHeight / 2,
                        y: center.y,
                    },
                    {
                        x: center.x + this.tickHeight / 2,
                        y: center.y,
                    }
                )
            } else {
                tickPoints.push(
                    {
                        x: center.x,
                        y: center.y - this.tickHeight / 2
                    },
                    {
                        x: center.x,
                        y: center.y + this.tickHeight / 2
                    }
                )
            }

            this.children.push(new Line(tickPoints, {
                lineWidth: this.tickWidth,
            }));
        }
    }

    addMidTicksToChildren() {
        this.midTicks.forEach(midTick => {
            const center = midTick.position;

            const tickPoints = []
            if (this.options.rotation === 90) {
                tickPoints.push(
                    {
                        x: center.x - this.tickHeight / 4,
                        y: center.y,
                    },
                    {
                        x: center.x + this.tickHeight / 4,
                        y: center.y,
                    }
                )
            } else {
                tickPoints.push(
                    {
                        x: center.x,
                        y: center.y - this.tickHeight / 4
                    },
                    {
                        x: center.x,
                        y: center.y + this.tickHeight / 4
                    }
                )
            }

            this.children.push(new Line(tickPoints, {
                lineWidth: this.tickWidth,
            }));
        })
    }

    addTickLabelsToChldren() {
        this.ticks.forEach((tick, index) => {
            if (this.options.skipFirstLabel && index === 0) {
                return;
            }
            if (this.options.skipLastLabel && index === this.ticks.length - 1) {
                return;
            }

            const tickLabel = new MathText(
                [{
                    x: tick.position.x + this.tickLabelXOffset,
                    y: tick.position.y + this.tickLabelYOffset
                }],
                tick.label.toString(),
                {
                    fontSize: this.options.labelFontSize,
                    fillColor: this.options.tickLabelColor,
                    borderColor: this.options.tickLabelColor,
                }
            );

            // Adjust tick label alignment
            if (this.options.rotation % 180 === 0) { // Horizontal
                tickLabel.translate({ x: -tickLabel.width / 2, y: 0 });
            } else { // Vertical
                tickLabel.translate({ x: -tickLabel.width, y: -tickLabel.height / 2 });
            }

            this.children.push(tickLabel);
        })
    }

    addArrowToChildren() {
        const { arrowLength, arrowAngle, lineWidth } = this.options;
        const [p0, p1] = this.points;

        // Calculate vector direction
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        // Skip if the line doesn't have length
        if (length === 0) return;

        // Angle of the arrow in radians
        const angle = Math.atan2(dy, dx);

        // Calculate angles for the arrow
        const arrowAngleRad = arrowAngle * Math.PI / 180;
        const angle1 = angle + Math.PI - arrowAngleRad;
        const angle2 = angle + Math.PI + arrowAngleRad;

        // Calculate arrow points
        const arrowPoint1 = {
            x: p1.x + arrowLength * Math.cos(angle1),
            y: p1.y + arrowLength * Math.sin(angle1)
        };
        const arrowPoint2 = {
            x: p1.x + arrowLength * Math.cos(angle2),
            y: p1.y + arrowLength * Math.sin(angle2)
        };

        // Create lines for arrow
        const arrowLine1 = new Line([structuredClone(p1), arrowPoint1], { lineWidth: lineWidth });
        const arrowLine2 = new Line([structuredClone(p1), arrowPoint2], { lineWidth: lineWidth });

        this.children.push(arrowLine1, arrowLine2);
    }

    addLabelToChildren() {
        const fontSize = this.options.labelFontSize;
        const axisLabel = new MathText(
            [{
                x: this.points[1].x - this.tickLabelXOffset,
                y: this.points[1].y - this.tickLabelYOffset
            }],
            this.options.label.toString(),
            {
                fontSize: this.options.labelFontSize * (this.options.label == 'x\\text{-os}' ? 0.85 : 1),
                borderColor: theme.colors.text,
                fillColor: theme.colors.text,
            }
        );

        // Scale font to equal
        if (fontSize != axisLabel.height) {
            const scalingFactor = axisLabel.height / fontSize;
            axisLabel.setFontSize(fontSize * scalingFactor);
        }

        // Adjust tick label alignment
        if (this.options.rotation % 180 === 0) { // Horizontal
            axisLabel.translate({ x: -axisLabel.width * 1.2, y: -axisLabel.height });
        } else { // Vertical
            axisLabel.translate({ x: 0, y: axisLabel.height });
        }

        this.children.push(axisLabel);
    }
}