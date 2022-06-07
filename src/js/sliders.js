class Sliders {
    constructor() {

    }
}

/*
const sumArray = (arr) => {
    return arr.reduce((prev, curr) => prev + curr);
};

const printVals = () => {
    theWeights.forEach((v, i) => {
        weigthSliders[i].nextElementSibling.value = v.toFixed(2);
    });
};

const updateWeights = (ev) => {
    const newVal = parseFloat(ev.target.value);
    const idx = Array.from(weigthSliders).findIndex((s) => s === ev.target);
    let diff = newVal - theWeights[idx];
    theWeights[idx] = newVal;

    if (sumArray(theWeights) > 1) {
        if (diff > 0) {
            let n = theWeights.filter((v) => v > 0).length - 1;
            result = theWeights.map((v, i) => {
                if (i === idx || v === 0) return v;
                let res = v - diff / n;
                if (res < 0) {
                    diff += Math.abs(res);
                    res = 0;
                }
                return res;
            });
        } else {
            let n = theWeights.length - 1;
            result = theWeights.map((v, i) => {
                if (i === idx || v === 0) return v;
                let res = v - diff / n;
                if (res < 0) {
                    diff += Math.abs(res);
                    res = 0;
                }
                return res;
            });
        }
        // nettoyage
        result.forEach((v, i) => {
            if (v < 0) result[i] = 0;
            if (v > 1) result[i] = 1;
        });
        weigthSliders.forEach((s, i) => (s.value = result[i]));
        theWeights = result;
    }
    printVals();
};
*/