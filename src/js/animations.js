export const animBgColors = (bgInner, bgOuter) => {
    gsap.to('body', {
        '--bg-inner': bgInner,
        '--bg-outer': bgOuter,
        duration: 0.5
    });
}

export const btnMenuOpen = (prefersReducedMotion) => {
    const duration = (prefersReducedMotion) ? 0 : 0.5;
    const lines = document.querySelectorAll('#btnMenu line');
    const tl = gsap.timeline({
        repeatRefresh: true,
        defaults: {
            duration: duration,
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
export const btnMenuClose = (prefersReducedMotion) => {
    const duration = (prefersReducedMotion) ? 0 : 0.5;
    const lines = document.querySelectorAll('#btnMenu line');
    const tl = gsap.timeline({
        repeatRefresh: true,
        defaults: {
            duration: duration,
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
        repeat: 1,
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

export const blockWeightSlideIn = (el) => {
    const tl = gsap.timeline()
    .to(el, {
        duration: 0.2,
        height: '3.5rem'
    })
    .to(el, {
        duration: 0.352,
        ease: 'back.out(1.2)',
        opacity: 1,
        xPercent: -100
    },)
}

export const animPalette = (colorPalette) => {
    const mySvg = document.querySelector('#palette');
    const spots = mySvg.querySelectorAll('.spots ellipse');

    const tl = gsap.timeline({
        ease: "power2.in",
    })
        .to(spots, {
            autoAlpha: 0,
            ease: "power2.out",
            duration: 0.5
        })
        .to(spots, {
            autoAlpha: 1,
            scale: 1.4,
            stagger: 0.2,
            fill: idx => colorPalette[idx],
            duration: 1.5
        });
}