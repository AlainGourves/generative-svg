import * as blockFn from './blocks.js';

// Array des noms des fonctions du module Blocks
const drawFunctions = Object.keys(blockFn);

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
        .width(20)
        .height(20)
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .viewbox(`0 0 20 20`);

    // const bg = window.getComputedStyle(document.documentElement).getPropertyValue('--clr-block-sample-bg');
    // const fg = window.getComputedStyle(document.documentElement).getPropertyValue('--clr-block-sample-fg');
    const defs = library.defs()
    for (let i = 0; i < drawFunctions.length; i++) {
        const group = defs.symbol();
        let id = getBlockId(drawFunctions[i]);
        group.attr('id', id);
        group.element('desc').words(`${id} icon`);
        blockFn[drawFunctions[i]](group, 0, 0, 20, 9, 8);
    }
}

export const init = () => {
    createSVGLibrary();

    // Afficher les différents type de bloc
    drawFunctions.forEach((obj, idx) => {
        const clone = blockTypeTemplate.content.cloneNode(true);
        const check = clone.querySelector('input[type=checkbox]');
        const label = clone.querySelector('label');
        label.tabIndex="0"
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