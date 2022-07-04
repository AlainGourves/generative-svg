import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.38";
import { shuffleArray } from './utils.js';


/**
 *
 * @param {number} p probability for a block to be subdivised [0-100]
 * @returns {number[]} array of 100 items, p 1s and the rest is 0s
 */
const fillProbabilities = (p) => {
    let probabilities = new Array(100);
    probabilities.fill(0)
    for (let i = 0; i < p; i++) {
        probabilities[i] = 1
    }
    return shuffleArray(probabilities);
}

/**
 *
 * @param {number} w Grid's width in 'blocks'
 * @param {number} h Grid's height in 'blocks'
 * @param {number} squareSize Block's width in pixels
 * @param {number} p probability of dividing a block in 4
 * @returns {object[]}
 */
export const createTree = (w, h, squareSize, p = 0) => {
    const l = w * h;
    let tree = [];
    let possibles;

    if (p > 0) {
        possibles = fillProbabilities(p);
    }

    for (let i = 0; i < l; i++) {
        let x_pos = (i % w) * squareSize;
        let y_pos = Math.floor(i / w) * squareSize;
        let obj = {
            x: x_pos,
            y: y_pos,
            w: squareSize,
            children: []
        }

        if (p > 0) {
            // decide if there are children : 1 = yes | 0 = no
            if (possibles[random(0, 100, true)]) {
                let children = [];
                for (let j = 0; j < 4; j++) {
                    let x = x_pos + (j % 2) * squareSize / 2;
                    let y = y_pos + (Math.floor(j / 2) * squareSize / 2);
                    children.push({
                        x: x,
                        y: y,
                        w: squareSize / 2
                    })
                }
                obj.children = children;
            }
        }
        tree.push(obj)
    }
    return tree;
}