import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';   // OVO!

import { SVG } from 'mathjax-full/js/output/svg';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';

// Singleton MathJax inicijalizacija
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const tex = new TeX({
    packages: AllPackages
});

const svg = new SVG();
const html = mathjax.document('', {
    InputJax: tex,
    OutputJax: svg
});

export const transformCommands = (commands, transformations) => {
    return transformations.reduce((segment, transformation) => {
        let { transformType, a, b, pivot } = transformation;

        if (pivot === undefined) {
            pivot = { x: 0, y: 0 };
        }

        return segment.map(command => {
            const transformed = { ...command };

            if (transformType === 'translate') {
                if (command.x !== undefined) transformed.x += a;
                if (command.y !== undefined) transformed.y += b;
                if (command.x1 !== undefined) transformed.x1 += a;
                if (command.y1 !== undefined) transformed.y1 += b;
                if (command.x2 !== undefined) transformed.x2 += a;
                if (command.y2 !== undefined) transformed.y2 += b;
            }

            if (transformType === 'scale') {
                if (command.x !== undefined) transformed.x = (transformed.x - pivot.x) * a + pivot.x;
                if (command.y !== undefined) transformed.y = (transformed.y - pivot.y) * b + pivot.y;
                if (command.x1 !== undefined) transformed.x1 = (transformed.x1 - pivot.x) * a + pivot.x;
                if (command.y1 !== undefined) transformed.y1 = (transformed.y1 - pivot.y) * b + pivot.y;
                if (command.x2 !== undefined) transformed.x2 = (transformed.x2 - pivot.x) * a + pivot.x;
                if (command.y2 !== undefined) transformed.y2 = (transformed.y2 - pivot.y) * b + pivot.y;
            }

            return transformed;
        });
    }, commands);
};

export const convertSvgToCommands = (latex, fontSize, position) => {
    const node = html.convert(latex, { display: false });
    const svgElement = adaptor.firstChild(node);
    const viewBox = adaptor.getAttribute(svgElement, 'viewBox').split(' ').map(Number);
    const viewBoxScale = fontSize / viewBox[3];

    // Extract SVG path
    const pathElements = adaptor.tags(svgElement, 'path');
    const paths = {};
    pathElements.forEach(pathElement => {
        const d = adaptor.getAttribute(pathElement, 'd');
        const pathId = adaptor.getAttribute(pathElement, 'id');
        paths[pathId] = [...parseSvgPath(d)];
    });

    const transformGroups = (element) => {
        let transformations = [];
        let current = element;

        while (adaptor.kind(current) === 'g' || adaptor.kind(current) === 'use') {
            const transform = adaptor.getAttribute(current, 'transform');
            if (transform) {
                transform.split(' ').reverse().forEach(t => {
                    const match = t.match(/(\w+)\(([^,)]+),?([^)]*)\)/);
                    if (match) {
                        transformations.push({
                            transformType: match[1],
                            a: parseFloat(match[2]),
                            b: match[3] ? parseFloat(match[3]) : parseFloat(match[2])
                        });
                    }
                });
            }
            current = current.parent;
        }
        return [
            ...transformations,
            { transformType: 'scale', a: viewBoxScale, b: viewBoxScale }, // Scale to ViewBox
            { transformType: 'translate', a: position.x, b: position.y } // Translate to Position
        ]
    };

    const commands = [];

    adaptor.tags(svgElement, 'use').forEach(useElement => {
        const pathId = adaptor.getAttribute(useElement, 'xlink:href').slice(1);
        const transformations = transformGroups(useElement);
        commands.push(transformCommands(paths[pathId], transformations));
    });

    const rectElements = adaptor.tags(svgElement, 'rect');
    rectElements.forEach(rect => {
        const x = parseFloat(adaptor.getAttribute(rect, 'x') || 0);
        const y = parseFloat(adaptor.getAttribute(rect, 'y') || 0);
        const width = parseFloat(adaptor.getAttribute(rect, 'width'));
        const height = parseFloat(adaptor.getAttribute(rect, 'height'));

        const transformations = transformGroups(rect.parent);

        const rectCommands = [
            { type: 'M', x: x, y: y },
            { type: 'L', x: x + width, y: y },
            { type: 'L', x: x + width, y: y + height },
            { type: 'L', x: x, y: y + height },
            { type: 'L', x: x, y: y }
        ];

        const transformedRectCommands = transformCommands(rectCommands, transformations);
        commands.push(transformedRectCommands)
    });

    return commands.flat();
};

export function parseSvgPath(d) {
    const commands = [];
    const tokens = d.match(/[A-Za-z]|[0-9.-]+/g) || [];
    let currentX = 0;
    let currentY = 0;
    let i = 0;

    while (i < tokens.length) {
        const cmd = tokens[i++];
        const upperCmd = cmd.toUpperCase();
        let command;

        switch (upperCmd) {
            case 'M':
                currentX = parseFloat(tokens[i]);
                currentY = parseFloat(tokens[i + 1]);
                i += 2;
                command = { type: 'M', x: currentX, y: currentY };
                break;

            case 'L':
                currentX = parseFloat(tokens[i]);
                currentY = parseFloat(tokens[i + 1]);
                i += 2;
                command = { type: 'L', x: currentX, y: currentY };
                break;

            case 'H':
                currentX = parseFloat(tokens[i++]);
                command = { type: 'H', x: currentX, y: currentY };
                break;

            case 'V':
                currentY = parseFloat(tokens[i++]);
                command = { type: 'V', x: currentX, y: currentY };
                break;

            case 'Q':
                const x1 = parseFloat(tokens[i]);
                const y1 = parseFloat(tokens[i + 1]);
                currentX = parseFloat(tokens[i + 2]);
                currentY = parseFloat(tokens[i + 3]);
                i += 4;
                command = {
                    type: 'Q',
                    x1, y1,
                    x: currentX, y: currentY
                };
                break;

            case 'T':
                currentX = parseFloat(tokens[i]);
                currentY = parseFloat(tokens[i + 1]);
                i += 2;
                command = {
                    type: 'T',
                    x: currentX, y: currentY
                };
                break;

            case 'C':
                const c_x1 = parseFloat(tokens[i]);
                const c_y1 = parseFloat(tokens[i + 1]);
                const c_x2 = parseFloat(tokens[i + 2]);
                const c_y2 = parseFloat(tokens[i + 3]);
                currentX = parseFloat(tokens[i + 4]);
                currentY = parseFloat(tokens[i + 5]);
                i += 6;
                command = {
                    type: 'C',
                    x1: c_x1, y1: c_y1,
                    x2: c_x2, y2: c_y2,
                    x: currentX, y: currentY
                };
                break;

            case 'S':
                const s_x2 = parseFloat(tokens[i]);
                const s_y2 = parseFloat(tokens[i + 1]);
                currentX = parseFloat(tokens[i + 2]);
                currentY = parseFloat(tokens[i + 3]);
                i += 4;
                command = {
                    type: 'S',
                    x2: s_x2, y2: s_y2,
                    x: currentX, y: currentY
                };
                break;

            case 'A':
                const rx = parseFloat(tokens[i++]);
                const ry = parseFloat(tokens[i++]);
                const rotation = parseFloat(tokens[i++]);
                const largeArc = parseFloat(tokens[i++]);
                const sweep = parseFloat(tokens[i++]);
                currentX = parseFloat(tokens[i]);
                currentY = parseFloat(tokens[i + 1]);
                i += 2;
                command = {
                    type: 'A',
                    rx, ry, rotation, largeArc, sweep,
                    x: currentX, y: currentY
                };
                break;

            case 'Z':
                command = { type: 'Z' };
                break;

            default:
                // Skip unknown commands
                while (i < tokens.length && !isNaN(parseFloat(tokens[i]))) i++;
        }

        if (command) commands.push(command);
    }
    return commands;
}