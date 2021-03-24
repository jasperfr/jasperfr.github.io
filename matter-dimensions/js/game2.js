Number.prototype.toMixedScientific = function(floored = true) {
    if(this < 1000) return floored ? Math.floor(this) : this.toFixed(1);
    var s = ["", "K", "M", "B", "T", "Qa", "Qd", "Sx", "Sp", "Oc", "No"],
        l = Math.log10(this),
        v = Math.floor(l / 3),
        q = Math.floor(l % 3),
        e = (this / Math.pow(10, Math.floor(l - q))).toFixed(2);
    return v < 11 ? `${e} ${s[v]}` : `${e}e${v * 3}`;
}

const navigate = function(page) {
    $('.page').hide();
    $(`.page.${page}`).show();
}

const c_red = "rgb(172, 44, 44)";
const c_green = "rgb(46, 173, 46)";
const interval = 33;

// work in progress modular overhaul
const Game = {
    matter: 10,
    dimensions: {
        first: {
            count: 0,
            multiplier: 1.0,
            bought: 0,
            price: 1e1,
            basePrice: 1e1,
            increase: 3
        },
        second: {
            count: 0,
            multiplier: 1.0,
            bought: 0,
            price: 1e2,
            basePrice: 1e2,
            increase: 4
        },
        third: {
            count: 0,
            multiplier: 1.0,
            bought: 0,
            price: 1e3,
            basePrice: 1e3,
            increase: 5
        },
        fourth: {
            count: 0,
            multiplier: 1.0,
            bought: 0,
            price: 1e4,
            basePrice: 1e4,
            increase: 6
        },
        fifth: {
            count: 0,
            multiplier: 1.0,
            bought: 0,
            price: 1e5,
            basePrice: 1e5,
            increase: 7
        },
        sixth: {
            count: 0,
            multiplier: 1.0,
            bought: 0,
            price: 1e6,
            basePrice: 1e6,
            increase: 8
        },
        seventh: {
            count: 0,
            multiplier: 1.0,
            bought: 0,
            price: 1e7,
            basePrice: 1e7,
            increase: 9
        },
        eighth: {
            count: 0,
            multiplier: 1.0,
            bought: 0,
            price: 1e8,
            basePrice: 1e8,
            increase: 10
        },
        ninth: {
            count: 0,
            multiplier: 1.0,
            bought: 0,
            price: 1e9,
            basePrice: 1e9,
            increase: 11
        },
    },
    dimBoosts: 0,
    tickspeed: {
        speed: 1000.0,
        amount: 0,
        price: 1000,
        decrease: 6.0,
        increase: 10
    },
    $elements: {},

    hardReset: function() {
        this.tickspeed = {
            speed: 1000.0,
            amount: 0,
            price: 1000,
            decrease: 6.0
        };
        this.dimBoosts = 0;
    },

    softReset: function() {
        this.tickspeed = {
            speed: 1000.0,
            amount: 0,
            cost: 1000,
            decrease: 6.0
        };
    },

    buyDimension: function(i, until10 = false) {
        let dimension = Game.dimensions[Object.keys(Game.dimensions)[i]];
        // do not buy if locked
        if(this.dimBoosts - i < -3) return;


        if(!until10) {
            if(dimension.price > this.matter) return;
            this.matter -= dimension.price;
            dimension.bought++;
            dimension.count++;
        } else {
            let bulkPrice = dimension.price * (10 - dimension.bought);
            if(bulkPrice > this.matter) return;
            this.matter -= bulkPrice;
            dimension.count += (10 - dimension.bought);
            dimension.bought = 10;
        }

        if(dimension.bought == 10) {
            dimension.multiplier *= 2.0;
            dimension.price *= Math.pow(10, dimension.increase);
            dimension.bought = 0;
        }
    },

    buyTickspeed: function(max = false) {
        if(!max) {
            if(this.tickspeed.price > this.matter) return;
            this.matter -= this.tickspeed.price;
            this.tickspeed.price *= this.tickspeed.increase;
            this.tickspeed.speed = this.tickspeed.speed / 100 * (100 - this.tickspeed.decrease);
        } else {
            while(this.tickspeed.price <= this.matter) {
                this.matter -= this.tickspeed.price;
                this.tickspeed.price *= this.tickspeed.increase;
                this.tickspeed.speed = this.tickspeed.speed / 100 * (100 - this.tickspeed.decrease);
            }
        }
    },

    buyMax: function() {
        for(let i = 0; i < 9; i++) {
            this.buyDimension(i, true);
        }
        this.buyTickspeed(true);
    },

    buyDimensionShift: function(shift) {
        switch(shift) {
            case 0: if(this.dimensions.fourth.count < 20) return; break;
            case 1: if(this.dimensions.fifth.count < 20) return; break;
            case 2: if(this.dimensions.sixth.count < 20) return; break;
            case 3: if(this.dimensions.seventh.count < 20) return; break;
            case 4: if(this.dimensions.eighth.count < 20) return; break;
        }
        this.dimBoosts++;
        
        // reset dimensions
        for(let [k, v] of Object.entries(this.dimensions)) {
            v.count = 0;
            v.multiplier = 1.0;
            v.bought = 0;
            v.price = v.basePrice;
        }

        // reset tick speed
        this.tickspeed.speed = 1000;
        this.tickspeed.amount = 0;
        this.tickspeed.price = 1000;

        // reset matter
        this.matter = 10;

        this.toggleDimboostAndDimensions();
    },

    buyDimensionBoost: function() {
        let required = (this.dimBoosts - 4) * 20;
        if(this.dimensions.ninth.count < required) return;
        this.dimBoosts++;
        
        // reset dimensions
        for(let [k, v] of Object.entries(this.dimensions)) {
            v.count = 0;
            v.multiplier = 1.0;
            v.bought = 0;
            v.price = v.basePrice;
        }

        // reset tick speed
        this.tickspeed.speed = 1000;
        this.tickspeed.amount = 0;
        this.tickspeed.price = 1000;

        // reset matter
        this.matter = 10;

        this.toggleDimboostAndDimensions();
    },

    save: function() {

    },

    load: function() {

    },

    export: function() {

    },

    updateText: function() {
        this.$elements.matter.count.text(this.matter.toMixedScientific());
        this.$elements.matter.perSecond.text((this.dimensions.first.count * (Math.pow(2, this.dimBoosts) * this.dimensions.first.multiplier)).toMixedScientific());

        // Update tickspeed text
        this.$elements.tickspeed.amount.text(this.tickspeed.speed);
        this.$elements.tickspeed.button.css('border-color', this.tickspeed.price > this.matter ? c_red : c_green);
        this.$elements.tickspeed.buttonMax.css('border-color', this.tickspeed.price > this.matter ? c_red : c_green);
        this.$elements.tickspeed.interval.text(this.tickspeed.decrease);
        this.$elements.tickspeed.price.text(this.tickspeed.price.toMixedScientific());

        // Update dimension text
        for(let dimension of Object.keys(this.dimensions)) {
            let bulkPrice = (this.dimensions[dimension].price * (10 - this.dimensions[dimension].bought));
            this.$elements.dimensions[dimension].count.text(this.dimensions[dimension].count.toMixedScientific());
            this.$elements.dimensions[dimension].multiplier.text((this.dimensions[dimension].multiplier * Math.pow(2, this.dimBoosts)).toMixedScientific(false));
            this.$elements.dimensions[dimension].bought.text(this.dimensions[dimension].bought.toMixedScientific());
            this.$elements.dimensions[dimension].singlePrice.text(this.dimensions[dimension].price.toMixedScientific());
            this.$elements.dimensions[dimension].bulkPrice.text(bulkPrice.toMixedScientific());
            this.$elements.dimensions[dimension].buySingle.css('border-color', this.dimensions[dimension].price > this.matter ? c_red : c_green);
            this.$elements.dimensions[dimension].buy10.css('border-color', bulkPrice > this.matter ? c_red : c_green);
        }

        this.$elements.boosts.dimshift1.button.css('border-color', this.dimensions.fourth.count >= 20 ? c_green : c_red);
        this.$elements.boosts.dimshift2.button.css('border-color', this.dimensions.fifth.count >= 20 ? c_green : c_red);
        this.$elements.boosts.dimshift3.button.css('border-color', this.dimensions.sixth.count >= 20 ? c_green : c_red);
        this.$elements.boosts.dimshift4.button.css('border-color', this.dimensions.seventh.count >= 20 ? c_green : c_red);
        this.$elements.boosts.dimshift5.button.css('border-color', this.dimensions.eighth.count >= 20 ? c_green : c_red);
        
        this.$elements.boosts.dimboost.boostCount.text(this.dimboosts);
        this.$elements.boosts.dimboost.boostPrice.text((this.dimBoosts - 4) * 20);
        this.$elements.boosts.dimboost.button.css('border-color', this.dimensions.ninth.count >= (this.dimBoosts - 4) * 20 ? c_green : c_red);
        
        let delta = Math.max(0, Math.log10(this.matter) / 308 * 100).toFixed(2);
        $('.progress > p').text(`${delta}%`);
        $('.progress').css('width', `${delta}%`)
    },

    tick: function() {
        this.matter += (this.dimensions.first.count * (Math.pow(2, this.dimBoosts) * this.dimensions.first.multiplier)) / 1000 * interval / this.tickspeed.speed * 1000;
        
        const keys = Object.keys(this.dimensions);
        for(let i = 0; i < keys.length - 1; i++) {
            this.dimensions[keys[i]].count += 0.1 * (this.dimensions[keys[i+1]].count * Math.pow(2, this.dimBoosts) * this.dimensions[keys[i+1]].multiplier / 1000 * interval / this.tickspeed.speed * 1000);
        }

        // Update unlockables?
        if(this.dimensions.second.count > 0) this.$elements.tickspeed.container.show();
        this.updateText();
    },

    // Toggle dimension containers and dimboost containers
    // based on amount of dimensions boosted.
    // Called on load/dimboost to prevent continuous
    // function calling in tick.
    // TODO tidy up code, I know this can be written better...
    toggleDimboostAndDimensions: function() {
        if(this.dimBoosts == 1) {
            this.$elements.boosts.dimshift1.container.hide();
            this.$elements.boosts.dimshift2.container.show();
            this.$elements.dimensions.fifth.container.show();
        }
        if(this.dimBoosts == 2) {
            this.$elements.boosts.dimshift1.container.hide();
            this.$elements.boosts.dimshift2.container.hide();
            this.$elements.boosts.dimshift3.container.show();
            this.$elements.dimensions.fifth.container.show();
            this.$elements.dimensions.sixth.container.show();
        }
        if(this.dimBoosts == 3) {
            this.$elements.boosts.dimshift1.container.hide();
            this.$elements.boosts.dimshift2.container.hide();
            this.$elements.boosts.dimshift3.container.hide();
            this.$elements.boosts.dimshift4.container.show();
            this.$elements.dimensions.fifth.container.show();
            this.$elements.dimensions.sixth.container.show();
            this.$elements.dimensions.seventh.container.show();
        }
        if(this.dimBoosts == 4) {
            this.$elements.boosts.dimshift1.container.hide();
            this.$elements.boosts.dimshift2.container.hide();
            this.$elements.boosts.dimshift3.container.hide();
            this.$elements.boosts.dimshift4.container.hide();
            this.$elements.boosts.dimshift5.container.show();
            this.$elements.dimensions.fifth.container.show();
            this.$elements.dimensions.sixth.container.show();
            this.$elements.dimensions.seventh.container.show();
            this.$elements.dimensions.eighth.container.show();
        }
        if(this.dimBoosts > 4) {
            this.$elements.boosts.dimshift1.container.hide();
            this.$elements.boosts.dimshift2.container.hide();
            this.$elements.boosts.dimshift3.container.hide();
            this.$elements.boosts.dimshift4.container.hide();
            this.$elements.boosts.dimshift5.container.hide();
            this.$elements.boosts.dimboost.container.show();
            this.$elements.dimensions.fifth.container.show();
            this.$elements.dimensions.sixth.container.show();
            this.$elements.dimensions.seventh.container.show();
            this.$elements.dimensions.eighth.container.show();
            this.$elements.dimensions.ninth.container.show();
        }
    }
}

$(function() {
    Game.$elements = {
        matter: {
            count: $('#matter-count'),
            perSecond: $('#matter-per-second')
        },
        tickspeed: {
            container: $('#tickspeed'),
            amount: $('#tickspeed-amount'),
            price: $('#tickspeed-cost'),
            button: $('#tickspeed-button'),
            buttonMax: $('#tickspeed-button-max'),
            interval: $('#tickspeed-interval')
        },
        dimensions: {
            first: {
                container: $('.dimension.1'),
                multiplier: $('.dimension.1 .multiplier'),
                count: $('.dimension.1 .count'),
                bought: $('.dimension.1 .bought'),
                buySingle: $('.dimension.1 .single'),
                buy10: $('.dimension.1 .bulk'),
                singlePrice: $('.dimension.1 .price'),
                bulkPrice: $('.dimension.1 .price10')
            },
            second: {
                container: $('.dimension.2'),
                multiplier: $('.dimension.2 .multiplier'),
                count: $('.dimension.2 .count'),
                bought: $('.dimension.2 .bought'),
                buySingle: $('.dimension.2 .single'),
                buy10: $('.dimension.2 .bulk'),
                singlePrice: $('.dimension.2 .price'),
                bulkPrice: $('.dimension.2 .price10')
            },
            third: {
                container: $('.dimension.3'),
                multiplier: $('.dimension.3 .multiplier'),
                count: $('.dimension.3 .count'),
                bought: $('.dimension.3 .bought'),
                buySingle: $('.dimension.3 .single'),
                buy10: $('.dimension.3 .bulk'),
                singlePrice: $('.dimension.3 .price'),
                bulkPrice: $('.dimension.3 .price10')
            },
            fourth: {
                container: $('.dimension.4'),
                multiplier: $('.dimension.4 .multiplier'),
                count: $('.dimension.4 .count'),
                bought: $('.dimension.4 .bought'),
                buySingle: $('.dimension.4 .single'),
                buy10: $('.dimension.4 .bulk'),
                singlePrice: $('.dimension.4 .price'),
                bulkPrice: $('.dimension.4 .price10')
            },
            fifth: {
                container: $('.dimension.5'),
                multiplier: $('.dimension.5 .multiplier'),
                count: $('.dimension.5 .count'),
                bought: $('.dimension.5 .bought'),
                buySingle: $('.dimension.5 .single'),
                buy10: $('.dimension.5 .bulk'),
                singlePrice: $('.dimension.5 .price'),
                bulkPrice: $('.dimension.5 .price10')
            },
            sixth: {
                container: $('.dimension.6'),
                multiplier: $('.dimension.6 .multiplier'),
                count: $('.dimension.6 .count'),
                bought: $('.dimension.6 .bought'),
                buySingle: $('.dimension.6 .single'),
                buy10: $('.dimension.6 .bulk'),
                singlePrice: $('.dimension.6 .price'),
                bulkPrice: $('.dimension.6 .price10')
            },
            seventh: {
                container: $('.dimension.7'),
                multiplier: $('.dimension.7 .multiplier'),
                count: $('.dimension.7 .count'),
                bought: $('.dimension.7 .bought'),
                buySingle: $('.dimension.7 .single'),
                buy10: $('.dimension.7 .bulk'),
                singlePrice: $('.dimension.7 .price'),
                bulkPrice: $('.dimension.7 .price10')
            },
            eighth: {
                container: $('.dimension.8'),
                multiplier: $('.dimension.8 .multiplier'),
                count: $('.dimension.8 .count'),
                bought: $('.dimension.8 .bought'),
                buySingle: $('.dimension.8 .single'),
                buy10: $('.dimension.8 .bulk'),
                singlePrice: $('.dimension.8 .price'),
                bulkPrice: $('.dimension.8 .price10')
            },
            ninth: {
                container: $('.dimension.9'),
                multiplier: $('.dimension.9 .multiplier'),
                count: $('.dimension.9 .count'),
                bought: $('.dimension.9 .bought'),
                buySingle: $('.dimension.9 .single'),
                buy10: $('.dimension.9 .bulk'),
                singlePrice: $('.dimension.9 .price'),
                bulkPrice: $('.dimension.9 .price10')
            },
        },
        boosts: {
            dimshift1: {
                container: $('.dimension-shift.1'),
                cost: $('.dimension-shift.1 .cost'),
                button: $('.dimension-shift.1 button')
            },
            dimshift2: {
                container: $('.dimension-shift.2'),
                cost: $('.dimension-shift.2 .cost'),
                button: $('.dimension-shift.2 button')
            },
            dimshift3: {
                container: $('.dimension-shift.3'),
                cost: $('.dimension-shift.3 .cost'),
                button: $('.dimension-shift.3 button')
            },
            dimshift4: {
                container: $('.dimension-shift.4'),
                cost: $('.dimension-shift.4 .cost'),
                button: $('.dimension-shift.4 button')
            },
            dimshift5: {
                container: $('.dimension-shift.5'),
                cost: $('.dimension-shift.5 .cost'),
                button: $('.dimension-shift.5 button')
            },
            dimboost: {
                container: $('.dimension-boost'),
                boostCount: $('#boost-count'),
                boostPrice: $('#boost-price'),
                button: $('.dimension-boost button')
            }
        }
    }

    Game.$elements.tickspeed.container.hide();
    Game.$elements.dimensions.fifth.container.hide();
    Game.$elements.dimensions.sixth.container.hide();
    Game.$elements.dimensions.seventh.container.hide();
    Game.$elements.dimensions.eighth.container.hide();
    Game.$elements.dimensions.ninth.container.hide();

    Game.toggleDimboostAndDimensions();

    setInterval(() => { Game.tick() }, interval);

    $(document).keydown(function(e) {
        // Max (M)
        if(e.keyCode == 77) {
            Game.buyMax();
        }
    });
});