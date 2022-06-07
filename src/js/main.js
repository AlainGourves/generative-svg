import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.38";
import { setPageBackground, btnMenuOpen, btnMenuClose } from './animations.js';
import * as blockFn from './blocks.js';
import weightedRandom from './weightedRandom.js';

// Array des noms des fonctions du module Blocks
const drawFunctions = Object.keys(blockFn);

const numRows = random(8, 10, true); // true: gives an integer
const numCols = random(6, 8, true);
const squareSize = 40;

const btnMenu = document.querySelector('#btnMenu');
const btnExport = document.querySelector('#exportSVG');
const btnRedraw = document.querySelector('#redrawSVG');


let colorPalette;
let activeBlocksTypes = [];
let activeBlocksWeigths = [];
const blockTypeTemplate = document.querySelector('#bloc-type__tmpl');
const typesContainer = document.querySelector('.select-block-type');
const blockWeightTemplate = document.querySelector('#bloc-weight__tmpl');
const weightsContainer = document.querySelector('.block-weight__cont');

let weigthSliders = [];
let result; // TODO virer ça !

// TODO mettre dans un fichier
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

    const blockStyleFunctions = [blockFn.drawOppositeCircles, blockFn.drawFacingCircles, blockFn.drawSemiCircle, blockFn.drawCircle, blockFn.drawDisc];
    // const blockStyleFunctions = [blockFn.drawRect, blockFn.drawFacingCircles, blockFn.drawSemiCircle, blockFn.drawCircle, blockFn.drawOppositeCircles, blockFn.drawDisc, blockFn.drawOppositeTriangles];
    const blockStyleWeights = [0, 0.5, 0.3, 0.1, 0.1]; // weights must add up to 1
    const blockStyle = weightedRandom(blockStyleFunctions, blockStyleWeights);
    const group = root.group();
    blockStyle(group, x * squareSize, y * squareSize, squareSize, foreground, background, true);
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

const getBlockId = (str) => {
    return str.substring(4, 5).toLowerCase() + str.substring(5);
}

const updateActiveBocks = (fn, isActive) => {
    if (isActive) {
        // Ajoute fn à activeBlocksTypes (et activeBlocksWeigths)
        activeBlocksTypes.push(blockFn[fn]);
        activeBlocksWeigths.push(0);
        // et génère le HTML correspondant
        const clone = blockWeightTemplate.content.cloneNode(true);
        const label = clone.querySelector('label');
        const input = clone.querySelector('input[type=range]');
        const block = clone.querySelector('.block-type');
        const output = clone.querySelector('output');
        const name = `${getBlockId(fn)}Slider`;
        label.htmlFor = name;
        input.id = name;
        input.dataset.function = fn;
        input.value = 0;
        output.textContent = 0;
        const draw = SVG().addTo(block).viewbox('0 0 20 20');
        draw.use(getBlockId(fn));
        weightsContainer.appendChild(clone);
    } else {
        // Supprime le HTML correspondant
        const label = weightsContainer?.querySelector(`[data-function='${fn}']`).parentElement;
        if (label) label.remove();
        // Enlève fn de activeBlocksTypes (et activeBlocksWeigths)
        const idx = activeBlocksTypes.findIndex(f => f.name === fn);
        activeBlocksTypes.splice(idx, 1);
        activeBlocksWeigths.splice(idx, 1);
    }
    // update le array des sliders
    weigthSliders = weightsContainer?.querySelectorAll('input[type=range]');
}


const sumArray = (arr) => {
    return arr.reduce((prev, curr) => prev + curr);
};

const printVals = () => {
    activeBlocksWeigths.forEach((v, i) => {
        weigthSliders[i].nextElementSibling.value = v.toFixed(2);
    });
};

const updateWeights = (ev) => {
    const newVal = parseFloat(ev.target.value);
    const idx = Array.from(weigthSliders).findIndex((s) => s === ev.target);
    let diff = newVal - activeBlocksWeigths[idx];
    activeBlocksWeigths[idx] = newVal;

    if (sumArray(activeBlocksWeigths) > 1) {
        if (diff > 0) {
            let n = activeBlocksWeigths.filter((v) => v > 0).length - 1;
            result = activeBlocksWeigths.map((v, i) => {
                if (i === idx || v === 0) return v;
                let res = v - diff / n;
                if (res < 0) {
                    diff += Math.abs(res);
                    res = 0;
                }
                return res;
            });
        } else {
            let n = activeBlocksWeigths.length - 1;
            result = activeBlocksWeigths.map((v, i) => {
                if (i === idx || v === 0) return v;
                let res = v - diff / n;
                if (res < 0) {
                    diff += Math.abs(res);
                    res = 0;
                }
                return res;
            });
        }
        // nettoyage
        result.forEach((v, i) => {
            if (v < 0) result[i] = 0;
            if (v > 1) result[i] = 1;
        });
        weigthSliders.forEach((s, i) => (s.value = result[i]));
        activeBlocksWeigths = result;
    }
    printVals();
};

window.addEventListener("load", async e => {
    // Create a SVG with defs for all blocks types
    const library = SVG()
        .addTo('body')
        .width(20)
        .height(20)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .viewbox(`0 0 20 20`);

    const defs = library.defs()
    for (let i = 0; i < drawFunctions.length; i++) {
        const group = defs.group();
        let id = getBlockId(drawFunctions[i]); // renvoie le nom de la fonction sans 'draw' & initiale bdc
        group.attr('id', id);
        group.element('desc').words(id);
        blockFn[drawFunctions[i]](group, 0, 0, 20, '#333', '#ccc');
    }

    // Afficher les différents type de bloc
    drawFunctions.forEach((obj, idx) => {
        const clone = blockTypeTemplate.content.cloneNode(true);
        const check = clone.querySelector('input[type=checkbox]');
        const label = clone.querySelector('label');
        const block = clone.querySelector('.block-type');
        const name = `type${idx}`
        check.id = name;
        check.dataset.function = drawFunctions[idx];
        label.htmlFor = name;
        const draw = SVG().addTo(block).viewbox('0 0 20 20');
        draw.use(getBlockId(drawFunctions[idx]));
        typesContainer.appendChild(clone);
    });
    // event listener for clicks on checkboxes
    typesContainer?.addEventListener('input', (ev) => {
        if (ev.target.dataset.function) {
            updateActiveBocks(ev.target.dataset.function, ev.target.checked)
        }
    });

    // event listener for weights change
    weightsContainer.addEventListener('input', (ev) => {
        if (ev.target.dataset.function) {
            console.log(activeBlocksWeigths)
            updateWeights(ev);
        }
    })
    // Color palette
    const colors = await fetch("https://unpkg.com/nice-color-palettes@3.0.0/100.json")
        .then(response => response.json())
        .then(c => {
            colorPalette = random(c);
        });

    setPageBackground(colorPalette);

    drawSVG();

    btnMenu?.addEventListener('click', e => {
        const as = document.querySelector('aside');
        if (as.classList.contains('open')) {
            btnMenuClose()
            as.classList.remove('open')
        } else {
            btnMenuOpen()
            as.classList.add('open')
        }
    });

    btnExport?.addEventListener('click', e => {
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

    btnRedraw?.addEventListener('click', e => drawSVG());
});