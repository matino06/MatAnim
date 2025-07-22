export function applyPathCommand(command, ctx) {
    switch (command.type) {
        case 'L':
            ctx.lineTo(command.x, command.y);
            break;
        case 'M':
            ctx.moveTo(command.x, command.y);
            break;
        case 'Z':
            ctx.closePath();
            break;
        case 'Q':
            ctx.quadraticCurveTo(command.x1, command.y1, command.x, command.y);
            break;
    }
}