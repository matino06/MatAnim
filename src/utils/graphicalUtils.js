export function applyPathCommand(command, ctx, state) {
    switch (command.type) {
        case 'M':
            ctx.moveTo(command.x, command.y);
            state.currentX = command.x;
            state.currentY = command.y;
            state.prevControl = null;
            break;

        case 'L':
            ctx.lineTo(command.x, command.y);
            state.currentX = command.x;
            state.currentY = command.y;
            state.prevControl = null;
            break;

        case 'H':
            ctx.lineTo(command.x, state.currentY);
            state.currentX = command.x;
            state.prevControl = null;
            break;

        case 'V':
            ctx.lineTo(state.currentX, command.y);
            state.currentY = command.y;
            state.prevControl = null;
            break;

        case 'Q':
            ctx.quadraticCurveTo(
                command.x1, command.y1,
                command.x, command.y
            );
            state.currentX = command.x;
            state.currentY = command.y;
            state.prevControl = { x: command.x1, y: command.y1 };
            break;

        case 'T': // Smooth quadratic bezier
            let cpX, cpY;
            if (state.prevControl) {
                cpX = 2 * state.currentX - state.prevControl.x;
                cpY = 2 * state.currentY - state.prevControl.y;
            } else {
                cpX = state.currentX;
                cpY = state.currentY;
            }
            ctx.quadraticCurveTo(cpX, cpY, command.x, command.y);
            state.currentX = command.x;
            state.currentY = command.y;
            state.prevControl = { x: cpX, y: cpY };
            break;

        case 'C': // Cubic bezier
            ctx.bezierCurveTo(
                command.x1, command.y1,
                command.x2, command.y2,
                command.x, command.y
            );
            state.currentX = command.x;
            state.currentY = command.y;
            state.prevControl = { x: command.x2, y: command.y2 };
            break;

        case 'S': // Smooth cubic bezier
            let s_cp1x, s_cp1y;
            if (state.prevControl) {
                s_cp1x = 2 * state.currentX - state.prevControl.x;
                s_cp1y = 2 * state.currentY - state.prevControl.y;
            } else {
                s_cp1x = state.currentX;
                s_cp1y = state.currentY;
            }
            ctx.bezierCurveTo(
                s_cp1x, s_cp1y,
                command.x2, command.y2,
                command.x, command.y
            );
            state.currentX = command.x;
            state.currentY = command.y;
            state.prevControl = { x: command.x2, y: command.y2 };
            break;

        case 'A':
            ctx.ellipse(
                state.currentX, state.currentY,
                command.rx, command.ry,
                command.rotation * Math.PI / 180,
                0, 2 * Math.PI
            );
            state.currentX = command.x;
            state.currentY = command.y;
            state.prevControl = null;
            break;

        case 'Z':
            ctx.closePath();
            state.prevControl = null;
            break;
    }
}