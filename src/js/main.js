import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.38";

const numRows = random(8, 10, true); // true: gives an integer
const numCols = random(6, 8, true);
const squareSize = 40;

const btnExport = document.querySelector('button');

let draw;
let colors
let colorPalette;

const generateLittleBox = (x, y) => {
    // get 2 colors
    const { foreground, background } = getTwoColors();

    const blockStyleOptions = [drawOppositeCircles];
    // const blockStyleOptions = [drawRect, drawFacingCircles, drawSemiCircle, drawCircle, drawOppositeCircles, drawDisc, drawOppositeTriangles];
    // const blockStyleOptions = [drawFacingCircles, drawSemiCircle, drawCircle, drawDisc];
    const blockStyle = random(blockStyleOptions);
    const group = draw.group();
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

// Primitives functions

const drawRect = (group, x, y, w, foreground, background) => {
    // Create group element
    group.addClass('draw-block');
    // Draw block
    group.rect(w, w).fill(background).stroke('none').move(x, y);
}

const drawCircle = (group, x, y, w, foreground, background) => {
    group.addClass('draw-circle');
    // draw background
    group.rect(w, w).fill(background).move(x, y);
    // foreground
    group.circle(w).fill(foreground).move(x, y);
}

const drawOppositeCircles = (group, x, y, w, foreground, background) => {
    group.addClass('opposite-circles');
    group.rect(w, w).fill(background).move(x, y);
    // mask
    const mask = group.rect(w, w).fill('#fff').move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.circle(w).fill(foreground).center(x, y); //Bottom left
    circleGroup.circle(w).fill(foreground).center(x + w, y + w); // top right
    // assign mask
    circleGroup.maskWith(mask);
    if (random(0, 1, true)) circleGroup.rotate(90)
    group.add(circleGroup);
}

const drawFacingCircles = (group, x, y, w, foreground, background) => {
    group.addClass('opposite-circles');
    group.rect(w, w).fill(background).move(x, y);
    // mask
    const mask = group.rect(w, w).fill('#fff').move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.circle(w).fill(foreground).center(x, y + w / 2);
    circleGroup.circle(w).fill(foreground).center(x + w, y + w / 2);
    circleGroup.maskWith(mask);
    if (random(0, 1, true)) circleGroup.rotate(90)
    group.add(circleGroup);
}

const drawSemiCircle = (group, x, y, w, foreground, background) => {
    group.addClass('semi-circles');
    group.rect(w, w).fill(background).move(x, y);
    // group for the circles
    const circleGroup = draw.group();
    circleGroup.path(`M${x} ${y} a ${w / 2} ${w / 2} 0 0 1 0 ${w} z`).fill(foreground);
    circleGroup.path(`M${x + w / 2} ${y} a ${w / 2} ${w / 2} 0 0 1 0 ${w} z`).fill(foreground);
    const dir = random(0, 3, true);
    circleGroup.rotate(dir * 90);
    group.add(circleGroup);
}

const drawDisc = (group, x, y, w, foreground, background) => {
    group.addClass('disc');
    // group for the circles
    const circleGroup = group.group();
    group.rect(w, w).fill(background).move(x, y);
    circleGroup.circle(w).fill(foreground).move(x, y)
    // mask
    const bg = group.rect(w, w).fill('#fff').move(x, y);
    const hole = group.circle(w / 2).fill('black').center(x + w / 2, y + w / 2);
    const mask = group.mask().add(bg).add(hole);
    circleGroup.maskWith(mask);
    group.add(circleGroup);
}

const drawOppositeTriangles = (group, x, y, w, foreground, background) => {
    group.addClass('opposite-triangles');
    group.rect(w, w).fill(background).move(x, y);
    const points = [
        // top-left
        [x, y, x + (w / 2), y, x, y + (w / 2)],
        //bottom-right
        [x + w, y + w, x + (w / 2), y + w, x + w, y + (w / 2)]
    ];
    // group for the triangles
    const triangleGroup = group.group();
    //triangles
    triangleGroup.polygon(points[0]).fill(foreground).move(x, y); //Bottom left
    triangleGroup.polygon(points[1]).fill(foreground); //.move(x, y); // top right
    if (random(0, 1, true)) group.flip('x');
    group.add(triangleGroup);
}

window.addEventListener("load", async e => {
    colors = await fetch(
        "https://unpkg.com/nice-color-palettes@3.0.0/100.json"
    )
        .then(response => response.json())
        .then(c => {
            colorPalette = random(c);
        })

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
    })

    draw = SVG() // create the svg
        .addTo('main')
        .size('100%', '100%')
        .viewbox(`0 0 ${numRows * squareSize} ${numCols * squareSize}`);

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            generateLittleBox(i, j);
        }

    }

    btnExport.addEventListener('click', e => {
        const toSave = draw.svg();
        const fileDowloadUrl = URL.createObjectURL(
            new Blob([toSave], { type: 'image/svg+xml;charset=utf-8;' })
        );
        const link = document.createElement('a');
        link.href = fileDowloadUrl;
        link.setAttribute(
            'download',
            `image.svg`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    });
});