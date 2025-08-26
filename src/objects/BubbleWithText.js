import { GraphicalObjectComposit } from "../core/GraphicalObjectComposit";
import { MultiLineText } from "./MultiLineText";
import { SpeechBubble } from "./SpeechBubble";
import { theme } from "../theme/theme";

export class BubbleWithText extends GraphicalObjectComposit {
    constructor(points, text, options = {}) {
        const defaultOptions = {
            textColor: theme.colors.text,
            bubbleBorderColor: theme.colors.foreground,
            bubbleFillColor: theme.colors.background,
        }
        options = { ...defaultOptions, ...options }
        super(points, options);

        this.text = text;
        this.options = options;
        this.constructBubbleWithText();
    }

    constructBubbleWithText() {
        this.multiLineText = new MultiLineText(
            this.points,
            this.text,
            {
                borderColor: this.options.textBorderColor,
                fillColor: this.options.textFillColor,
                color: this.options.textColor,
                fontSize: this.options.fontSize,
            },
        );

        this.children.push(this.multiLineText);

        const multiLineWidth = this.multiLineText.width;
        const multiLineHeight = this.multiLineText.height;

        this.speechBubble = new SpeechBubble(this.points, multiLineWidth, multiLineHeight, {
            borderColor: this.options.bubbleBorderColor,
            fillColor: this.options.bubbleFillColor,
            color: this.options.bubbleColor,
        });
        this.children.unshift(this.speechBubble);
    }
}