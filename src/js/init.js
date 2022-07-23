import * as blockFn from './blocks.js';

// Array des noms des fonctions du module Blocks __triés__
const drawFunctions = Object.keys(blockFn).sort();

const typesContainer = document.querySelector('.select-block-type');
const blockTypeTemplate = document.querySelector('#bloc-type__tmpl');


export const getBlockId = (str) => {
    // renvoie le nom de la fonction sans 'draw' & initiale bdc
    return str.substring(4, 5).toLowerCase() + str.substring(5);
}

const createSVGLibrary = () => {
    // Create a SVG with defs for all blocks types
    const library = SVG()
        .addTo('body')
        .size(40, 40)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .viewbox(`0 0 40 40`);

    const defs = library.defs()
    for (let i = 0; i < drawFunctions.length; i++) {
        const group = defs.symbol();
        let id = getBlockId(drawFunctions[i]);
        group.attr('id', id);
        group.element('title').words(`Icon for ${id} block`);
        blockFn[drawFunctions[i]](group, 0, 0, 20, 9, 8);
    }

    // Big arrow
    const arrow = defs.symbol();
    arrow.attr('id', 'big-arrow');
    arrow.path('m 39.5 9 l -12.5 2 l 1 -10 h -16 l 1 10 l -12.5 -2 l -0.5 0.5 c 6 6.5 19.5 28 20 28 s 14 -21.5 20 -28 l -0.5 -0.5 z').addClass('bobby');
}

export const init = () => {
    createSVGLibrary();

    // Afficher les différents type de bloc
    drawFunctions.forEach((_, idx) => {
        const clone = blockTypeTemplate.content.cloneNode(true);
        const check = clone.querySelector('input[type=checkbox]');
        const label = clone.querySelector('label');
        label.tabIndex = "0"
        const block = clone.querySelector('.block-type');
        const name = `type${idx}`
        check.id = name;
        check.dataset.function = drawFunctions[idx];
        label.htmlFor = name;
        const draw = SVG().addTo(block).viewbox('0 0 20 20');
        draw.use(getBlockId(drawFunctions[idx]));
        typesContainer.appendChild(clone);
    });
}