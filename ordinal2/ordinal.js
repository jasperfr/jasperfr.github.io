function toBase(number, base) {
    if (number == 0) return 0;

    let ordinals = [number];
    for(let i = 0; i < ordinals.length; i++) {
        let ord = ordinals[i];
        let cut = Math.floor(ord / base);
        let rem = ord % base;
        if(cut > 0)
            if (ordinals[i + 1] === undefined) ordinals.push(cut);
            else ordinals[i + 1] += cut;
        ordinals[i] = rem;
    }
    return parseInt(ordinals.reverse().join(''));
}

function getOrdinal5(number) {
    if(Math.floor(number) == 0) {
        return '';
    }
    if(number < 10) {
        return `ω<sup>${number == 1 ? '' : number}</sup>`;
    } else if (number < 100) {
        let div = Math.floor(number / 10);
        let mod = number % 10;
        return `ω<sup>ω${div==1?'':div}${mod==0?'':'+'+mod}</sup>`;
    } else if (number < 1000) {
        let sb = [], str = number.toString().split('').reverse().join('');
        //w^5, w^4, w^3, w^2, w^1 (=w), w^0 (=1)...
        for(let i = str.length - 1; i >= 0; i--) {
            let s = str[i];
            if(s == 0) continue;
            switch(i) {
                case 0: sb.push(s); break;
                case 1: sb.push(`ω${s == 1 ? '' : s}`); break;
                default: sb.push(`ω<sup>${i}</sup>${s == 1 ? '' : s}`); break;
            }
        }
        sb = sb.join('+');

        return `ω<sup>${sb}</sup>`;
    } else if (number == 1000) {
        return 'ω<sup>ω<sup>ω</sup></sup>'
    } else return ''
}

function getORD(ordinals, base) {
    if(ordinals.length > 3) return Infinity;
    switch (ordinals.length) {
        case 1:
            return Math.floor(base + ordinals[0]);
        case 2:
            return Math.floor(2 ** ordinals[1]) * (base + ordinals[0]);
        case 3:
            let c = ((2 ** ordinals[1]) * (base + ordinals[0]));
            let sum = c;
            for(let a = 1; a <= ordinals[2]; a++) {
                let q = c;
                for(let b = 0; b < a; b++) {
                    q = Math.pow(2, q);
                }
                sum *= q;
            }
            return Math.floor(sum);
    }
    return 0;
}

function getOP(ordinals, base) {
    let op = 0;
    for(let i = 0; i < ordinals.length; i++) {
        op += ordinals[i] * Math.pow(10, toBase(i, base));
    }
    return Math.floor(op);
}

function createOrdinalHtml(ordinals, base) {
    if(ordinals.length == 1 && ordinals[0] == 0) return `H<sub>0</sub> (${base})`;
    let string = 'H<sub>', sjoin = [];
    for(let i = ordinals.length - 1; i >= 0; i--) {
        let ord = ordinals[i];
        if(ord == 0) continue;
        sjoin.push(`<span>${getOrdinal5(toBase(i, base))}${(i > 0 && ord == 1) ? '' : Math.floor(ord)}</span>`);
    }
    string += sjoin.join('+');
    string += `</sub> (${base}) `;

    // calculate the ordinal (quick and dirty)
    switch (ordinals.length) {
        case 1:
            string += `= ${Math.floor(base + ordinals[0])}`;
            break;
        case 2:
            string += `= ${Math.floor((2 ** ordinals[1]) * (base + ordinals[0]))}`;
            break;
        case 3:
            let c = ((2 ** ordinals[1]) * (base + ordinals[0]));
            let sum = c;
            for(let a = 1; a <= ordinals[2]; a++) {
                let q = c;
                for(let b = 0; b < a; b++) {
                    q = Math.pow(2, q);
                }
                sum *= q;
            }
            sum = Math.floor(sum);
            if(sum > 1e8) sum = sum.toExponential(4).replace('+', '');
            if(sum == Infinity) break;
            string += `= ${sum}`;
            break;
    }

    return string;
}
