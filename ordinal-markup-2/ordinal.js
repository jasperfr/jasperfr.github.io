let ordinals = [0];
let base = 3;
let op = 0;

function toBase(number) {
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
    if(number == 0) {
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

function update() {
    
    for(let i = 0; i < ordinals.length; i++) {
        let ord = ordinals[i];
        let cut = Math.floor(ord / base);
        let rem = ord % base;
        if(cut > 0)
            if (ordinals[i + 1] === undefined) ordinals.push(cut);
            else ordinals[i + 1] += cut;
        ordinals[i] = rem;
    }

    let string = 'H<sub>';
    let sjoin = [];
    
    let j = 0;
    for(let i = ordinals.length - 1; i >= 0; i--) {
        let ord = ordinals[i];
        if(ord == 0) continue;
        j++;
        if(j > 3) continue;
        sjoin.push(`<span>${getOrdinal5(toBase(i))}${(i > 0 && ord == 1) ? '' : Math.floor(ord)}</span>`);
    }

    let s = ordinals.slice();

    /*
    op = base;
    for(let i = 0; i < ordinals.length; i++) {
        op += ordinals[i] * Math.pow(10, toBase(i));
    }
    */
   let num = Math.pow(2, (ordinals[1] || 0)) * (base + ordinals[0]);
   for(let a = 0; a < (ordinals[2] || 0); a++) {
       let power = 2;
       for(let b = 0; b < a; b++) {
           power = Math.pow(power, 2);
       }
       num *= Math.pow(power, Math.pow(2, (ordinals[1] || 0)) * (base + ordinals[0]));
   }
   op = num;

   let moop = '';
   if(ordinals.length == 1) {
       moop = `${base + ordinals[0]}`;
   } else if (ordinals.length == 2) {
            if(ordinals[1] == 0) {
                moop += base + ordinals[0];
            } else if (ordinals[1] == 1) {
                moop += (base + ordinals[0]) * 2;
            } else if (ordinals[1] == 2) {
                moop += (base + ordinals[0]) * 4;
            } else {
                moop += `2<sup>${ordinals[1]}</sup>⋅${base + ordinals[0]}`;
            }
   } else if (ordinals.length == 3) {
       for(let a = ordinals[2]; a >= 0; a--) {
            for(let b = 0; b < a; b++) {
                moop += '2<sup>';
            }

            if(ordinals[1] == 0) {
                moop += base + ordinals[0];
            } else if (ordinals[1] == 1) {
                moop += (base + ordinals[0]) * 2;
            } else if (ordinals[1] == 2) {
                moop += (base + ordinals[0]) * 4;
            } else {
                moop += `2<sup>${ordinals[1]}</sup>⋅${base + ordinals[0]}`;
            }
            
            for(let b = 0; b < a; b++) {
                moop += '</sup>';
            }

            if(a != 0 ) moop += '⋅';
       }
   }

    string += sjoin.join('+');
    if(ordinals.length >= 28 && base == 3) {
        string = `H<sub>ψ</sub>(Ω) (3)`;
    } else {
        string += `</sub>${j > 3 ? '...' : ''} (${base}) ${moop == '' ? '' : '= ' + moop} = ${op.toExponential(4).replace('e+', 'x10^')}`;
    }
    $('.ordinal').html(string);
}

function up() {
    ordinals[0] += 1e+12;
    update();
}

$(() => {
    update();
});