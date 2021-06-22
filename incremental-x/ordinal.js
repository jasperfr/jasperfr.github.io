var base = 3;
let ordinals = [0];

function getOrdinal(number) {
    if(number >= base) {
        return `ω<sup>${getOrdinal(number - base)}</sup>`;
    }


    let rest = number % base;
    return rest;
}

function tick() {
    ordinals[0]++;

    for(let i = 0; i < ordinals.length; i++) {
        if(ordinals[i] >= base) {
            ordinals[i] = 0;
            if(ordinals[i + 1] === undefined) ordinals.push(1);
            else ordinals[i + 1] ++;
        }
    }

    let string = 'H<sub>';
    let sjoin = [];
    for(let i = ordinals.length - 1; i >= 0; i--) {
        let ord = ordinals[i];
        if(ord == 0) continue;
        sjoin.push(`${ord == 1 && i != 0 ? '' : ord}${i > 0 ? 'ω<sup>' + (i == 1 ? '' : getOrdinal(i)) + '</sup>' : ''}`);
    }
    string += sjoin.join('+');
    string += `</sub>(${base})`;
    $('.ordinal').html(string);
}

setInterval(tick, 17);
