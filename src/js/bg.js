import * as blockFn from './blocks.js';
import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.38";
import weightedRandom from './weightedRandom.js';
import {fillProbabilities, makeChildren} from './tree.js';


const bgTrees = [[{
    "x": 0,
    "y": 0,
    "w": 40
},
{
    "x": 40,
    "y": 0,
    "w": 40
},
{
    "x": 80,
    "y": 0,
    "w": 40
},
{
    "x": 120,
    "y": 0,
    "w": 40
},
{
    "x": 0,
    "y": 40,
    "w": 40
},
{
    "x": 40,
    "y": 40,
    "w": 40
},
{
    "x": 0,
    "y": 80,
    "w": 40
},
{
    "x": 40,
    "y": 80,
    "w": 40
},
{
    "x": 0,
    "y": 120,
    "w": 40
}
],[{
    "x": 120,
    "y": 0,
    "w": 40
},
{
    "x": 80,
    "y": 40,
    "w": 40
},
{
    "x": 120,
    "y": 40,
    "w": 40
},
{
    "x": 0,
    "y": 80,
    "w": 40
},
{
    "x": 40,
    "y": 80,
    "w": 40
},
{
    "x": 80,
    "y": 80,
    "w": 40
},
{
    "x": 120,
    "y": 80,
    "w": 40
}
]];
const bgSizes = [[4,4], [4,3]];
const bgFct = ['drawArc','drawDroplet','drawFacingCircles','drawLeaf','drawRoundedBar','drawRoundedBarSemiCircle','drawSemiCircle'];
const bgTypes = bgFct.map(fn => blockFn[fn]);
const bgWeights = [0.08, 0.16, 0.16, 0.17, 0.14, 0.18, 0.11];


const generateBlock = (root, x, y, w) => {
    const background = '-bg-trans';
    const foreground = '-bg';
    const blockFunction = weightedRandom(bgTypes, bgWeights);
    blockFunction(root, x, y, w, foreground, background, false);
}

export const drawBg = () => {
    const w = 40;

    // Ajoute des children
    const possibles = fillProbabilities(4);
    let images = [];

    bgTrees.forEach((tree, idx) => {
        const draw = SVG();
        draw.viewbox(`0 0 ${bgSizes[idx][0] * w} ${bgSizes[idx][1] * w}`);
        const style = draw.style();
        style.rule('.clr-bg', {fill: '#ffffff26'});
        style.rule('.clr-bg-trans', {fill: 'transparent'});
        const group = draw.group();
        tree.forEach(block => {
            if (possibles[random(0, 100, true)]) {
                block.children = makeChildren(block.x, block.y, block.w);
            }
            if (block?.children) {
                // group for subdivised block
                const gr = group.group();
                block.children.forEach(b => {
                    generateBlock(gr, b.x, b.y, b.w);
                })
            } else {
                generateBlock(group, block.x, block.y, block.w);
            }
        });
        let code = draw.svg()
        code = code.replace(/"/g, "'");
        images.push("url(\"data:image/svg+xml," + encodeURIComponent(code) + "\")")
    });

    let bgImg = window.getComputedStyle(document.body).backgroundImage;
    bgImg = [...images,bgImg].join(',');
    document.body.style.backgroundImage = bgImg;
    document.body.classList.add('svg');
}
