// Primitives functions
import { random } from "https://cdn.skypack.dev/@georgedoescode/generative-utils@1.0.38";

export const drawRect = (group, x, y, w, foreground, background) => {
    // Create group element
    group.addClass('draw-rect');
    // Draw block
    group.rect(w, w).fill(background).stroke('none').move(x, y);
}

export const drawCircle = (group, x, y, w, foreground, background) => {
    group.addClass('draw-circle');
    // draw background
    group.rect(w, w).fill(background).move(x, y);
    // foreground
    group.circle(w).fill(foreground).move(x, y);
}

export const drawOppositeCircles = (group, x, y, w, foreground, background) => {
    group.addClass('opposite-circles');
    group.rect(w, w).fill(background).move(x, y);
    // mask
    const mask = group.rect(w, w).fill('#fff').move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.circle(w).fill(foreground).center(x, y); //Bottom left
    circleGroup.circle(w).fill(foreground).center(x + w, y + w); // top right
    // assign mask
    circleGroup.maskWith(mask);
    if (random(0, 1, true)) circleGroup.rotate(90)
    group.add(circleGroup);
}

export const drawFacingCircles = (group, x, y, w, foreground, background) => {
    group.addClass('facing-circles');
    group.rect(w, w).fill(background).move(x, y);
    // mask
    const mask = group.rect(w, w).fill('#fff').move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.circle(w).fill(foreground).center(x, y + w / 2);
    circleGroup.circle(w).fill(foreground).center(x + w, y + w / 2);
    circleGroup.maskWith(mask);
    if (random(0, 1, true)) circleGroup.rotate(90)
    group.add(circleGroup);
}

export const drawSemiCircle = (group, x, y, w, foreground, background) => {
    group.addClass('semi-circles');
    group.rect(w, w).fill(background).move(x, y);
    // group for the circles
    const circleGroup = group.group();
    circleGroup.path(`M${x} ${y} a ${w / 2} ${w / 2} 0 0 1 0 ${w} z`).fill(foreground);
    circleGroup.path(`M${x + w / 2} ${y} a ${w / 2} ${w / 2} 0 0 1 0 ${w} z`).fill(foreground);
    const dir = random(0, 3, true);
    circleGroup.rotate(dir * 90);
    group.add(circleGroup);
}

export const drawDisc = (group, x, y, w, foreground, background) => {
    group.addClass('disc');
    // group for the circles
    const circleGroup = group.group();
    group.rect(w, w).fill(background).move(x, y);
    circleGroup.circle(w).fill(foreground).move(x, y)
    // mask
    const bg = group.rect(w, w).fill('#fff').move(x, y);
    const hole = group.circle(w / 2).fill('black').center(x + w / 2, y + w / 2);
    const mask = group.mask().add(bg).add(hole);
    circleGroup.maskWith(mask);
    group.add(circleGroup);
}

export const drawOppositeTriangles = (group, x, y, w, foreground, background) => {
    group.addClass('opposite-triangles');
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
    if (random(0, 1, true)) group.flip('x');
    group.add(triangleGroup);
}