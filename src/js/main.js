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

    // const blockStyleOptions = [drawDisc];
    const blockStyleOptions = [drawRect, drawFacingCircles, drawSemiCircle, drawCircle, drawOppositeCircles, drawDisc, drawOppositeTriangles];
    // const blockStyleOptions = [drawFacingCircles, drawSemiCircle, drawCircle, drawDisc];
    const blockStyle = random(blockStyleOptions);
    blockStyle(x * squareSize, y * squareSize, foreground, background);
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

const drawRect = (x, y, foreground, background) => {
    // Create group element
    const group = draw.group().addClass('draw-block');
    // Draw block
    group.rect(squareSize, squareSize).fill(background).stroke('none').move(x, y);
}

const drawCircle = (x, y, foreground, background) => {
    const group = draw.group().addClass('draw-circle');
    // draw background
    group.rect(squareSize, squareSize).fill(background).move(x, y);
    // foreground
    group.circle(squareSize).fill(foreground).move(x, y);
}

const drawOppositeCircles = (x, y, foreground, background) => {
    const group = draw.group().addClass('opposite-circles');
    // group for the circles
    const circleGroup = draw.group();
    group.rect(squareSize, squareSize).fill(background).move(x, y);
    // mask
    const mask = draw.rect(squareSize, squareSize).fill('#fff').move(x, y);
    const offsets = random([
        // top-left, bottom-right
        [0, 0, squareSize, squareSize],
        // top-right, bottom-left
        [0, squareSize, squareSize, 0]
    ]);
    //circles
    circleGroup.circle(squareSize).fill(foreground).center(x + offsets[0], y + offsets[1]); //Bottom left
    circleGroup.circle(squareSize).fill(foreground).center(x + offsets[2], y + offsets[3]); // top right
    // assign mask
    circleGroup.maskWith(mask);
    group.add(circleGroup);
}

const drawFacingCircles = (x, y, foreground, background) => {
    const group = draw.group().addClass('opposite-circles');
    // group for the circles
    const circleGroup = draw.group();
    group.rect(squareSize, squareSize).fill(background).move(x, y);
    // mask
    const mask = draw.rect(squareSize, squareSize).fill('#fff').move(x, y);
    circleGroup.circle(squareSize).fill(foreground).center(x, y + squareSize / 2);
    circleGroup.circle(squareSize).fill(foreground).center(x + squareSize, y + squareSize / 2);
    circleGroup.maskWith(mask);
    if (random(0, 1, true)) circleGroup.rotate(90)
    group.add(circleGroup);
}

const drawSemiCircle = (x, y, foreground, background) => {
    const group = draw.group().addClass('semi-circles');
    group.rect(squareSize, squareSize).fill(background).move(x, y);
    // group for the circles
    const circleGroup = draw.group();
    circleGroup.path(`M${x} ${y} a ${squareSize / 2} ${squareSize / 2} 0 0 1 0 ${squareSize} z`).fill(foreground);
    circleGroup.path(`M${x + squareSize / 2} ${y} a ${squareSize / 2} ${squareSize / 2} 0 0 1 0 ${squareSize} z`).fill(foreground);
    const dir = random(0, 3, true);
    circleGroup.rotate(dir * 90);
    group.add(circleGroup);
}

const drawDisc = (x, y, foreground, background) => {
    const group = draw.group().addClass('disc');
    // group for the circles
    const circleGroup = draw.group();
    group.rect(squareSize, squareSize).fill(background).move(x, y);
    circleGroup.circle(squareSize).fill(foreground).move(x, y)
    // mask
    const bg = draw.rect(squareSize, squareSize).fill('#fff').move(x, y);
    const hole = draw.circle(squareSize / 2).fill('black').center(x + squareSize / 2, y + squareSize / 2);
    const mask = draw.mask().add(bg).add(hole);
    circleGroup.maskWith(mask);
    group.add(circleGroup);
}

const drawOppositeTriangles = (x, y, foreground, background) => {
    const group = draw.group().addClass('opposite-triangles');
    // group for the triangles
    const triangleGroup = draw.group();
    group.rect(squareSize, squareSize).fill(background).move(x, y);
    const points = [
        [
            // top-left
            [x, y, x + (squareSize / 2), y, x, y + (squareSize / 2)],
            //bottom-right
            [x + squareSize, y + squareSize, x + (squareSize / 2), y + squareSize, x + squareSize, y + (squareSize / 2)]
        ], [
            // top-right
            [x + (squareSize / 2), y, x + squareSize, y, x + squareSize, y + (squareSize / 2)],
            // bottom-left
            [x, y + (squareSize / 2), x, y + squareSize, x + (squareSize / 2), y + squareSize]

        ]
    ];
    const offsets = [
        // top-left, bottom-right
        [0, 0, squareSize, squareSize],
        // top-right, bottom-left
        [0, squareSize, squareSize, 0]
    ];
    const idx = random(0, 1, true);
    //triangles
    triangleGroup.polygon(points[idx][0]).fill(foreground).move(x + offsets[0], y + offsets[1]); //Bottom left
    triangleGroup.polygon(points[idx][1]).fill(foreground).move(x + offsets[2], y + offsets[3]); // top right
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