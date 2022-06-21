import {
    computePosition,
    autoPlacement,
    shift,
    offset,
    arrow,
} from 'https://cdn.skypack.dev/@floating-ui/dom@latest';

// TODO: sélection plus fine des éléments !!!
const btns = document.querySelectorAll('button');

const setupTooltip = (button, tooltip) => {
    const arrowEl = tooltip.querySelector('.arrow');
    computePosition(button, tooltip, {
        placement: 'bottom',
        middleware: [
            offset(5), // offset % au "parent" (en px), offset doit être placé au début parce que les calculs de chaque middleware se font dans l'ordre d'apparition dans le array
            autoPlacement(),
            shift({ padding: 5 }), // décale le contenu s'il est masqué. (padding: décalage en px % aux bords)
            arrow({ element: arrowEl })
        ],
        strategy: 'fixed',
    }).then(({ x, y, placement, middlewareData }) => {
        Object.assign(tooltip.style, {
            top: '0',
            left: '0',
            transform: `translate(${Math.round(x)}px,${Math.round(y)}px)`,
        });

        const { x: arrowX, y: arrowY } = middlewareData.arrow;
        const staticSide = {
            top: 'bottom',
            right: 'left',
            bottom: 'top',
            left: 'right',
        }[placement.split('-')[0]];

        Object.assign(arrowEl.style, {
            left: (arrowX !== null) ? `${arrowX}px` : '',
            top: (arrowY !== null) ? `${arrowY}px` : '',
            right: '',
            bottom: '',
            [staticSide]: '-4px',
        });
    });
}

const showTooltip = (ev) => {
    const btn = ev.target;
    const tooltip = btn.nextElementSibling;
    tooltip.style.display = 'block';
    setupTooltip(btn, tooltip);
}

const hideTooltip = (ev) => {
    const btn = ev.target;
    const tooltip = btn.nextElementSibling;
    tooltip.style.display = 'none';
}

window.addEventListener("load", e => {
    const tooltips = document.querySelectorAll('[role="tooltip"]');
    tooltips.forEach(tt => {
        // Ajoute les div.arrow aux tooltips
        const arrow = document.createElement('div');
        arrow.className = 'arrow';
        tt.appendChild(arrow);
    })

    btns.forEach(btn => {
        [
            ["mouseenter", showTooltip],
            ["mouseleave", hideTooltip],
            ['focus', showTooltip],
            ['blur', hideTooltip],
        ].forEach(([event, listener]) => {
            btn.addEventListener(event, listener);
        });
    })
});