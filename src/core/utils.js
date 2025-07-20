export function rgbToRgba(rgbString, alpha) {
    const [r, g, b] = rgbString.match(/\d+/g).map(Number);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}