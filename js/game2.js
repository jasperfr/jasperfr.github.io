/* =======================================================================================================
 *
 * Global functions
 *
 */

// Convert an integer to a byte string.
const prefix = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'KYB', 'MYB', 'GYB', 'TYB', 'PYB', 'EYB', 'ZYB', 'YYB'];
const toByteCode = function(long) {
    let j = long;
    let str = `${j.toFixed(0)} ${prefix[0]}`;
    for(let i = 1; j >= 1000; i++) {
        j /= 1000;
        str = `${j.toFixed(3)} ${prefix[i]}`;
    }
    return str;
}

// The byte value, used for everything in the game.
// (Note: AD uses {mantissa, exponent} for numbers, might add this later?)
const values = {
    bytes : 1
};
resetValue = function(v) {
    values.bytes = 0;
    $('#bitcount').text(toByteCode(values.bytes));
    $('title').text(toByteCode(values.bytes));
}
setValue = function(v) {
    values.bytes += v;
    $('#bitcount').text(toByteCode(values.bytes));
    $('title').text(toByteCode(values.bytes));
}

// Start the game.
$(document).ready(() => {
    generators.push(new Generator(1));
});

/* =======================================================================================================
 *
 * All the generators are stored in this array.
 *
 */
generators = [];

/* =======================================================================================================
 *
 * The HTML element used for generators.
 *
 */
const HTML_ELEMENT = `
<div class="bit generator">
    <table>
            <tr>
                <td colspan="2" class="output">
                    Generate 1 bit.
                </td>
            </tr>
            <tr>
                <th>
                    <button class="tooltip buy-value">
                        <span class="tooltiptext">Increases output value.</span>
                        <span class="label-value">[UNDEFINED]</span>
                    </button>
                </th>
                <th class="cost cost-value">[UNDEFINED]</th>
            </tr>
            <tr>
                <th>
                    <button class="tooltip buy-speed">
                        <span class="tooltiptext">Increases output speed.</span>
                        <span class="label-speed">[UNDEFINED]</span>
                    </button>
                </th>
                <th class="cost cost-speed">[UNDEFINED]</th>
            </tr>
            <tr>
                <th>
                    <button class="tooltip buy-ascend">
                        <span class="tooltiptext">Lose all progress, but get a boost on future upgrades.<br><span class="red">This will cost 95% of your bytes.</span></span>
                        <span class="label-ascend">[UNDEFINED]</span>
                    </button>
                </th>
                <th class="cost cost-ascend">[UNDEFINED]</th>
            </tr>
            <tr>
                <th colspan="2" class="progress">
                    <span class="text">0%</span>
                    <span class="pbar"></span>
                </th>
            </tr>
    </table>
</div>`;

/* =======================================================================================================
 *
 * The Generator class.
 *
 */
class Generator {
    constructor(price) {
        this.isMultiplier = false;
        this.active = false;
        this.price = price;
        this.element = $(HTML_ELEMENT);
        this.elements = {
            progressbar : undefined
        },
        this.progress = 0.0;
        this.upgrades = {
            value : { base : 1.0, baseprice : 2.0, costscale : 1.0, amount : 1.0, price : 2.0, purchased : 0, increment : 1.75 },
            speed : { base : 1.0, baseprice : 2.0, costscale : 1.0, amount : 1.0, price : 2.0, purchased : 0, increment: 1.5 },
            ascend : { base : 1.0, baseprice : 1000.0, costscale : 1.0, amount : 1.0, price : 1000.0, purchased : 0, increment : 1.25 },
        };

        // Create a button to unlock this generator.
        this.button = $('<button>');
        $(this.button).addClass('buy-gen');
        $(this.button).text(`Buy a generator for ${toByteCode(this.price)}.`);
        $(this.button).click(() => { this.buyGenerator(); });
        console.log(this.button);
        $('#generators').append(this.button);
    }

    // Unlocks the generator.
    buyGenerator() {
        // Sets the generator as 'Active'.
        if(this.active || values.bytes < this.price) return;
        setValue(-this.price);
        this.active = true;

        // Remove the buy button.
        $(this.button).remove();
        $('#generators').append(this.element); 
        
        // Add a new generator, but:
        // - This generator is 1.000x this price.
        // - The generator count must not exceed 8. There is no such thing as a 9th generator.
        if(generators.length < 8)
            generators.push(new Generator(this.price * 1_000));

        // Modify the HTML element.
        this.elements.progressbar = $(this.element).find('.progress');
        $($(this.element).find('.buy-value')).click(() => this.buyValueUpgrade());
        $($(this.element).find('.buy-speed')).click(() => this.buySpeedUpgrade());
        $($(this.element).find('.buy-ascend')).click(() => this.buyAscendUpgrade());

        $($(this.element).find('.cost-value')).text(toByteCode(this.upgrades.value.price));
        $($(this.element).find('.cost-speed')).text(toByteCode(this.upgrades.speed.price));
        $($(this.element).find('.cost-ascend')).text(toByteCode(this.upgrades.ascend.price));

        $($(this.element).find('.label-value')).text(`Value x${this.upgrades.value.increment}`);
        $($(this.element).find('.label-speed')).text(`Speed x${this.upgrades.speed.increment}`);
        $($(this.element).find('.label-ascend')).text(`Ascend x${this.upgrades.ascend.increment}`);
    }

    // Buy a speed upgrade for this generator.
    buySpeedUpgrade() {
        // Set price
        if(values.bytes < this.upgrades.speed.price) return;
        setValue(-this.upgrades.speed.price);
        // Increment values
        this.upgrades.speed.purchased++;
        this.upgrades.speed.amount *= this.upgrades.speed.increment; // 0.2 * Math.pow(this.upgrades.speed.purchased, 1.2) + 1;
        this.upgrades.speed.price *= Math.pow(this.upgrades.speed.purchased * this.upgrades.speed.costscale, 1.5) + 2;
        // Set HTML
        $($(this.element).find('.cost-speed')).text(toByteCode(this.upgrades.speed.price));
    }

    // Buy a value upgrade for this generator.
    buyValueUpgrade() {
        // Set price
        if(values.bytes < this.upgrades.value.price) return;
        setValue(-this.upgrades.value.price);
        // Increment values
        this.upgrades.value.amount *= this.upgrades.value.increment;
        this.upgrades.value.price *= 3 * this.upgrades.value.costscale;
        // Set HTML
        $($(this.element).find('.output')).text(`Generate ${toByteCode(this.upgrades.value.amount)}.`);
        $($(this.element).find('.cost-value')).text(toByteCode(this.upgrades.value.price));
    }

    // Buy an ascension upgrade for this generator.
    buyAscendUpgrade() {
        // Set price.
        if(values.bytes < this.upgrades.ascend.price) return;
        setValue(-this.upgrades.ascend.price);

        // Set ascension.
        this.upgrades.ascend.purchased++;
        this.upgrades.ascend.amount *= this.upgrades.ascend.increment;
        this.upgrades.ascend.price *= 1000.0;

        // Reset value multiplier and speed multiplier.
        this.upgrades.value.amount = this.upgrades.value.base;
        this.upgrades.value.price = this.upgrades.value.baseprice;
        this.upgrades.value.increment *= this.upgrades.ascend.increment;
        this.upgrades.value.purchased = 0;
        this.upgrades.value.costscale *= 1.3; // todo fix
        this.upgrades.speed.amount = this.upgrades.speed.base;
        this.upgrades.speed.price = this.upgrades.speed.baseprice;
        this.upgrades.speed.increment *= this.upgrades.ascend.increment;
        this.upgrades.speed.purchased = 0;
        this.upgrades.speed.costscale *= 1.3; // todo fix
        setValue(values.bytes * -0.95);

        // Modify the HTML element.
        $($(this.element).find('.cost-value')).text(toByteCode(this.upgrades.value.price));
        $($(this.element).find('.cost-speed')).text(toByteCode(this.upgrades.speed.price));
        $($(this.element).find('.cost-ascend')).text(toByteCode(this.upgrades.ascend.price));

        $($(this.element).find('.label-value')).text(`Value x${this.upgrades.value.increment}`);
        $($(this.element).find('.label-speed')).text(`Speed x${this.upgrades.speed.increment}`);
        $($(this.element).find('.label-ascend')).text(`Ascend x${this.upgrades.ascend.increment}`);
    }

    // A "tick" of the generator.
    tick() {
        if(!this.active) return;
        this.progress += this.upgrades.speed.amount * this.upgrades.ascend.amount;
        if(this.progress >= 100) {
            this.progress = 0;
            setValue(this.upgrades.value.amount * this.upgrades.ascend.amount);
        }
        $($(this.elements.progressbar).find('.text')).text(`${this.progress.toFixed(2)}%`);
        $($(this.elements.progressbar).find('.pbar')).css('width', `${this.progress}%`);
        // TODO : Fix progress bar when it goes to insane speed.*/
    }
}

// Add an interval for each game tick.
setInterval(() => {
    for(let g of generators) {
        g.tick();
    }
}, 10);