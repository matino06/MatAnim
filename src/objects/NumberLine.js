import { GraphicalObjectComposit } from "../core/GraphicalObjectComposit";
import { Line } from "./Line";
import { MathText } from "./MathText";
import { theme } from "../theme/theme";

export class NumberLine extends GraphicalObjectComposit {
    constructor(points, range, options = {}) {
        NumberLine.validateTicks(options.ticks, range);
        super(points, options);

        this.range = range;
        this.ticks = [];
        this.isConstructing = true;

        // Configuration with sensible defaults
        const defaultOptions = {
            rotation: 0,
            hasTicks: true,
            ticks: null,
            tickStep: null,
            skipTicks: [],
            hasLabels: true,
            tickLabels: null,
            skipFirstLabel: true,
            skipLastLabel: true,
            tickHeight: 25,
            tickWidth: 2,
            lineWidth: 2,
            labelFontSize: null,
            autoFontScaling: true,
            fontScaleFactor: 0.012,
        };

        this.options = { ...defaultOptions, ...options };
        this.configureDimensions();

        if (this.options.hasTicks) {
            let ticks;
            if (this.options.ticks) {
                ticks = this.options.ticks;
            } else {
                ticks = this.calculateDefaultTicks();
            }
            if (this.options.tickLabels) {
                this.tickLabels = this.options.tickLabels;
            }
            this.setTicks(ticks);
        }

        if (this.options.hasLabels) {
            this.determineFontSize();
        }

        this.constructTheNumberLine();
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
        const { rotation, tickHeight, tickWidth } = this.options;

        if (rotation % 90 !== 0) {
            console.warn("Non-orthogonal rotations may cause rendering issues");
        }

        // Handle dimension swapping for vertical orientation
        const isVertical = rotation % 180 !== 0;
        this.tickHeight = isVertical ? tickWidth : tickHeight;
        this.tickWidth = isVertical ? tickHeight : tickWidth;

        // Configure tick label offsets
        this.tickLabelXOffset = isVertical ? -this.tickWidth : 0;
        this.tickLabelYOffset = isVertical ? 0 : this.tickHeight;
    }

    determineFontSize() {
        if (this.options.labelFontSize) return;

        if (!this.options.autoFontScaling) {
            this.options.labelFontSize = 12; // Fallback size
            return;
        }

        let minTickStep = Infinity;

        if (!this.tickStep) {
            if (this.ticks.length < 2) minTickStep = 2;

            for (let i = 1; i < this.ticks.length; i++) {
                let step = this.ticks[i] - this.ticks[i - 1];
                if (step < minTickStep) {
                    minTickStep = step;
                }
            }
        } else {
            minTickStep = this.tickStep;
        }

        // Calculate based on line length and tick density
        const [p0, p1] = this.points;
        const lineLength = this.getLineLength();
        this.options.labelFontSize = Math.max(
            8, // Minimum font size
            this.options.fontScaleFactor * (minTickStep * lineLength),
        );
    }

    pointToCoords(value) {
        const [min, max] = this.range;
        const t = (value - min) / (max - min);
        return {
            x: this.points[0].x + t * (this.points[1].x - this.points[0].x),
            y: this.points[0].y + t * (this.points[1].y - this.points[0].y)
        };
    }

    calculateDefaultTicks() {
        const [min, max] = this.range;
        const rangeSpan = max - min;

        // Special case: single point
        if (rangeSpan === 0) {
            return [{ value: min, position: this.pointToCoords(min) }];
        }

        this.tickStep = this.options.tickStep;
        if (!this.tickStep) {
            // Calculate optimal tick spacing
            const targetTicks = 10;
            const rawStep = rangeSpan / targetTicks;
            const stepPower = Math.pow(10, Math.floor(Math.log10(rawStep)));
            const normalizedStep = rawStep / stepPower;

            // "Nice" step values (1, 2, 5, 10)
            const niceSteps = [1, 2, 5, 10];
            const step = niceSteps.find(s => s >= normalizedStep) * stepPower || stepPower * 10;
            this.tickStep = step;
        }

        // Generate tick values
        let current = Math.ceil(min / this.tickStep) * this.tickStep;
        const ticks = [];

        while (current <= max) {
            if (!this.options.skipTicks.includes(current)) {
                ticks.push(current);
            }
            current += this.tickStep;
        }

        return ticks;
    }


    /////////////////////////
    /* GETTERS AND SETTERS */
    /////////////////////////

    getLineLength() {
        const [p0, p1] = this.points;
        return Math.hypot(p1.x - p0.x, p1.y - p0.y);
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
    }

    addLineToChildren() {
        const line = new Line(structuredClone(this.points), {
            lineWidth: this.options.lineWidth
        });
        this.children.push(line);
    }

    addTicksToChildren() {
        for (const tick of this.ticks) {
            const center = tick.position;
            const tickPoints = [
                {
                    x: center.x,
                    y: center.y - this.tickHeight / 2
                },
                {
                    x: center.x,
                    y: center.y + this.tickHeight / 2
                }
            ];

            this.children.push(new Line(tickPoints, {
                lineWidth: this.tickWidth
            }));
        }
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
                    // borderColor: theme.colors.text,
                    // fillColor: theme.colors.text,
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
}