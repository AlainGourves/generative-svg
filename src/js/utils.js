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

export const shuffleArray = (arr) => {
    // Fisher–Yates shuffle (plus efficace que d'utiliser simplement la fonction random())
    // ref : https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Array destructuring
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Color palette
export const getColorPalette = async () => {
    let palettes = JSON.parse(localStorage.getItem('palettes'));
    if (!palettes) {
        try {
            const res = await fetch("https://unpkg.com/nice-color-palettes@3.0.0/100.json");
            const data = await res.json();
            localStorage.setItem('palettes', JSON.stringify(data));
            const result = await random(data);
            return result;
        } catch (e) {
            console.error(e);
        }
    } else {
        // const p = Promise.resolve(random(palettes));
        // return p;
        const result = await random(palettes);
        return result;
    }
}

export const getTwoColors = (colors) => {
    let colorList = [...colors];
    const colIdx = random(0, colorList.length - 1, true); // true: gives an integer
    const background = colorList[colIdx];
    // remove this color from the list
    colorList.splice(colIdx, 1);
    const foreground = random(colorList);
    return { foreground, background };
}

export const updateSwatches = (clrs) => {
    const paletteContainer = document.querySelector('article.palette div');
    const swatches = paletteContainer.querySelectorAll('input[type="color"]');
    swatches.forEach((s, idx) => s.value = clrs[idx]);
}