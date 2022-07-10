import { random } from '@georgedoescode/generative-utils';

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
            const res = await fetch("https://unpkg.com/nice-color-palettes@3.0.0/200.json");
            const data = await res.json();
            localStorage.setItem('palettes', JSON.stringify(data));
            const result = await random(data);
            await setRootColors(result);
            return result;
        } catch (e) {
            console.error(e);
        }
    } else {
        const result = await random(palettes);
        await setRootColors(result);
        return result;
    }
}

const setRootColors = (clrs) => {
    // assign colors to CSS custom properties
    // First color is the one with greatest difference in luminance compared to primary color (as defined in CSS)
    let primaryColor = window.getComputedStyle(document.documentElement).getPropertyValue('--clr-primary');
    let primaryLuminance = tinycolor(primaryColor).getLuminance();
    let clrsLumi = [];
    clrs.forEach((c, idx) => clrsLumi[idx] = tinycolor(c).getLuminance(c));
    // difference of luminance with primary color
    const differences = clrsLumi.map(x => Math.abs(x - primaryLuminance));
    // array.sort() modify the orignal array => create a copy
    const sorted = [...differences].sort((a, b) => b - a);
    sorted.forEach((d, idx) => {
        document.documentElement.style.setProperty(`--clr${idx + 1}`, clrs[differences.indexOf(d)]);
    })
}

export const getTwoColors = (colorPalette) => {
    // la fonction renvoie l'index des 2 couleurs dans colorPalette pour pouvoir utiliser des classes ensuite pour colorier les blocs
    let colIdx = random(0, colorPalette.length - 1, true); // true: gives an integer
    const background = colIdx;
    let foreground = undefined;
    while (foreground === undefined) {
        // fait en sorte que les 2 couleurs soient différentes
        let idx = random(0, colorPalette.length - 1, true);
        if (idx !== background) foreground = idx;
    }
    return { foreground, background };
}

export const updateSwatches = (clrs) => {
    const paletteContainer = document.querySelector('.clr__inputs');
    const swatches = paletteContainer.querySelectorAll('input[type="color"]');
    swatches.forEach((s, idx) => s.value = clrs[idx]);
}

export const setBgColors = (palette) => {
    // tri sur les couleurs (en les convertissant en HSL) pour avoir les 2 dont le S est plus proche de 50%
    let clrs = [];
    palette.forEach((c,idx) => {
        const obj =tinycolor(c).toHsl();
        obj.idx = idx;
        clrs.push(obj);
    })
    clrs.sort((a,b)=> Math.abs(a.l - 0.5) - Math.abs(b.l - 0.5))
    // Sets page's background gradient
    const bg = tinycolor
        .mix(clrs[0], clrs[1], 50)
        .desaturate(10)
        .toString();
    // lighter version
    const bgInner = tinycolor(bg)
        .lighten(20)
        .toString();
    // darker version
    const bgOuter = tinycolor(bg)
        .darken(10)
        .toString();
    return [bgInner, bgOuter];
}

// Draw & insert a SVG arrow to draw attention on blocks' weights
export const drawArrow = () => {
    const weightsContainer = document.querySelector('.weights');
    const rectCont = weightsContainer.getBoundingClientRect();
    const h3 = weightsContainer.querySelector('h3');
    const rectH3 = h3.getBoundingClientRect();
    const x = (rectCont.width / 2);
    const y = Math.floor((rectH3.y - rectCont.y) + (rectH3.height / 2));

    const draw = SVG()
        .addTo(weightsContainer)
        .viewbox(`0 0 40 40`)
        .attr('id', 'arrow-weights')
    const icon = draw.use('big-arrow')

    icon.size(40, 40)
    draw.css('left', `${x}px`)
        .css('top', `${y}px`);
}