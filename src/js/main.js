import { random } from '@georgedoescode/generative-utils';
import {
    getColorPalette,
    getTwoColors,
    setBgColors,
    updateSwatches,
    saveSVGFile,
    sumArray,
    drawArrow,
    debounce,
    clearSVG,
} from './utils.js';
import {
    animBgColors,
    animSVGIn,
    animSVGOut,
    btnMenuOpen,
    btnMenuClose,
    randomWeightsAnim,
    articleSlideIn,
    blockWeightSlideIn,
    blockWeightSlideOut,
    animPalette,
    animArrow,
    animArrowFadeOut,
} from './animations.js';
import * as blockFn from './blocks.js';
import {
    getBlockId,
    init
} from "./init.js";
import { createTree } from './tree.js';
import weightedRandom from './weightedRandom.js';
import { drawBg } from './bg.js';

/*
Functions :
- prepareDraw
- drawSVG
- generateLittleBox
- updateActiveBlocks
- removeFromActiveBlocks
- updateWeights
- updateTotalWeight
- randomizeWeights
- newPalette
- toggleMenu
*/

const log = console.log;

let prefersReducedMotion = true; // @media(prefers-reduced-motion: reduce) => animations disabled by default

let numCols = 8; // width
let numRows = 6; // height
const squareSize = 40;

const btnMenu = document.querySelector('#btnMenu');
const settings = document.querySelector('.aside__cont');
// Buttons
const btnDraw = settings.querySelector('#drawSVG');
const btnExport = settings.querySelector('#exportSVG');
const btnNewPalette = settings.querySelector('#newPalette');
const btnRandomWeights = settings.querySelector('#randomize-weights');
// Vertical Buttons
const btnsVert = document.querySelectorAll('.btns__vert button');
const btnDrawV = btnsVert[0];
const btnNewPaletteV = btnsVert[1];
const btnExportV = btnsVert[2];


let colorPalette = [];
let activeBlocksTypes = [];
let activeBlocksWeigths = [];

const gridSize = document.querySelector('.grid');
// Grid subdivision
const divideSlider = gridSize.querySelector('.divide-slider');
let isSubdivision = false;
const typesContainer = settings.querySelector('.select-block-type');
const weightsContainer = settings.querySelector('.block-weight__cont');
const weightsTotal = weightsContainer.querySelector('.block-weight__total');

const blockWeightTemplate = settings.querySelector('#bloc-weight__tmpl');

let weigthSliders = []; // stores the sliders values

const debounceTime = 250; // debounce time for draw function

const prepareDraw = () => {
    // Animate the exit of the previous drawing (if it exists) and then calls the drawSVG function
    const svg = document.querySelector('main svg');
    if (svg && !prefersReducedMotion) {
        debounce(animSVGOut(svg)
            .then(() => {
                clearSVG();
                drawSVG();
            }), debounceTime);
    } else {
        clearSVG();
        drawSVG();
    }
}

const drawSVG = () => {
    if (!activeBlocksTypes.length) return;

    const draw = SVG(); // create the svg
    const style = draw.style();
    colorPalette.forEach((c, idx) => style.rule(`.clr${idx}`, { fill: c }))

    draw.addTo('main')
        .size('100%', '100%')
        .viewbox(`0 0 ${numCols * squareSize} ${numRows * squareSize}`);

    // create the tree
    // @param p : probability of subdivision [0%,100%]
    const p = (isSubdivision) ? divideSlider.value : 0;
    const tree = createTree(numCols, numRows, squareSize, p)
    tree.forEach(block => {
        if (block.children.length > 0) {
            // group for subdivised block
            const group = draw.group();
            block.children.forEach(b => {
                generateLittleBox(group, b.x, b.y, b.w);
            })
        } else {
            generateLittleBox(draw, block.x, block.y, block.w);
        }
    });
    if (!prefersReducedMotion) {
        animSVGIn(document.querySelector('main svg'));
    }
}

const generateLittleBox = (root, x, y, w) => {
    // get 2 colors
    const { foreground, background } = getTwoColors(colorPalette);
    const blockFunction = weightedRandom(activeBlocksTypes, activeBlocksWeigths);
    const group = root.group();
    blockFunction(group, x, y, w, foreground, background, true);
}

const updateActiveBlocks = (fn, isActive) => {
    if (isActive) {
        // Ajoute fn à activeBlocksTypes (et activeBlocksWeigths)
        activeBlocksTypes.push(blockFn[fn]);
        activeBlocksWeigths.push((activeBlocksTypes.length === 1) ? 100 : 0); // if there is only 1 block type, its weight is 100
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
        const v = activeBlocksWeigths[activeBlocksWeigths.length - 1];
        input.value = v;
        output.textContent = `${Math.floor(v)}%`
        const draw = SVG().addTo(block).viewbox('0 0 20 20');
        draw.attr('role', 'img');
        draw.use(getBlockId(fn));
        if (!prefersReducedMotion && activeBlocksTypes.length > 1) {
            // Pas d'animation pour le premier block type (qui est masqué au moment de sa création)
            label.style.height = 0;
            label.style.opacity = 0;
            label.style.transform = 'translateX(100%)';
            blockWeightSlideIn(label)
        }
        weightsContainer.insertBefore(clone, weightsTotal);
        // update le array des sliders
        weigthSliders = weightsContainer?.querySelectorAll('input[type=range]');
    } else {
        // Supprime le HTML correspondant
        const label = weightsContainer?.querySelector(`[data-function='${fn}']`).parentElement;
        if (label) {
            if (!prefersReducedMotion) {
                blockWeightSlideOut(label)
                    .then(() => {
                        removeFromActiveBlocks(label, fn);
                    })
                    .then(() => {
                        // MàJ total poids
                        updateTotalWeight();
                    });
            } else {
                removeFromActiveBlocks(label, fn);
                // MàJ total poids
                updateTotalWeight();
            }
        }
    }
    // Affiche le total des poids
    if (activeBlocksTypes.length > 1) {
        btnRandomWeights.tabIndex = 0;
        weightsTotal.dataset.display = true;
    } else {
        btnRandomWeights.tabIndex = -1;
        weightsTotal.dataset.display = false;
    }
}

const removeFromActiveBlocks = (label, fn) => {
    label.remove();
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
        b.value = 100;
        activeBlocksWeigths[0] = 100;
    }
}

const updateWeights = (ev) => {
    const newVal = parseFloat(ev.target.value);
    const idx = Array.from(weigthSliders).findIndex((s) => s === ev.target);
    let diff = newVal - activeBlocksWeigths[idx];
    activeBlocksWeigths[idx] = newVal;

    // console.log(sumArray(activeBlocksWeigths))
    if (activeBlocksWeigths.length > 1 && sumArray(activeBlocksWeigths) > 100) {
        // Sum of weights is > 1
        let newWeights = [];
        if (diff > 0) {
            let n = activeBlocksWeigths.filter((v) => v > 0).length - 1; // nombre de types dont le poids > 0 sur lesquels répartir la diff
            // la nouvelle valeur est > à l'ancienne
            // on distribue la différence sur les autres types > 0
            //(-> ancienne valeur - (diff / n))
            newWeights = activeBlocksWeigths.map((v, i) => {
                if (i === idx || v === 0) return v;
                let returnVal = v - (diff / n);
                if (returnVal < 0) {
                    // la valeur ne peut pas être négative => on met la valeur à 0 et l'excédent est intégré à diff
                    diff = diff - v + Math.abs(returnVal);
                    returnVal = 0;
                }
                return returnVal;
            });
        }
        // nettoyage pour la forme
        newWeights.forEach((v, i) => {
            if (v < 0) newWeights[i] = 0;
            if (v > 100) newWeights[i] = 100;
        });
        // Actualise les sliders
        weigthSliders.forEach((s, i) => (s.value = newWeights[i]));
        // Applique les nouvelles valeurs calculées
        activeBlocksWeigths = newWeights;
    }
    updateTotalWeight();
};

const updateTotalWeight = () => {
    let total = 0;
    activeBlocksWeigths.forEach((val, i) => {
        const v = Math.round(val);
        total += v;
        weigthSliders[i].nextElementSibling.value = `${v}%`; // update <output> value
    });
    const output = weightsTotal.querySelector('output')
    output.value = `${total}%`;
    // quand le total != 100%
    output.classList.toggle('alert', total !== 100);
}

const randomizeWeights = () => {
    // Les poids sont distribués aléatoirement entre les différents types de blocs
    // En tirant un index au hasard pour ajouter 1 (répété 100 fois)
    let myArray = new Array(activeBlocksWeigths.length);
    myArray.fill(0);
    for (let i = 0; i < 100; i++) {
        myArray[random(0, activeBlocksWeigths.length - 1, true)] += 1;
    }
    activeBlocksWeigths = myArray;
    weigthSliders.forEach((s, idx) => {
        s.value = activeBlocksWeigths[idx];
    });
    updateTotalWeight();
    prepareDraw();
}

const newPalette = (ev) => {
    getColorPalette()
        .then(result => colorPalette = result)
        .then(colorPalette => {
            // update SVG's style element with new colors
            colorPalette.forEach((c, idx) => {
                SVG('main svg').style(`.clr${idx}`, { fill: c });
            })
            updateSwatches(colorPalette);
        });
}

const toggleMenu = () => {
    // list all focusable elements in .aside__cont
    const focusable = settings.querySelectorAll('[tabindex]:not(.divide-slider, #randomize-weights), button:not(#random-weights), input:not(.divide-slider)');
    if (settings.parentElement.classList.contains('open')) {
        // Hiding settings
        focusable.forEach(el => el.tabIndex = '-1'); // makes element not focusable when settings are hidden
        btnsVert.forEach(el => el.tabIndex = '0'); // makes vertical buttons focusable when settings are hidden
        btnMenuClose(prefersReducedMotion)
        settings.parentElement.classList.remove('open');
        settings.ariaHidden = true;
    } else {
        // Showing settings
        focusable.forEach(el => el.tabIndex = '0'); // makes element focusable when settings are visible
        btnsVert.forEach(el => el.tabIndex = '-1'); // makes vertical buttons not focusable when settings are visible
        btnMenuOpen(prefersReducedMotion)
        if (!prefersReducedMotion) {
            articleSlideIn()
        }
        settings.parentElement.classList.add('open')
        settings.ariaHidden = false;
    }
}

window.addEventListener("load", e => {
    // Prefers Reduced Motion ********************************************
    const mediaQueryMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');
    prefersReducedMotion = !mediaQueryMotion.matches;
    mediaQueryMotion.addEventListener('change', ev => {
        prefersReducedMotion = !ev.target.matches;
    });

    // Palette listener ********************************************
    const paletteContainer = document.querySelector('.clr__inputs');
    paletteContainer.addEventListener('change', ev => {
        const idx = ev.target.dataset.idx;
        const newVal = ev.target.value;
        colorPalette[idx] = newVal;
        SVG('main svg').style(`.clr${idx}`, { fill: newVal })
    });

    init();

    // Grid dimensions & listeners  ********************************************
    const inputs = gridSize?.querySelectorAll('input[type="number"]');
    inputs[0].value = numCols;
    inputs[1].value = numRows;
    gridSize.addEventListener('change', debounce(ev => {
        if (ev.target.type === 'number') {
            // add .alert class if input is not valid
            if (ev.target.validity.badInput || ev.target.value <= 0) {
                ev.target.classList.add('alert');
                return;
            } else {
                ev.target.classList.remove('alert');
            }
            const newVal = parseInt(ev.target.value);
            if (ev.target.dataset.var == 'numCols') numCols = newVal;
            if (ev.target.dataset.var == 'numRows') numRows = newVal;
            prepareDraw();
        }

        if (ev.target.type === 'checkbox') {
            // Checkbox 'Subdivide'
            isSubdivision = ev.target.checked;
            if (!isSubdivision && divideSlider.value > 0) {
                divideSlider.value = 0;
                prepareDraw();
            }
            divideSlider.tabIndex = (isSubdivision) ? 0 : -1; // slider focusable only if visible
            const div = document.querySelector('.divide-slider__cont')
            div.classList.toggle('open', isSubdivision);
            ev.target.ariaChecked = isSubdivision;
        }
    }, debounceTime));
    gridSize.addEventListener('keydown', ev => {
        if (ev.key === 'Enter' && ev.target.type === 'checkbox') {
            // toggle the checked on Enter
            ev.target.checked = !ev.target.checked;
            ev.target.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    divideSlider.addEventListener('input', e => {
        const output = divideSlider.nextElementSibling;
        output.textContent = `${divideSlider.value}%`;
    });
    divideSlider.addEventListener('change', debounce(() => prepareDraw(), debounceTime));

    // Blocks' Types ********************************************

    // event listener for clicks on checkboxes -> select block type
    typesContainer?.addEventListener('change', (ev) => {
        if (ev.target.dataset.function) {
            ev.target.ariaChecked = ev.target.checked;
            updateActiveBlocks(ev.target.dataset.function, ev.target.checked)
        }
    });

    // being able to select a block type by focusing it and hitting 'Enter' key
    typesContainer?.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && settings.parentElement.classList.contains('open')) {
            const target = ev.target;
            if (target?.control) {
                // ev.target === label & target.control === checkbox
                target.control.checked = !target.control.checked;
                target.control.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    });

    // Blocks' Weight ********************************************
    // event listener for weights change
    weightsContainer.addEventListener('input', (ev) => {
        if (ev.target.dataset.function) {
            updateWeights(ev);
        }
    });

    // GLobal ********************************************

    // Intersection Observer on Weights ********************************************
    const intersectOptions = {
        root: null, // viewport
        rootMargin: '48px',
        threshold: [0.01, 0.75, 1.0]
    };

    const intersectTarget = document.querySelector('.weights');

    const intersectCallback = (entries, observerWeights) => {
        entries.forEach(entry => {
            const ratio = entry.intersectionRatio;
            if (ratio > observerWeights.thresholds[0] && ratio < observerWeights.thresholds[1]) {
                // first step : display & animate the arrow
                if (!intersectTarget.querySelector('#arrow-weights')) {
                    drawArrow();
                    const arrow = intersectTarget.querySelector('#arrow-weights');
                    animArrow(arrow);
                }
            }
            if (ratio > observerWeights.thresholds[1] && ratio < observerWeights.thresholds[2]) {
                // second step : fade out the arrow & stops the animation
                const arrow = intersectTarget.querySelector('#arrow-weights')
                animArrowFadeOut(arrow);
            }
            if (ratio >= observerWeights.thresholds[2]) {
                // third step : remove the arrow & the intersectionObserver (the arrow is displayed only once)
                observerWeights.unobserve(intersectTarget);
                // remove the arrow
                const arrow = intersectTarget.querySelector('#arrow-weights');
                arrow.remove();
            }
        })
    }

    const observerWeights = new IntersectionObserver(intersectCallback, intersectOptions);
    observerWeights.observe(intersectTarget);


    // Event listener for ESC key
    window.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && settings.parentElement.classList.contains('open')) {
            toggleMenu();
        }
    });

    // Buttons
    [
        [btnDraw, debounce(prepareDraw, debounceTime)],
        [btnDrawV, debounce(prepareDraw, debounceTime)],
        [btnMenu, toggleMenu],
        [btnExport, saveSVGFile],
        [btnExportV, saveSVGFile],
        [btnNewPalette, newPalette],
        [btnNewPaletteV, newPalette],
        [btnRandomWeights, randomizeWeights]
    ].forEach(([btn, fn]) => btn?.addEventListener('click', fn));

    btnRandomWeights?.addEventListener('mouseenter', randomWeightsAnim);
    btnRandomWeights?.addEventListener('mouseleave', randomWeightsAnim);
    btnNewPaletteV?.addEventListener('mouseenter', ev => animPalette(colorPalette));


    // By default, select 'drawRect' type with a weight of 1
    const defaultType = 'drawRect';
    const checkbox = typesContainer.querySelector(`[data-function='${defaultType}']`);
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    const slider = weightsContainer.querySelector(`[data-function='${defaultType}']`);
    slider.dispatchEvent(new Event('input', { bubbles: true }));


    // Color palette
    getColorPalette()
        .then(result => {
            colorPalette = result;
            let [bgInner, bgOuter] = setBgColors(colorPalette);
            if (!prefersReducedMotion) {
                animBgColors(bgInner, bgOuter)
            } else {
                document.documentElement.style.setProperty('--bg-inner', bgInner);
                document.documentElement.style.setProperty('--bg-outer', bgOuter);
                drawBg();
            }
            updateSwatches(colorPalette);
            document.querySelector('#loading').remove();
            prepareDraw();
            toggleMenu();
        });
});