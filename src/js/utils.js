import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.38";

export const saveSVGFile = () => {
    const mySvg = document.querySelector('main > svg').outerHTML;
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
}

export const sumArray = (arr) => {
    return arr.reduce((prev, curr) => prev + curr);
};

// Color palette
let colorPalette = [];
export const getColorPalette = async () => {
    await fetch("https://unpkg.com/nice-color-palettes@3.0.0/100.json")
    .then(response => response.json())
    .then(c => {
        colorPalette = random(c);
    });
    return colorPalette;
}

export const getTwoColors = () => {
    let colorList = [...colorPalette];
    const colIdx = random(0, colorList.length - 1, true);
    const background = colorList[colIdx];
    // remove this color from the list
    colorList.splice(colIdx, 1);
    const foreground = random(colorList);
    return { foreground, background };
}