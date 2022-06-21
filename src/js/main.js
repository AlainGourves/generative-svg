import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.38";
import { getColorPalette, getTwoColors, updateSwatches, saveSVGFile, sumArray, shuffleArray } from './utils.js';
import { setPageBackground, btnMenuOpen, btnMenuClose, randomWeightsAnim, articleSlideIn } from './animations.js';
import * as blockFn from './blocks.js';
import { getBlockId, init } from "./init.js";
import weightedRandom from './weightedRandom.js';

window.random = random; // TODO enlever ça

let numCols = 8; // width
let numRows = 6; // height
const squareSize = 40;

const btnMenu = document.querySelector('#btnMenu');
const settings = document.querySelector('aside');
const btnExport = settings.querySelector('#exportSVG');
const btnDraw = settings.querySelector('#drawSVG');
const btnRandomWeights = settings.querySelector('#random-weights');
const btnNewPalette = settings.querySelector('#newPalette');


let colorPalette = [];
let activeBlocksTypes = [];
let activeBlocksWeigths = [];

const typesContainer = settings.querySelector('.select-block-type');
const weightsContainer = settings.querySelector('.block-weight__cont');
const weightsTotal = weightsContainer.querySelector('.block-weight__total');

const blockWeightTemplate = settings.querySelector('#bloc-weight__tmpl');

let weigthSliders = []; // stores the sliders values

const drawSVG = () => {
    // if a previous SVG exists, remove it
    const svg = document.querySelector('main svg');
    if (svg) svg.remove();

    const draw = SVG() // create the svg
        .addTo('main')
        .size('100%', '100%')
        .viewbox(`0 0 ${numCols * squareSize} ${numRows * squareSize}`);

    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            generateLittleBox(draw, i, j);
        }
    }
}

const generateLittleBox = (root, x, y) => {
    // get 2 colors
    const { foreground, background } = getTwoColors(colorPalette);
    const blockFunction = weightedRandom(activeBlocksTypes, activeBlocksWeigths);
    const group = root.group();
    blockFunction(group, x * squareSize, y * squareSize, squareSize, foreground, background, true);
}

const updateActiveBlocks = (fn, isActive) => {
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
        // update le array des sliders
        weigthSliders = weightsContainer?.querySelectorAll('input[type=range]');
    } else {
        // Supprime le HTML correspondant
        const label = weightsContainer?.querySelector(`[data-function='${fn}']`).parentElement;
        if (label) label.remove();
        // Enlève fn de activeBlocksTypes (et activeBlocksWeigths)
        const idx = activeBlocksTypes.findIndex(f => f.name === fn);
        activeBlocksTypes.splice(idx, 1);
        activeBlocksWeigths.splice(idx, 1);
        // update le array des sliders
        // NB: il faut que ça soit fait là pour la suite
        weigthSliders = weightsContainer?.querySelectorAll('input[type=range]');
        if (activeBlocksTypes.length === 1) {
            // 1 seul bloc activé => son poids doit être 1 !!
            const b = weightsContainer.querySelector(`[data-function='${activeBlocksTypes[0].name}']`)
            b.value = 1;
            activeBlocksWeigths[0] = 1;
        }
        // MàJ total poids
        updateTotalWeight();
    }
    // Affiche le total des poids
    if (activeBlocksTypes.length > 1) {
        weightsTotal.dataset.display = true;
    } else {
        weightsTotal.dataset.display = false;
    }
}

const updateWeights = (ev) => {
    const newVal = parseFloat(ev.target.value);
    const idx = Array.from(weigthSliders).findIndex((s) => s === ev.target);
    let diff = newVal - activeBlocksWeigths[idx];
    activeBlocksWeigths[idx] = newVal;

    // TODO: couille en potage dans l'algo, on peut dépasser les 100% !!!
    // console.log(sumArray(activeBlocksWeigths))
    if (activeBlocksWeigths.length > 1 && sumArray(activeBlocksWeigths) > 1) {
        let newWeights = [];
        if (diff > 0) {
            let n = activeBlocksWeigths.filter((v) => v > 0).length - 1;
            newWeights = activeBlocksWeigths.map((v, i) => {
                if (i === idx || v === 0) return v;
                let res = v - diff / n;
                if (res < 0) {
                    // diff += Math.abs(res);
                    diff = diff - v + Math.abs(res);
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
    updateTotalWeight();
};

const updateTotalWeight = () => {
    let total = 0;
    activeBlocksWeigths.forEach((val, i) => {
        const v = Math.round(val * 100);
        total += v;
        weigthSliders[i].nextElementSibling.value = `${v}%`; // update <output> value
    });
    const output = weightsTotal.querySelector('output')
    output.value = `${total}%`;
    // quand le total != 100%
    output.classList.toggle('alert', total !== 100)
}

const randomizeWeights = () => {
    let tot = 0;
    let result = [];
    activeBlocksWeigths.forEach((_, idx) => {
        result[idx] = random(0, (1 - tot));
        tot += result[idx];
    });
    // Pour que le total soit bien 1, on calcule le reste et on l'attribue à un des poids
    const diff = 1 - sumArray(result);
    result[random(0, result.length - 1, true)] += diff
    result = shuffleArray(result);
    activeBlocksWeigths = result;
    weigthSliders.forEach((s, idx) => {
        s.value = result[idx];
    });
    updateTotalWeight();
}

const newPalette = (ev, redraw = false) => {
    getColorPalette()
        .then(result => colorPalette = result)
        .then(colorPalette => {
            updateSwatches(colorPalette);
            if (redraw) {
                drawSVG();
            }
        });
}

const addNewPaletteBtn = () => {
    const newBtn = btnNewPalette.cloneNode(true);
    newBtn.id = 'newPalRoundBtn';
    newBtn.title = "Create a new image with a random palette.";
    newBtn.classList.remove('btn__small');
    newBtn.classList.add('btn__round');
    newBtn.addEventListener('click', ev => {
        newPalette(ev, true);
    });
    const parent = btnExport.parentNode;
    parent.insertBefore(newBtn, btnExport);
}

const toggleMenu = () => {
    const btns = settings.querySelectorAll('.btns button');
    if (settings.classList.contains('open')) {
        btnMenuClose()
        addNewPaletteBtn();
        settings.classList.remove('open')
        btns.forEach(b => b.classList.add('btn__round'));
    } else {
        btnMenuOpen()
        let paletteBtn = settings.querySelector('#newPalRoundBtn')
        if (paletteBtn) {
            paletteBtn.remove();
        }
        articleSlideIn()
        settings.classList.add('open')
        btns.forEach(b => b.classList.remove('btn__round'));
    }
}

window.addEventListener("load", e => {

    const paletteContainer = document.querySelector('.clr__inputs');
    paletteContainer.addEventListener('change', ev => {
        const idx = ev.target.dataset.idx;
        const newVal = ev.target.value;
        colorPalette[idx] = newVal;
    });

    init();

    // Grid dimensions
    const gridSize = document.querySelector('.grid__size');
    const inputs = gridSize.querySelectorAll('input[type="number"]');
    inputs[0].value = numCols;
    inputs[1].value = numRows;
    gridSize.addEventListener('change', ev => {
        // add .alert class if input is not valid
        ev.target.classList.toggle('alert', ev.target.validity.badInput);
        const newVal = parseInt(ev.target.value);
        if (ev.target.dataset.var == 'numCols') numCols = newVal;
        if (ev.target.dataset.var == 'numRows') numRows = newVal;
    });

    // event listener for clicks on checkboxes -> select block type
    typesContainer?.addEventListener('change', (ev) => {
        if (ev.target.dataset.function) {
            updateActiveBlocks(ev.target.dataset.function, ev.target.checked)
        }
    });

    // event listener for weights change
    weightsContainer.addEventListener('input', (ev) => {
        if (ev.target.dataset.function) {
            updateWeights(ev);
        }
    });

    // Event listener for ESC key
    window.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && settings.classList.contains('open')) {
            toggleMenu();
        }
    });

    [
        [btnDraw, drawSVG],
        [btnMenu, toggleMenu],
        [btnExport, saveSVGFile],
        [btnNewPalette, newPalette],
        [btnRandomWeights, randomizeWeights]
    ].forEach(([btn, fn]) => btn?.addEventListener('click', fn));

    btnRandomWeights?.addEventListener('mouseenter', randomWeightsAnim);
    btnRandomWeights?.addEventListener('mouseleave', randomWeightsAnim);
    // btnRandomWeights?.addEventListener('focusout', TODO);


    // By default, select 'drawRect' type with a weight of 1
    const defaultType = 'drawRect';
    const checkbox = typesContainer.querySelector(`[data-function='${defaultType}']`);
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    const slider = weightsContainer.querySelector(`[data-function='${defaultType}']`);
    slider.value = 1;
    slider.dispatchEvent(new Event('input', { bubbles: true }));

    // Color palette
    getColorPalette()
        .then(result => {
            colorPalette = result
            setPageBackground(colorPalette);
            updateSwatches(colorPalette);
            drawSVG();
        });

});