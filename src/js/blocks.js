import { random } from '@georgedoescode/generative-utils';

/*
*   Functions params:
*   - group: ref to the SVG's group we're drawing in
*   - x, y : coordinates
*   - w: width of containing square
*   - foreground, background : colors
*   - randomize: bool (default false) to know if we have to randomize the orientation of the block
*   template:
export const fn = (group, x, y, w, foreground, background, randomize = false) => { }

* Functions:
*   - drawArc
*   - drawCircle
*   - drawDiamond
*   - drawDisc
*   - drawDroplet
*   - drawFacingCircles
*   - drawLeaf
*   - drawOppositeCircles
*   - drawOppositeTriangles
*   - drawPoints
*   - drawQuarterRing
*   - drawRect
*   - drawRoundedBar
*   - drawRoundedBarSemiCircle
*   - drawSemiCircle
*   - drawTriangles
*   - drawWave
*   - drawCross
*   - drawPolkaDot
*   - drawArch
*   - drawCroissant
*/

export const drawRect = (group, x, y, w, foreground, background, randomize = false) => {
    // Create group element
    group.addClass('block draw-rect');
    // Draw block
    group.rect(w, w).addClass(`clr${foreground}`).stroke('none').move(x, y);
}

export const drawCircle = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block draw-circle');
    // draw background
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    // foreground
    group.circle(w).addClass(`clr${foreground}`).move(x, y);
}

export const drawOppositeCircles = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block opposite-circles');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.path(`M${x + w} ${y + w / 2} a${w / 2} ${w / 2} 0 0 0 -${w / 2} ${w / 2} h${w / 2} z`).addClass(`clr${foreground}`); //Bottom left
    circleGroup.path(`M${x + w / 2} ${y} a${w / 2} ${w / 2} 0 0 1 -${w / 2} ${w / 2} v-${w / 2} z`).addClass(`clr${foreground}`); // top right
    if (randomize && random(0, 1, true)) circleGroup.rotate(90)
    // group.add(circleGroup);
}

export const drawFacingCircles = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block facing-circles');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.path(`M${x} ${y} a${w / 2} ${w / 2} 0 0 1 0 ${w} v-${w} z`).addClass(`clr${foreground}`);
    circleGroup.path(`M${x + w} ${y} a${w / 2} ${w / 2} 0 0 0 0 ${w} v-${w} z`).addClass(`clr${foreground}`);
    if (randomize && random(0, 1, true)) circleGroup.rotate(90)
    // group.add(circleGroup);
}

export const drawSemiCircle = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block semi-circles');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.path(`M${x} ${y} a${w / 2} ${w / 2} 0 0 1 0 ${w} z`).addClass(`clr${foreground}`);
    circleGroup.path(`M${x + w / 2} ${y} a${w / 2} ${w / 2} 0 0 1 0 ${w} z`).addClass(`clr${foreground}`);
    if (randomize) {
        const dir = random(0, 3, true);
        circleGroup.rotate(dir * 90);
    }
    // group.add(circleGroup);
}

export const drawDisc = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block disc');
    // group for the circles
    const circleGroup = group.group();
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    circleGroup.circle(w).addClass(`clr${foreground}`).move(x, y)
    circleGroup.circle(w / 2).addClass(`clr${background}`).center(x + w / 2, y + w / 2);
    group.add(circleGroup);
}

export const drawOppositeTriangles = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block opposite-triangles');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    const points = [
        // top-left
        [x, y, x + (w / 2), y, x, y + (w / 2)],
        //bottom-right
        [x + w, y + w, x + (w / 2), y + w, x + w, y + (w / 2)]
    ];
    // group for the triangles
    const triangleGroup = group.group();
    //triangles
    triangleGroup.polygon(points[0]).addClass(`clr${foreground}`).move(x, y); //Bottom left
    triangleGroup.polygon(points[1]).addClass(`clr${foreground}`); //.move(x, y); // top right
    if (randomize && random(0, 1, true)) group.flip('x');
    // group.add(triangleGroup);
}

export const drawTriangles = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block triangles');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    const points = [x, y, x + w, y + w, x, y + w];
    group.polygon(points).addClass(`clr${foreground}`);
    if (randomize) {
        const dir = random(0, 3, true);
        group.rotate(dir * 90);
    }
}

export const drawLeaf = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block leaf');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    group.path(`m${x} ${y} h${w / 2} a${w / 2} ${w / 2} 0 0 1 ${w / 2} ${w / 2} v${w / 2} h${-w / 2} a${w / 2} ${w / 2} 0 0 1 ${-w / 2} ${-w / 2} v${-w / 2}  z`).addClass(`clr${foreground}`);
    if (randomize && random(0, 1, true)) group.rotate(90)
}

export const drawRoundedBar = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block rounded-bar');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    group.path(`m${x} ${y} a${w / 2} ${w / 2} 0 0 1 ${w / 2} ${w / 2} v${w / 2} h${-w / 2} v${-w}  z`).addClass(`clr${foreground}`);
    if (randomize) {
        const dir = random(0, 3, true);
        group.rotate(dir * 90);
    }
}

export const drawArc = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block arc');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    group.path(`m${x} ${y} a${w} ${w} 0 0 1 ${w} ${w} h${-w}  z`).addClass(`clr${foreground}`);
    if (randomize) {
        const dir = random(0, 3, true);
        group.rotate(dir * 90);
    }

}

export const drawRoundedBarSemiCircle = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block rounded-bar');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    // group for the leaf
    const roundedBarGroup = group.group();
    roundedBarGroup.path(`m${x} ${y} a${w / 2} ${w / 2} 0 0 1 ${w / 2} ${w / 2} v${w / 2} h${-w / 2} v${-w}  z`).addClass(`clr${foreground}`);
    roundedBarGroup.path(`M${x + w} ${y} a${w / 2} ${w / 2} 0 0 0 0 ${w} z`).addClass(`clr${foreground}`);
    if (randomize) {
        const dir = random(0, 3, true);
        group.rotate(dir * 90);
    }
}

export const drawDroplet = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block droplet');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    group.path(`m${x} ${y + w / 2} a${w / 2} ${w / 2} 0 1 1 ${w / 2} ${w / 2} h${-w / 2} v${-w / 2}  z`).addClass(`clr${foreground}`);
    if (randomize) {
        const dir = random(0, 3, true);
        group.rotate(dir * 90);
    }
}

export const drawQuarterRing = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block quarter-ring');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    group.path(`m${x} ${y + w} a${w} ${w} 0 0 1 ${w} ${-w} v${w / 2} a${w / 2} ${w / 2} 0 0 0 ${-w / 2} ${w / 2} h${-w / 2} z`).addClass(`clr${foreground}`);
    if (randomize) {
        const dir = random(0, 3, true);
        group.rotate(dir * 90);
    }
}

export const drawDiamond = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block diamond');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    const points = [x, y + w / 2, x + w / 2, y, x + w, y + w / 2, x + w / 2, y + w];
    group.polygon(points).addClass(`clr${foreground}`);
}

export const drawPoints = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block points');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    const circles = group.group();
    let u = w / 6;
    let v = w / 6;
    for (let i = 1; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            circles.circle(w / 6).addClass(`clr${foreground}`).center(x + u, y + v);
            u += 2 * w / 6;
        }
        u = w / 6;
        v += 2 * w / 6;
    }
}

export const drawWave = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block points');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    group.path(`m${x} ${y + w} q0 -${w / 3} ${w / 3} -${w / 3} q ${w / 3} 0 ${w / 3} -${w / 3} q0 -${w / 3} ${w / 3} -${w / 3} v ${w} z`).addClass(`clr${foreground}`);
    if (randomize) {
        const dir = random(0, 3, true);
        group.rotate(dir * 90);
    }
}

export const drawStripes = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block stripes');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    const stripes = group.group();
    stripes.rect(w, w / 6).addClass(`clr${foreground}`).move(x, y + w / 12);
    stripes.rect(w, w / 6).addClass(`clr${foreground}`).move(x, y + (5 * w / 12));
    stripes.rect(w, w / 6).addClass(`clr${foreground}`).move(x, y + (9 * w / 12));
    if (randomize) {
        group.rotate(random(0, 1, true) * 90);
    }
}

export const drawCross = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block cross');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    group.path(`m${x} ${y} h${w / 4} l${w / 4} ${w / 4} l${w / 4} ${-w / 4} h${w / 4}  v${w / 4} l${-w / 4} ${w / 4} l${w / 4} ${w / 4}  v${w / 4}  h${-w / 4} l${-w / 4} ${-w / 4} l${-w / 4} ${w / 4} h${-w / 4} v${-w / 4} l${w / 4} ${-w / 4} l${-w / 4} ${-w / 4} z`).addClass(`clr${foreground}`);
}

export const drawPlus = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block plus');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    group.path(`m${x + w / 4} ${y} h${w / 2} v${w / 4} h${w / 4} v${w / 2} h${-w / 4} v${w / 4} h${-w / 2} v${-w / 4}  h${-w / 4} v${-w / 2} h${w / 4} z`).addClass(`clr${foreground}`);
}

export const drawPolkaDot = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block polka');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    const polkaGroup = group.group();
    polkaGroup.addClass(`clr${foreground}`);
    polkaGroup.path(`m${x + (w / 4)} ${y} a${w / 4} ${w / 4} 0 0 0 ${w / 2} 0  z`);
    polkaGroup.path(`m${x + (w / 4)} ${y + w} a${w / 4} ${w / 4} 0 0 1 ${w / 2} 0  z`);
    polkaGroup.path(`m${x} ${y + (w / 4)} a${w / 4} ${w / 4} 0 0 1 0 ${w / 2}  z`);
    polkaGroup.path(`m${x + w} ${y + (w / 4)} a${w / 4} ${w / 4} 0 0 0 0 ${w / 2}  z`);
}

export const drawArch = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block arch');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    group.path(`m${x} ${y + w} a${w} ${w} 0 0 1 ${w / 2} ${-w * Math.sqrt(3) / 2} a${w} ${w} 0 0 1 ${w / 2} ${w * Math.sqrt(3) / 2}  z`).addClass(`clr${foreground}`);
    if (randomize) {
        const dir = random(0, 3, true);
        group.rotate(dir * 90);
    }
}

// export const drawParabola = (group, x, y, w, foreground, background, randomize = false) => {
//     group.addClass('block parabola');
//     group.rect(w, w).addClass(`clr${background}`).move(x, y);
//     group.path(`m${x} ${y} q${w / 2} ${w * 2} ${w} 0 z`).addClass(`clr${foreground}`);
//     if (randomize) {
//         const dir = random(0, 3, true);
//         group.rotate(dir * 90);
//     }
// }

export const drawLotus = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block lotus');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    group.path(`m${x} ${y} a${w / 2} ${w / 2} 0 0 1 ${w / 2}  ${w / 2} a${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-w / 2} v${w / 2} a${w / 2} ${w / 2} 0 0 1 ${-w} 0 z`).addClass(`clr${foreground}`);
    if (randomize) {
        group.rotate(random(0, 3, true) * 90);
    }
}

export const drawCroissant = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block croissant');
    group.rect(w, w).addClass(`clr${background}`).move(x, y);
    // group.path(`m${x} ${y  + w / 2} q${w / 2} ${-w} ${w} 0 q${-w / 2} ${w} ${-w} 0  z`).addClass(`clr${foreground}`);
    // group.path(`m${x + w / 2} ${y} c0 0 ${-w / 2} 0 ${-w / 2} ${w} 0 ${-w / 2} ${w} ${-w / 2} ${w} 0 0 ${-w} ${-w / 2} ${-w} ${-w / 2} ${-w} z`).addClass(`clr${foreground}`);
    group.path(`m${x + w / 2} ${y} c0 0 ${-w / 2} 0 ${-w / 2} ${w} a${w / 2} ${w / 2} 0 0 1 ${w} 0 c0 ${-w} ${-w / 2} ${-w} ${-w / 2} ${-w} z`).addClass(`clr${foreground}`);
    if (randomize) {
        group.rotate(random(0, 3, true) * 90);
    }
}
