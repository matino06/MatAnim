import { GraphicalObject } from "../core/GraphicalObject";
import { Line } from "./Line";
import { MathText } from "./MathText";

export class NumberLine extends GraphicalObject {
    constructor(points, range, options = {}) {
        super(points, options);

        const defaultOptions = {
            hasTicks: true,
            hasNumbers: true,
            tickHeight: 25,
            tickWidth: 2,
            lineWidth: 2,
        }
        const finallOptions = { ...defaultOptions, ...options };

        this.hasTicks = finallOptions.hasTicks;
        this.hasNumbers = finallOptions.hasNumbers;
        this.tickHeight = finallOptions.tickHeight;
        this.tickWidth = finallOptions.tickWidth;
        this.lineWidth = finallOptions.lineWidth;

        this.isComposite = true;
        this.children = [];
        this.range = range;
        this.ticks = this.calculateTicks();
        this.addLine();

        if (this.hasTicks) {
            this.addTicks();
        }
    }

    addLine() {
        const line = new Line(
            this.points,
            { lineWidth: this.lineWidth },
        );
        this.children.push(line);
    }

    addTicks() {
        this.ticks.forEach(tick => {
            const points = [
                {
                    x: tick.position.x,
                    y: tick.position.y - this.tickHeight / 2
                }, {
                    x: tick.position.x,
                    y: tick.position.y + this.tickHeight / 2
                }];

            const line = new Line(
                points,
                { lineWidth: this.tickWidth },
            );
            this.children.push(line);
        })
    }

    calculateTicks() {
        const [min, max] = this.range;
        const rangeSpan = max - min;

        // Ako je raspon 0, vrati jedan tick na sredini
        if (rangeSpan === 0) {
            const midPoint = this.calculatePosition(min);
            return [{ value: min, position: midPoint }];
        }

        // Izračunaj "lijep" korak za tickove
        const rawStep = rangeSpan / 10; // Ciljamo ~10 tickova
        const exponent = Math.floor(Math.log10(rawStep));
        const magnitude = Math.pow(10, exponent);

        const normalizedStep = rawStep / magnitude;
        const niceSteps = [1, 2, 5, 10];
        let niceStep = niceSteps.find(s => s >= normalizedStep) || 10; // Odaberi prvi veći ili najveći

        const step = niceStep * magnitude;

        // Odredi početni tick (prva "lijepa" vrijednost <= min)
        let startValue = Math.floor(min / step) * step;
        if (startValue < min) startValue += step;

        // Generiraj tickove unutar raspona
        const ticks = [];
        for (let value = startValue; value <= max; value += step) {
            const position = this.calculatePosition(value);
            ticks.push({ value, position });
        }

        // Ako nema tickova, dodaj središnju vrijednost
        if (ticks.length === 0) {
            const midValue = (min + max) / 2;
            ticks.push({ value: midValue, position: this.calculatePosition(midValue) });
        }

        return ticks;
    }

    calculatePosition(value) {
        const [min, max] = this.range;
        const t = (value - min) / (max - min);

        const [p0, p1] = this.points;
        return {
            x: p0.x + t * (p1.x - p0.x),
            y: p0.y + t * (p1.y - p0.y)
        };
    }

    render(ctx) {
        this.children.forEach(child => {
            child.render(ctx);
        })
    }
} 