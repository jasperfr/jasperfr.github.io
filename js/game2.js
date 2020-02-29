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
    $( "input" ).checkboxradio({
        icon: false
      });
});

/* =======================================================================================================
 *
 * All the generators are stored in this array.
 *
 */
generators = [];
multiplicators = [];

/* =======================================================================================================
 *
 * The HTML element used for generators.
 *
 */
const HTML_MULTIPLICATOR = `
<div class="multiplicator">
    <div class="multicount">
        <h1>[UNDEFINED]</h1>
        <h3>+ ×1.001 / tick</h1>
    </div>
    <div class="upgrades">
        <button class="tooltip buy-increase">
            <span class="tooltiptext">Increase the multiplicator's multiplier by ×0.0001.</span>
            <span class="label-increase">+ ×0.0001 / tick</span>
        </button>
    </div>
</div>
`;

const HTML_ELEMENT = `
    <fieldset class="generator">
        <legend>Generator 1 - 1B/sec</legend>

        <div class="upgrades">
            <div class="upgrade">
                <button class="tooltip buy-value">
                    <span class="tooltiptext">Increases output value.</span>
                    <span class="label-value">[UNDEFINED]</span>
                </button>
                <p class="cost cost-value">[UNDEFINED]</p>
            </div>

            <div class="upgrade">
                <button class="tooltip buy-speed">
                    <span class="tooltiptext">Increases output speed.</span>
                    <span class="label-speed">[UNDEFINED]</span>
                </button>
                <p class="cost cost-speed">[UNDEFINED]</p>
            </div>
            
            <div class="upgrade">
                <button class="tooltip buy-ascend">
                    <span class="tooltiptext">Lose all progress, but get a boost on future upgrades.<br><span class="red">This will cost 95% of your bytes.</span></span>
                    <span class="label-ascend">[UNDEFINED]</span>
                </button>
                <p class="cost cost-ascend">[UNDEFINED]</p>
            </div>
        </div>

        <div class="progress">
            <div class="pbar slow">
            </div>
            <span class="text">0%</span>
        </div>

    </fieldset>
    <br>
`

/* =======================================================================================================
 *
 * The Generator class.
 *
 */
class Multiplicator {
    constructor(price) {
        this.multiplier = 1.0;
        this.multiIncrease = 0.0001;
        this.element = $(HTML_MULTIPLICATOR);

        $('#generators').append(this.element);
        $((this.element).find('button')).click(() => this.buyMultiplierUpgrade());
    }
    tick() {
        this.multiplier += this.multiIncrease;

        $($(this.element).find('h1')).text(`×${this.multiplier.toFixed(3)}`); //×1.001 / tick
        $($(this.element).find('h3')).text(`+ ×${this.multiIncrease.toFixed(4)} / tick`); //×1.001 / tick
    }
    buyMultiplierUpgrade() {
        this.multiIncrease += 0.0001;
    }
}


class Generator {
    constructor(price) {
        this.genID = generators.length + 1;
        this.isMultiplier = false;
        this.active = false;
        this.price = price;
        this.element = $(HTML_ELEMENT);
        this.elements = {
            progressbar : undefined
        },
        this.progress = 0.0;
        this.upgrades = {
            value : { base : 1.0, baseprice : 2.0, costscale : 1.0, amount : 1.0, price : 2.0, purchased : 0, increment : 1.5 },
            speed : { base : 1.0, baseprice : 10.0, costscale : 1.0, amount : 1.0, price : 10.0, purchased : 0, increment: 1.2 },
            ascend : { base : 1.0, baseprice : 1000.0, costscale : 1.0, amount : 1.0, price : 1000.0, purchased : 0, increment : 2.5 },
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
            generators.push(new Generator(this.price * 1_000));

        // Modify the HTML element.
        this.elements.progressbar = $(this.element).find('.progress');
        $($(this.element).find('.buy-value')).click(() => this.buyValueUpgrade());
        $($(this.element).find('.buy-speed')).click(() => this.buySpeedUpgrade());
        $($(this.element).find('.buy-ascend')).click(() => this.buyAscendUpgrade());

        $($(this.element).find('.cost-value')).text(toByteCode(this.upgrades.value.price));
        $($(this.element).find('.cost-speed')).text(toByteCode(this.upgrades.speed.price));
        $($(this.element).find('.cost-ascend')).text(toByteCode(this.upgrades.ascend.price));

        $($(this.element).find('.label-value')).text(`Value ×${this.upgrades.value.increment}`);
        $($(this.element).find('.label-speed')).text(`Speed ×${this.upgrades.speed.increment}`);
        $($(this.element).find('.label-ascend')).text(`Ascend ×${this.upgrades.ascend.increment}`);

        $(this.element).hide().slideDown();
        this.setGeneratorLabel();
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


        let speed = this.upgrades.speed.amount * this.upgrades.ascend.amount;
        if(speed >= 10) {
            $($(this.element).find('.pbar')).removeClass('slow');
        }
        this.setGeneratorLabel();
    }

    // Buy a value upgrade for this generator.
    buyValueUpgrade() {
        // Set price
        if(values.bytes < this.upgrades.value.price) return;
        setValue(-this.upgrades.value.price);
        // Increment values
        this.upgrades.value.amount *= this.upgrades.value.increment;
        this.upgrades.value.price *= 2 * this.upgrades.value.costscale;
        // Set HTML
        $($(this.element).find('.output')).text(`Generate ${toByteCode(this.upgrades.value.amount)}.`);
        $($(this.element).find('.cost-value')).text(toByteCode(this.upgrades.value.price));
        this.setGeneratorLabel();
    }

    setGeneratorLabel() {
        let speed = this.upgrades.speed.amount * this.upgrades.ascend.amount;
        let multi = 1.0;
        for(let m of multiplicators) { multi *= m.multiplier; }
        let bps = 100.0 * this.upgrades.value.amount * this.upgrades.ascend.amount * multi * (speed / 100.0);
        $($(this.element).find('legend')).text(`Generator ${this.genID} - ${toByteCode(bps)} / s`);
    }

    // Buy an ascension upgrade for this generator.
    buyAscendUpgrade() {
        // Set price.
        if(values.bytes < this.upgrades.ascend.price) return;
        setValue(-this.upgrades.ascend.price);

        // Set ascension.
        this.upgrades.ascend.purchased++;
        this.upgrades.ascend.amount += this.upgrades.ascend.increment;
        this.upgrades.ascend.price *= 1000.0;

        // Reset value multiplier and speed multiplier.
        // actually just give a x2 bonus
        /*
        this.upgrades.value.amount = this.upgrades.value.base;
        this.upgrades.value.price = this.upgrades.value.baseprice;
        this.upgrades.value.increment *= this.upgrades.ascend.increment;
        this.upgrades.value.purchased = 0;
        this.upgrades.value.costscale *= 1.03; // todo fix
        this.upgrades.speed.amount = this.upgrades.speed.base;
        this.upgrades.speed.price = this.upgrades.speed.baseprice;
        this.upgrades.speed.increment *= this.upgrades.ascend.increment;
        this.upgrades.speed.purchased = 0;
        this.upgrades.speed.costscale *= 1.03; // todo fix
        setValue(values.bytes * -0.95);
        */

        // Modify the HTML element.
        $($(this.element).find('.cost-value')).text(toByteCode(this.upgrades.value.price));
        $($(this.element).find('.cost-speed')).text(toByteCode(this.upgrades.speed.price));
        $($(this.element).find('.cost-ascend')).text(toByteCode(this.upgrades.ascend.price));

        $($(this.element).find('.label-value')).text(`Value ×${this.upgrades.value.increment.toFixed(3)}`);
        $($(this.element).find('.label-speed')).text(`Speed ×${this.upgrades.speed.increment.toFixed(3)}`);
        $($(this.element).find('.label-ascend')).text(`Ascend ×${this.upgrades.ascend.increment.toFixed(3)}`);

        this.setGeneratorLabel();
    }

    // A "tick" of the generator.
    tick() {
        if(!this.active) return;

        let speed = this.upgrades.speed.amount * this.upgrades.ascend.amount;
        let multi = 1.0;
        for(let m of multiplicators) { multi *= m.multiplier; }

        if(speed < 10) {
            this.progress += this.upgrades.speed.amount * this.upgrades.ascend.amount;
            if(this.progress >= 100) {
                this.progress = 0;
                setValue(this.upgrades.value.amount * this.upgrades.ascend.amount * multi);
            }
            $($(this.elements.progressbar).find('.text')).text(`${this.progress.toFixed(2)}%`);
            $($(this.elements.progressbar).find('.pbar')).css('width', `${this.progress}%`);
        }

        else {
            setValue(this.upgrades.value.amount * this.upgrades.ascend.amount * multi * (speed / 100.0));
            $($(this.elements.progressbar).find('.text')).text(`${(speed / 100.0).toFixed(2)}x / tick`);
            $($(this.elements.progressbar).find('.pbar')).css('width', `100%`);
        }
    }
}

// Add an interval for each game tick.
setInterval(() => {
    for(let m of multiplicators) {
        m.tick();
    }
    for(let g of generators) {
        g.tick();
    }
}, 10);