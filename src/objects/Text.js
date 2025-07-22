import opentype from 'opentype.js';
import { GraphicalObject } from '../core/GraphicalObject';

export class Text extends GraphicalObject {
    constructor(points, text, fontPath, options = {}) {
        super(points, options);
        this.text = text;
        this.fontPath = fontPath;
    }

    async getPathSegments() {
        const position = this.points[0];
        const font = await opentype.load(this.fontPath)

        const path = font.getPath('A', position.x, position.y, 72);


        return path.commands;
    }

    render(ctx) {
        super.render(ctx);
    }
}