import { GraphicalObjectComposit } from "../core/GraphicalObjectComposit";
import { MathText } from "../objects/MathText";
import { theme } from "../theme/theme";

export class MultiLineText extends GraphicalObjectComposit {
    constructor(points, text, options = {}) {
        const defaultOptions = {
            fontSize: 24,
            color: theme.colors.text
        }

        super(points, { ...defaultOptions, ...options });

        this.options = { ...defaultOptions, ...options };
        this.lines = [];
        this.parseText(text);
        this.constructMultiLineText();
    }

    parseText(text) {
        const lines = text.split('\n');

        const regex = /(\\\(.+?\\\)|\\\[.+?\\\])/g;

        lines.forEach(line => {
            const parts = [];
            let lastIndex = 0;

            line.replace(regex, (match, _, offset) => {
                if (offset > lastIndex) {
                    parts.push(line.slice(lastIndex, offset));
                }

                parts.push(match);
                lastIndex = offset + match.length;
            });

            if (lastIndex < line.length) {
                parts.push(line.slice(lastIndex));
            }

            this.lines.push(parts);
        });
    }

    constructMultiLineText() {
        const position = this.points[0];

        this.width = 0;
        this.height = 0;

        let yOffset = 0;
        this.lines.forEach(line => {
            let xOffset = 0;
            let maxHeight = 0;

            line.forEach(part => {
                let latex;

                part = part.trimStart();
                if (part.startsWith("\\(") && part.endsWith("\\)")) {
                    latex = part.substring(2, part.length - 2);
                } else {
                    latex = "\\text{" + part + "}";
                }
                const text = new MathText(
                    [{
                        x: position.x + xOffset,
                        y: position.y + yOffset
                    }],
                    latex,
                    this.options
                )

                if (text.height > maxHeight) {
                    maxHeight = text.height;
                }

                xOffset += text.width + this.options.fontSize / 2;
                if (this.width < xOffset) {
                    this.width = xOffset - this.options.fontSize / 2;
                }
                this.children.push(text);
            })

            yOffset += maxHeight + this.options.fontSize / 2;
        })

        this.height = yOffset;
    }
}