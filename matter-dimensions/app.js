/* https://community.shopify.com/c/Shopify-Design/Ordinal-Number-in-javascript-1st-2nd-3rd-4th/m-p/72156 */
Number.prototype.toOrdinal = function() {
    var s = ["th", "st", "nd", "rd"],
        v = this % 100;
    return this + (s[(v - 20) % 10] || s[v] || s[0]);
}

Number.prototype.toMixedScientific = function(floored = false) {
    if(this < 1000) return floored ? Math.floor(this) : this.toFixed(1);
    var s = ["", "K", "M", "B", "T", "Qa", "Qd", "Sx", "Sp", "Oc", "No"],
        l = Math.log10(this),
        v = Math.floor(l / 3),
        q = Math.floor(l % 3),
        e = (this / Math.pow(10, Math.floor(l - q))).toFixed(2);
    return v < 11 ? `${e} ${s[v]}` : `${e}e${v * 3}`;
}

const _INFINITY = 1.797693134862315907729305190789e+308; // infinity const hacking
const LOG_INFINITY =  308.2547155599167438988686281978809; // what the fuck???
const tickInterval = 33;
const dimCount = 9;
const dimensions = Array(dimCount + 1).fill((0));
const multipliers = Array(dimCount + 1).fill(1.0);
const bought = Array(dimCount + 1).fill((0));

function buy(dimension, until10 = false) {
    if(!until10) {
        dimensions[dimension]++;
        bought[dimension]++;
    } else {
        while(bought[dimension] < 10) {
            dimensions[dimension]++;
            bought[dimension]++;
        }
    }

    if(bought[dimension] >= 10) {
        bought[dimension] = 0;
        multipliers[dimension] *= 20;
    }
}

function tick() {
    // update dimension count
    for(let i = 0; i < dimensions.length - 1; i++) {
        dimensions[i] += ((dimensions[i + 1] * multipliers[i + 1]) / tickInterval);
    }

    // update text
    $('.matter').text(dimensions[0].toMixedScientific());
    for(let i = 1; i < dimensions.length; i++) {
        $(`.${i} > td > .count`).text(dimensions[i].toMixedScientific());
        $(`.${i} > td > .multiplier`).text(multipliers[i].toMixedScientific());
        $(`.${i} > td > .bought`).text(bought[i]);
    }

    let matterPerSecond = dimensions[1] * multipliers[1];
    $('.mps').text(matterPerSecond.toMixedScientific());

    // update progress bar
    let delta = Math.max(0, Math.log10(dimensions[0]) / LOG_INFINITY * 100).toFixed(2);
    $('.progress > p').text(`${delta}%`);
    $('.progress').css('width', `${delta}%`)
}

$(() => {
    setInterval(tick, tickInterval);

    for(let i = 1; i <= dimCount; i++) {
        $('table.dimensions').append(`
        <tr class="dimension ${i}">
            <td>${i.toOrdinal()} dimension x<span class="multiplier">1.0</span></td>
            <td><span class="count">0</span> (<span class="bought">0</span>)</td>
            <td>
                <button onclick="buy(${i})">matter</button>
                <button onclick="buy(${i}, true)">until 10, cost: matter</button>
            </td>
        </tr>`);
    }
});