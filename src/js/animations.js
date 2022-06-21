import { shuffleArray } from './utils.js';

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

export const animBgColors = (bgInner, bgOuter) => {
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
        .to('#btnMenu', { rotate: 180 })
        .to(lines[0], {
            transformOrigin: '0 0',
            // svgOrigin: '2px 2px',
            rotate: 45,
            scaleX: Math.sqrt(2)
        }, 0)
        .to(lines[1], {
            transformOrigin: '50% 50%',
            // svgOrigin: '12px 12px',
            scale: 0,
            ease: 'back.out(1.5)'
        }, 0)
        .to(lines[2], {
            transformOrigin: '0 100%',
            // svgOrigin: '2px 22px',
            rotate: -45,
            scaleX: Math.sqrt(2)
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
        .to('#btnMenu', { rotate: 0 })
        .to(lines[0], {
            rotate: 0,
            scale: 1
        }, 0)
        .to(lines[1], {
            scale: 1,
            ease: 'back.in(1.5)'
        }, 0)
        .to(lines[2], {
            rotate: 0,
            scale: 1
        }, 0)
    return tl;
}

export const articleSlideIn = () => {
    const tl = gsap.timeline()
    tl.fromTo('aside article', {
        autoAlpha: 0,
        x: "100%"
    }, {
        autoAlpha: 1,
        x: 0,
        stagger: 0.1,
        ease: "power2.out"
    });
}

export const randomWeightsAnim = (ev) => {
    const mySvg = document.querySelector('#random-weights');
    const circles = mySvg.querySelectorAll('g circle');
    const circlesMask = mySvg.querySelectorAll('mask circle');
    let pos = [];
    const tl = gsap.timeline({
        ease: "power2.inOut",
        duration: 0.5,
        repeat: 2,
        repeatRefresh: true,
        ause: true,
        onStart: () => {
            for (let i = 0; i < circles.length; i++) {
                pos[i] = random(4, 20, true);
            }
        }
    })
    .to(circles, {
        attr: {
            cx: (idx) => pos[idx],
        }
    })
        .to(circlesMask, {
            attr: {
                cx: (idx) => pos[idx],
            }
        }, '<');
    if (ev.type === 'mouseenter') {
        tl.play()
    } else if (ev.type === 'mouseleave') {
        tl.pause();
    }
}