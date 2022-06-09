// Primitives functions
import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.38";

/*
*   Functions params:
*   - group: ref to the SVG's group we're drawing in
*   - x, y : coordinates
*   - w: width of containing square
*   - foreground, background : colors
*   - randomize: bool (default false) to know if we have to randomize the orientation of the block
*/

export const drawRect = (group, x, y, w, foreground, background, randomize = false) => {
    // Create group element
    group.addClass('block draw-rect');
    // Draw block
    group.rect(w, w).fill(foreground).stroke('none').move(x, y);
}

export const drawCircle = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block draw-circle');
    // draw background
    group.rect(w, w).fill(background).move(x, y);
    // foreground
    group.circle(w).fill(foreground).move(x, y);
}

export const drawOppositeCircles = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block opposite-circles');
    group.rect(w, w).fill(background).move(x, y);
    // mask
    const mask = group.rect(w, w).fill('#fff').move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.circle(w).fill(foreground).center(x, y); //Bottom left
    circleGroup.circle(w).fill(foreground).center(x + w, y + w); // top right
    // assign mask
    circleGroup.maskWith(mask);
    if (randomize && random(0, 1, true)) circleGroup.rotate(90)
    group.add(circleGroup);
}

export const drawFacingCircles = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block facing-circles');
    group.rect(w, w).fill(background).move(x, y);
    // mask
    const mask = group.rect(w, w).fill('#fff').move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.circle(w).fill(foreground).center(x, y + w / 2);
    circleGroup.circle(w).fill(foreground).center(x + w, y + w / 2);
    circleGroup.maskWith(mask);
    if (randomize && random(0, 1, true)) circleGroup.rotate(90)
    group.add(circleGroup);
}

export const drawSemiCircle = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block semi-circles');
    group.rect(w, w).fill(background).move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.path(`M${x} ${y} a ${w / 2} ${w / 2} 0 0 1 0 ${w} z`).fill(foreground);
    circleGroup.path(`M${x + w / 2} ${y} a ${w / 2} ${w / 2} 0 0 1 0 ${w} z`).fill(foreground);
    if (randomize) {
        const dir = random(0, 3, true);
        circleGroup.rotate(dir * 90);
    }
    group.add(circleGroup);
}

export const drawDisc = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block disc');
    // group for the circles
    const circleGroup = group.group();
    group.rect(w, w).fill(background).move(x, y);
    circleGroup.circle(w).fill(foreground).move(x, y)
    circleGroup.circle(w / 2).fill(background).center(x + w / 2, y + w / 2);
    group.add(circleGroup);
}

export const drawOppositeTriangles = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block opposite-triangles');
    group.rect(w, w).fill(background).move(x, y);
    const points = [
        // top-left
        [x, y, x + (w / 2), y, x, y + (w / 2)],
        //bottom-right
        [x + w, y + w, x + (w / 2), y + w, x + w, y + (w / 2)]
    ];
    // group for the triangles
    const triangleGroup = group.group();
    //triangles
    triangleGroup.polygon(points[0]).fill(foreground).move(x, y); //Bottom left
    triangleGroup.polygon(points[1]).fill(foreground); //.move(x, y); // top right
    if (randomize && random(0, 1, true)) group.flip('x');
    group.add(triangleGroup);
}

export const drawLeaf = (group, x, y, w, foreground, background, randomize = false) => {
    group.addClass('block leaf');
    group.rect(w, w).fill(background).move(x, y);
    // group for the leaf
    const leafGroup = group.group();
    leafGroup.path(`m${x} ${y} h${w/2} a${w/2} ${w/2} 0 0 1 ${w/2} ${w/2} v${w/2} h${-w/2} a${w/2} ${w/2} 0 0 1 ${-w/2} ${-w/2} v${-w/2}  z`).fill(foreground);
    if (randomize && random(0, 1, true)) leafGroup.rotate(90)

    group.add(leafGroup);
}