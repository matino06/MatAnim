import opentype from 'opentype.js';
import { GraphicalObject } from '../core/GraphicalObject';
import { base64RobotoFont } from '../fonts/fonts';

function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
    return buffer.buffer;
}

export class Text extends GraphicalObject {
    constructor(points, text, options = {}) {
        const defaultOptions = {
            lineWidth: 1,
            fontSize: 16
        }

        const finalOptions = { ...defaultOptions, ...options }

        super(points, finalOptions);
        this.text = text;
        this.fontSize = finalOptions.fontSize;
        this.commands = this.generateCommands();
    }

    generateCommands() {
        const position = this.points[0];
        const font = opentype.parse(base64ToArrayBuffer(base64RobotoFont));

        const path = font.getPath(this.text, position.x, position.y, this.fontSize);

        return path.commands;
    }

    getCommands() {
        return super.getCommands();
    }

    translate(delta) {
        super.translate(delta);
    }

    render(ctx) {
        super.render(ctx);
    }
}