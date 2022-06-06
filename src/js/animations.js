export const setPageBackground = (palette) => {
    // Sets page's background gradient
    const bg = tinycolor
        .mix(palette[0], palette[1], 50)
        .desaturate(10)
        .toString();
    // lighter version
    const bgInner = tinycolor(bg)
        .lighten(10)
        .toString();
    // darker version
    const bgOuter = tinycolor(bg)
        .darken(10)
        .toString();
    gsap.to('body', {
        '--bg-inner': bgInner,
        '--bg-outer': bgOuter,
        duration: 0.5
    });
}

export const btnMenuOpen = () => {
    const lines = document.querySelectorAll('#btnMenu line');
    const tl = gsap.timeline({
        repeatRefresh: true,
        defaults: {
            duration: 0.5,
            ease: 'power2.out'
        }
    })
    .to('#btnMenu', {rotate: 180})
    .to(lines[0], {
        svgOrigin: '2px 2px',
        rotate: 45,
        scale : Math.sqrt(2)
    }, 0)
    .to(lines[1], {
        svgOrigin: '12px 12px',
        scale : 0,
        ease: 'back.out(1.5)'
    }, 0)
    .to(lines[2], {
        svgOrigin: '2px 22px',
        rotate: -45,
        scale : Math.sqrt(2)
    }, 0)
    return tl;
}
export const btnMenuClose = () => {
    const lines = document.querySelectorAll('#btnMenu line');
    const tl = gsap.timeline({
        repeatRefresh: true,
        defaults: {
            duration: 0.5,
            ease: 'power2.in'
        }
    })
    .to('#btnMenu', {rotate: 0})
    .to(lines[0], {
        rotate: 0,
        scale : 1
    }, 0)
    .to(lines[1], {
        scale : 1,
        ease: 'back.in(1.5)'
    }, 0)
    .to(lines[2], {
        rotate: 0,
        scale : 1
    }, 0)
    return tl;
}