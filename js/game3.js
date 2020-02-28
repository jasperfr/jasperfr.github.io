tickspeed = 20.0; // 1000t = 1 second, 50 ticks per second
generators = [];
bytes = 1;

const prefix = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'KYB', 'MYB', 'GYB', 'TYB', 'PYB', 'EYB', 'ZYB', 'YYB'];
const toByteCode = function(long) {
    let j = long;
    let str = `${j.toFixed(2)} ${prefix[0]}`;
    for(let i = 1; j >= 1000; i++) {
        j /= 1000;
        str = `${j.toFixed(2)} ${prefix[i]}`;
    }
    return str;
}

const setByteCount = function(amt) {
    bytes += amt;
    $('#bitcount').text(toByteCode(bytes));
    $('title').text(toByteCode(bytes));
}

const HTML_ELEMENT = `
    <fieldset class="generator">
        <legend>Generator 1 - 1B/sec</legend>

        <table class="upgrades">

            <tr class="progress">
                <th colspan="4" width="100%">
                    <div class="pbar slow">
                        <span class="text">0%</span>
                    </div>
                </th>
            </tr>

            <tr class="upgrade">
                <th class="description">Value</th>
                <th class="label-value-increment">[UNDEFINED]</th>
                <th class="label-value-total">[UNDEFINED]</th>
                <th>
                    <button class="buy-value">
                        <span class="cost cost-value">[UNDEFINED]</span>
                    </button>
                </th>
            </tr>

            <tr class="upgrade">
                <th class="description">Speed</th>
                <th class="label-speed-increment">[UNDEFINED]</th>
                <th class="label-speed-total">[UNDEFINED]</th>
                <th><button class="buy-speed">
                    <span class="cost cost-speed">[UNDEFINED]</span>
                </button></th>
            </tr>
            
            <tr class="upgrade">
                <th class="description">Boost</th>
                <th class="label-boost-increment">[UNDEFINED]</th>
                <th class="label-boost-total">[UNDEFINED]</th>
                <th><button class="buy-boost">
                    <span class="cost cost-boost">[UNDEFINED]</span>
                </button></th>
            </tr>

        </table>
    </fieldset>
    <br>
`;

class Generator {
    constructor(price) {
        this.active = false;
        this.html = $(HTML_ELEMENT);
        this.elements = {
            title : $(this.html).find('legend'),
            progressBar : $(this.html).find('.pbar'),
            progressLabel : $(this.html).find('.text'),
            buttonValue : $(this.html).find('.buy-value'),
            buttonSpeed : $(this.html).find('.buy-speed'),
            buttonBoost : $(this.html).find('.buy-boost'),
            costValue : $(this.html).find('.cost-value'),
            costSpeed : $(this.html).find('.cost-speed'),
            costBoost : $(this.html).find('.cost-boost'),
            labelValueTotal : $(this.html).find('.label-value-total'),
            labelSpeedTotal : $(this.html).find('.label-speed-total'),
            labelBoostTotal : $(this.html).find('.label-boost-total'),
            labelValueIncrement : $(this.html).find('.label-value-increment'),
            labelSpeedIncrement : $(this.html).find('.label-speed-increment'),
            labelBoostIncrement : $(this.html).find('.label-boost-increment')
        };
        this.id = generators.length + 1;
        this.price = price;
        this.value = { amount: 1.00, increment: 0.75 + this.id, price: 5.00, pmult: 3.00 };
        this.speed = { amount: 1.00, increment: 0.50, price: 10.00, pmult: 5.00 };
        this.boost = { amount: 1.00, increment: 2.00, price: 100.00, pmult: 100.00 };
        this.progress = 0.0;

        this.button = $('<button>')
            .addClass('buy-gen')
            .text(`Buy a generator for ${toByteCode(this.price)}.`)
            .click(() => this.buyGenerator());
        $('#generators').append(this.button);

        this.bps = 0.0;
    }

    buyGenerator() {

        if(this.active || bytes < this.price) return;
        bytes -= this.price;
        this.active = true;

        $(this.button).remove();
        $('#generators').append(this.html); 
        generators.push(new Generator(this.price * 100));

        $(this.elements.buttonValue).click(() => this.buyValueUpgrade());
        $(this.elements.buttonSpeed).click(() => this.buySpeedUpgrade());
        $(this.elements.buttonBoost).click(() => this.buyBoostUpgrade());

        $(this.elements.costValue).text(toByteCode(this.value.price));
        $(this.elements.costSpeed).text(toByteCode(this.speed.price));
        $(this.elements.costBoost).text(toByteCode(this.boost.price));

        $(this.elements.labelValueTotal).text(`${this.value.amount.toFixed(2)}×`);
        $(this.elements.labelSpeedTotal).text(`${this.speed.amount.toFixed(2)}×`);
        $(this.elements.labelBoostTotal).text(`${this.boost.amount.toFixed(2)}×`);

        $(this.elements.labelValueIncrement).text(`+ ${this.value.increment.toFixed(2)}×`);
        $(this.elements.labelSpeedIncrement).text(`+ ${this.speed.increment.toFixed(2)}×`);
        $(this.elements.labelBoostIncrement).text(`×${this.boost.increment.toFixed(2)}`);

        // bps = ((amount * boost) * (speed * boost) / 100% ) * tickspeed
        
        $(this.html).hide().slideDown();
        this.setBytesPerSecond();
    }

    setBytesPerSecond() {
        this.bps = this.value.amount * this.boost.amount * ((this.speed.amount * this.boost.amount) / 100.0) * 50.0;

        if(this.bps >= 1)
            $(this.elements.title).text(`Generator ${this.id} - ${toByteCode(this.bps)} /s`);
        else
            $(this.elements.title).text(`Generator ${this.id} - ${(1.0 / this.bps).toFixed(2)} s/B`);
    }
    buyValueUpgrade() {
        if(bytes < this.value.price) return;
        setByteCount(-this.value.price);

        this.value.price *= this.value.pmult;
        this.value.amount += this.value.increment;

        $(this.elements.costValue).text(toByteCode(this.value.price));
        $(this.elements.labelValueTotal).text(`×${this.value.amount.toFixed(2)}`);
        $(this.elements.labelValueIncrement).text(`+ ${this.value.increment.toFixed(2)}×`);
        this.setBytesPerSecond();
    }
    buySpeedUpgrade() {
        if(bytes < this.speed.price) return;
        setByteCount(-this.speed.price);
        
        this.speed.price *= this.speed.pmult;
        this.speed.amount += this.speed.increment;

        $(this.elements.costSpeed).text(toByteCode(this.speed.price));   
        $(this.elements.labelSpeedTotal).text(`×${this.speed.amount.toFixed(2)}`);
        $(this.elements.labelSpeedIncrement).text(`+ ${this.speed.increment.toFixed(2)}×`);
        this.setBytesPerSecond();
    }
    buyBoostUpgrade() {
        if(bytes < this.boost.price) return;
        setByteCount(-this.boost.price);
        
        this.boost.amount *= this.boost.increment;
        this.boost.price *= this.boost.pmult;

        $(this.elements.costBoost).text(toByteCode(this.boost.price));
        $(this.elements.labelBoostTotal).text(`×${this.boost.amount.toFixed(2)}`);
        $(this.elements.labelBoostIncrement).text(`×${this.boost.increment.toFixed(2)}`);
        this.setBytesPerSecond();
    }
    tick() {
        if(!this.active) return;
        let speed = this.speed.amount * this.boost.amount;
        if(speed < 10) {
            // fancy progress bar
            // progress only increases at 100%
            this.progress += speed; // speed amount divided by tickspeed
            if(this.progress > 100) {
                this.progress = 0;
                setByteCount(this.value.amount * this.boost.amount);
            }
            $(this.elements.progressBar).css('width', `${this.progress}%`);
            $(this.elements.progressLabel).text(`${this.progress}%`);
        } else {
            // barbershop progress bar
            // progress increases per tick
            $(this.elements.progressBar).removeClass('slow');
            let bpt = this.bps / 50.0;
            setByteCount(bpt);
        }

        // let speed = this.upgrades.speed.amount * this.upgrades.ascend.amount;
    }

    getValue() {
        return this.value.amount * this.boost.amount * (this.speed.amount / 100.0) * tickspeed;
    }
};

// 20ms = 50 tps
setInterval(() => {
    for (g of generators) {
        g.tick();
    }
}, tickspeed);

// Start the game.
$(document).ready(() => {
    generators.push(new Generator(1));

    $( "input" ).checkboxradio({
        icon: false
      });
});