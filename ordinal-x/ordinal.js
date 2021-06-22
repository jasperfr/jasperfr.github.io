let ordinals = [0];

function toBase(number) {
    if (number == 0) return 0;

    let ordinals = [number];
    for(let i = 0; i < ordinals.length; i++) {
        let ord = ordinals[i];
        let cut = Math.floor(ord / Game.base);
        let rem = ord % Game.base;
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
        let cut = Math.floor(ord / Game.base);
        let rem = ord % Game.base;
        if(cut > 0)
            if (ordinals[i + 1] === undefined) ordinals.push(cut);
            else ordinals[i + 1] += cut;
        ordinals[i] = rem;
    }

    let string = 'φ<sub>';
    let sjoin = [];
    
    let j = 0;
    for(let i = ordinals.length - 1; i >= 0; i--) {
        let ord = ordinals[i];
        if(ord == 0) continue;
        j++;
        if(j > 3) continue;
        sjoin.push(`<span>${getOrdinal5(toBase(i))}${(i > 0 && ord == 1) ? '' : ord}</span>`);
    }

    let s = ordinals.slice();
    Game.OP = new Exadecimal(0);
    for(let i = 0; i < ordinals.length; i++) {
        Game.OP.add(ordinals[i] * Math.pow(10, toBase(i)));
    }

    if(Game.OP.toString() == '∞') {
        $('.ordinal').html('φ<sub>ω<sup>ω<sup>ω</sup></sup></sub> = ∞μ');
        $('div.singularity').show();
        return;
    } else {
        $('div.singularity').hide();
    }

    string += sjoin.join('+');
    string += `</sub>${j > 3 ? '...' : ''}<sup class="base">${Game.base}</sup> = ${Game.OP.toString()}μ`;
    $('.ordinal').html(string);
}

$(() => {
    setInterval(update, 17);
});
