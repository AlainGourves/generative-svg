import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.38";
import { getColorPalette, getTwoColors, saveSVGFile, sumArray } from './utils.js';
import { setPageBackground, toggleMenu } from './animations.js';
import * as blockFn from './blocks.js';
import { getBlockId, init } from "./init.js";
import weightedRandom from './weightedRandom.js';

window.random = random; // TODO enlever ça

const numRows = random(8, 10, true); // true: gives an integer
const numCols = random(6, 8, true);
const squareSize = 40;

const btnMenu = document.querySelector('#btnMenu');
const btnExport = document.querySelector('#exportSVG');
const btnDraw = document.querySelector('#drawSVG');
const btnRefresh = document.querySelector('#redrawSVG');


let colorPalette = [];
let activeBlocksTypes = [];
let activeBlocksWeigths = [];

const typesContainer = document.querySelector('.select-block-type');
const weightsContainer = document.querySelector('.block-weight__cont');
const weightsTotal = weightsContainer.querySelector('.block-weight__total');

const blockTypeTemplate = document.querySelector('#bloc-type__tmpl');
const blockWeightTemplate = document.querySelector('#bloc-weight__tmpl');

let weigthSliders = []; // stores the sliders values

const drawSVG = () => {
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

const generateLittleBox = (root, x, y) => {
    // get 2 colors
    const { foreground, background } = getTwoColors();
    const blockFunction = weightedRandom(activeBlocksTypes, activeBlocksWeigths);
    const group = root.group();
    blockFunction(group, x * squareSize, y * squareSize, squareSize, foreground, background, true);
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
        output.textContent = '0%';
        const draw = SVG().addTo(block).viewbox('0 0 20 20');
        draw.use(getBlockId(fn));
        weightsContainer.insertBefore(clone, weightsTotal);
    } else {
        // Supprime le HTML correspondant
        const label = weightsContainer?.querySelector(`[data-function='${fn}']`).parentElement;
        if (label) label.remove();
        // Enlève fn de activeBlocksTypes (et activeBlocksWeigths)
        const idx = activeBlocksTypes.findIndex(f => f.name === fn);
        activeBlocksTypes.splice(idx, 1);
        activeBlocksWeigths.splice(idx, 1);
    }
    // Affiche le total des poids
    if (activeBlocksTypes.length) {
        weightsTotal.dataset.display = true;
    } else {
        weightsTotal.dataset.display = false;
    }
    // update le array des sliders
    weigthSliders = weightsContainer?.querySelectorAll('input[type=range]');
}

const updateWeights = (ev) => {
    const newVal = parseFloat(ev.target.value);
    const idx = Array.from(weigthSliders).findIndex((s) => s === ev.target);
    let diff = newVal - activeBlocksWeigths[idx];
    activeBlocksWeigths[idx] = newVal;

    if (sumArray(activeBlocksWeigths) > 1) {
        let newWeights = [];
        if (diff > 0) {
            let n = activeBlocksWeigths.filter((v) => v > 0).length - 1;
            newWeights = activeBlocksWeigths.map((v, i) => {
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
            newWeights = activeBlocksWeigths.map((v, i) => {
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
        newWeights.forEach((v, i) => {
            if (v < 0) newWeights[i] = 0;
            if (v > 1) newWeights[i] = 1;
        });
        weigthSliders.forEach((s, i) => (s.value = newWeights[i]));
        activeBlocksWeigths = newWeights;
    }
    let total = 0;
    activeBlocksWeigths.forEach((val, i) => {
        const v = Math.round(val * 100);
        total += v;
        weigthSliders[i].nextElementSibling.value = `${v}%`;
    });
    // TODO: distinguer quand le total < 100%
    weightsTotal.querySelector('output').value = `${total}%`;
};

window.addEventListener("load", async e => {
    // Color palette
    colorPalette = await getColorPalette();
    setPageBackground(colorPalette);

    init();

    // event listener for clicks on checkboxes -> select block type
    typesContainer?.addEventListener('input', (ev) => {
        if (ev.target.dataset.function) {
            updateActiveBocks(ev.target.dataset.function, ev.target.checked)
        }
    });

    // event listener for weights change
    weightsContainer.addEventListener('input', (ev) => {
        if (ev.target.dataset.function) {
            updateWeights(ev);
        }
    })

    btnDraw?.addEventListener('click', drawSVG)
    btnMenu?.addEventListener('click', toggleMenu);
    btnExport?.addEventListener('click', saveSVGFile);
    btnRefresh?.addEventListener('click', drawSVG);

    updateActiveBocks('drawRect', true);
    activeBlocksWeigths = [1]; // TODO: faire en sorte que le slider reflète la valeur
    drawSVG();
});