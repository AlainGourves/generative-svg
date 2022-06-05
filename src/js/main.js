import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.38";
import * as blockFn from './blocks.js';
import weightedRandom from './weightedRandom.js';

const numRows = random(8, 10, true); // true: gives an integer
const numCols = random(6, 8, true);
const squareSize = 40;

const btnExport = document.querySelector('#exportSVG');
const btnRedraw = document.querySelector('#redrawSVG');

let colorPalette;

export const drawSVG = () => {
    // if a previous SVG exists, remove it
    const svg = document.querySelector('main svg');
    if (svg) svg.remove();

    const draw = SVG() // create the svg
        .addTo('main')
        .size('100%', '100%')
        .viewbox(`0 0 ${numRows * squareSize} ${numCols * squareSize}`);

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            generateLittleBox(draw, i, j);
        }
    }
}
// window.drawSVG = drawSVG;

const generateLittleBox = (root, x, y) => {
    // get 2 colors
    const { foreground, background } = getTwoColors();

    const blockStyleOptions = [blockFn.drawOppositeCircles, blockFn.drawFacingCircles, blockFn.drawSemiCircle, blockFn.drawCircle, blockFn.drawDisc];
    // const blockStyleOptions = [blockFn.drawRect, blockFn.drawFacingCircles, blockFn.drawSemiCircle, blockFn.drawCircle, blockFn.drawOppositeCircles, blockFn.drawDisc, blockFn.drawOppositeTriangles];
    const blockStyleWeights = [0, 0.5, 0.3, 0.1, 0.1]; // weights must add up to 1
    const blockStyle = random(blockStyleOptions);
    const group = root.group();
    blockStyle(group, x * squareSize, y * squareSize, squareSize, foreground, background);
}

const getTwoColors = () => {
    let colorList = [...colorPalette];
    const colIdx = random(0, colorList.length - 1, true);
    const background = colorList[colIdx];
    // remove this color from the list
    colorList.splice(colIdx, 1);
    const foreground = random(colorList);
    return { foreground, background };
}

const setPageBackground = () => {
    // Sets page's background gradient
    const bg = tinycolor
        .mix(colorPalette[0], colorPalette[1], 50)
        .desaturate(10)
        .toString();
    // lighter version
    const bgInner = tinycolor(bg)
        .lighten(10)
        .toString();
    // darker version
    const bgOuter = tinycolor(bg)
        .darken(10)
        .toString();
    gsap.to('body', {
        '--bg-inner': bgInner,
        '--bg-outer': bgOuter,
        duration: 0.5
    });
}

window.addEventListener("load", async e => {
    // Color palette
    const colors = await fetch("https://unpkg.com/nice-color-palettes@3.0.0/100.json")
        .then(response => response.json())
        .then(c => {
            colorPalette = random(c);
        });

    setPageBackground();

    drawSVG();

    btnExport.addEventListener('click', e => {
        const mySvg = document.querySelector('main svg').outerHTML;
        const fileDowloadUrl = URL.createObjectURL(
            new Blob([mySvg], { type: 'image/svg+xml;charset=utf-8;' })
        );
        const link = document.createElement('a');
        link.href = fileDowloadUrl;
        link.setAttribute(
            'download',
            'image.svg'
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    });

    btnRedraw.addEventListener('click', e => drawSVG());
});