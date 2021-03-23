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
var dimensions = [
    { amount: 10, multiplier: 1.0, bought: 0, price: null },
    { amount: 0, multiplier: 1.0, bought: 0, price: 1e1, increase: 2 },
    { amount: 0, multiplier: 1.0, bought: 0, price: 1e2, increase: 3 },
    { amount: 0, multiplier: 1.0, bought: 0, price: 1e3, increase: 4 },
    { amount: 0, multiplier: 1.0, bought: 0, price: 1e4, increase: 5 },
    { amount: 0, multiplier: 1.0, bought: 0, price: 1e5, increase: 6 },
    { amount: 0, multiplier: 1.0, bought: 0, price: 1e6, increase: 7 },
    { amount: 0, multiplier: 1.0, bought: 0, price: 1e7, increase: 8 },
    { amount: 0, multiplier: 1.0, bought: 0, price: 1e8, increase: 9 },
    { amount: 0, multiplier: 1.0, bought: 0, price: 1e9, increase: 10 }
];

// Buys 1 (or up to 10) dimension(s)
function buy(dimension, until10 = false) {
    let matter = dimensions[0];
    let dim = dimensions[dimension];
    let to10 = dim.price * (10 - dim.bought);

    if(!until10) {
        if(matter.amount < dim.price) return;
        matter.amount -= dim.price;

        dim.amount++;
        dim.bought++;
    } else {
        if(matter.amount < to10) return;
        dim.amount += 10 - dim.bought;
        dim.bought = 10;
    }

    if(dim.bought >= 10) {
        dim.bought = 0;
        dim.multiplier *= 2.0;
        dim.price *= Math.pow(10, dim.increase);
    }

    to10 = dim.price * (10 - dim.bought);
    // update price tag
    $(`.dimension.${dimension} span.price`).text(dim.price.toMixedScientific(true));
    $(`.dimension.${dimension} span.price10`).text(to10.toMixedScientific(true));
}

function tick() {
    // update dimension count
    for(let i = 0; i < dimensions.length - 1; i++) {
        dimensions[i].amount += ((dimensions[i+1].amount * dimensions[i+1].multiplier) / tickInterval);
    }

    // update text
    $('.matter').text(dimensions[0].amount.toMixedScientific());
    for(let i = 1; i < dimensions.length; i++) {
        $(`.${i} > td > .count`).text(dimensions[i].amount.toMixedScientific());
        $(`.${i} > td > .multiplier`).text(dimensions[i].multiplier.toMixedScientific());
        $(`.${i} > td > .bought`).text(dimensions[i].bought);
    }

    let matterPerSecond = dimensions[1].amount * dimensions[1].multiplier;
    $('.mps').text(matterPerSecond.toMixedScientific());

    // update progress bar
    let delta = Math.max(0, Math.log10(dimensions[0].amount) / LOG_INFINITY * 100).toFixed(2);
    $('.progress > p').text(`${delta}%`);
    $('.progress').css('width', `${delta}%`)
}

function navigate(page) {
    $('.page').hide();
    $(`.page.${page}`).show();
}

$(() => {
    setInterval(tick, tickInterval);

    for(let i = 1; i <= 9; i++) {
        $('table.dimensions').append(`
        <tr class="dimension ${i}">
            <td class="dname">${i.toOrdinal()} dimension x<span class="multiplier">1.0</span></td>
            <td class="damount"><span class="count">0</span> (<span class="bought">0</span>)</td>
            <td class="dbuttons">
                <button onclick="buy(${i})">Cost: <span class="price">${(dimensions[i].price).toMixedScientific(true)}</span></button>
                <button onclick="buy(${i}, true)">Until 10, Cost: <span class="price10">${(dimensions[i].price * 10).toMixedScientific(true)}</span></button>
            </td>
        </tr>`);
    }

    setInterval(saveGame, 30000); // save game every 30s

    loadGame();
});