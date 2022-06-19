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

const btnMenuOpen = () => {
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
const btnMenuClose = () => {
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

export const toggleMenu = () => {
    const as = document.querySelector('aside');
    const btns = as.querySelectorAll('.btns button');
    if (as.classList.contains('open')) {
        btnMenuClose()
        as.classList.remove('open')
        btns.forEach(b => b.classList.add('btn__round'));
    } else {
        btnMenuOpen()
        articleSlideIn()
        as.classList.add('open')
        btns.forEach(b => b.classList.remove('btn__round'));
    }
}

export const randomWeightsAnim = () => {
    let lines = document.querySelectorAll('#random-weights line');
    const tl = gsap.timeline({ repeat: 2, yoyo: true });
    let arr = shuffleArray(Array.from(lines));
    arr.forEach(l => {
        tl.to(l, {
            attr: { x2: random(6, 18, true) },
            ease: "sine.inOut"
        })
    });
}