Number.prototype.toExponential2 = function(fractionDigits = 2) {
    if(this < 10000) return this.toFixed(fractionDigits);
    let str = this.toExponential(fractionDigits).toString();
    str = str.replace('e+', '×10<sup>');
    return str + '</sup>';
}

const Game = {
    base: 10,
    OP: new Exadecimal(0),
    isInfinity: () => Game.OP.toString() === '∞',

    price: {
        debase: {
            tiers: [
                new Exadecimal(100),
                new Exadecimal(1e3),
                new Exadecimal(1e5),
                new Exadecimal(1e10),
                new Exadecimal(1e13),
                new Exadecimal(1e22),
                new Exadecimal(1e101),
            ],
            current: 0
        },
    },

    sigma: {
        count: 0,
        unlocked: false,
        dimensions: [
            { count: 0, price: 1},
            { count: 0, price: 100},
            { count: 0, price: 1e10},
            { count: 0, price: 1e99},
        ],
        conversion: {
            rate: 1.0,
            price: 1e+4,
            boost: function() {
                if(Game.sigma.count >= this.price && this.rate < (Game.singularity.upgrades['inc_conv_exp_cap'].exponent - 0.01)) {
                    Game.sigma.count -= this.price;
                    this.price *= 10;
                    this.rate += 0.05;
                }
            }
        },
        speed: {
            rate: 1.0,
            price: 1e+10,
            boost: function() {
                if(Game.sigma.count >= this.price && this.rate < 99) {
                    Game.sigma.count -= this.price;
                    this.price *= 10;
                    this.rate += 0.15;
                }
            }
        },
        update: function() {
            if(!this.unlocked) return;
            if(Game.singularity.upgrades["10_e1_dims"].unlocked && this.dimensions[1].count < 10) {
                this.dimensions[1].count = 10;
            }

            for(let i = 3; i > 0; i--) {
                this.dimensions[i - 1].count += this.dimensions[i].count / 100 * this.speed.rate;
            };
            this.render();
        },
        render: function() {
            let num = Game.OP.toSmallNumber();
            let gain = Math.max(
                (num / 10),
                Math.pow((num / 10), Game.sigma.conversion.rate)
            );
            gain = Math.min(gain, 1e100);
            if(this.unlocked) {
                $('.nav-sigma').removeClass('locked');
                $('.unlock-sigma').hide();
            } else {
                $('.nav-sigma').addClass('locked');
                $('.unlock-sigma').show();
            }
            for(let i = 0; i < 4; i++) {
                $(`.sigma-${i} .count`).html(Math.floor(this.dimensions[i].count).toExponential2(0));
                $(`.sigma-${i} button`).html('Cost: ' + Math.floor(this.dimensions[i].price).toExponential2(0) + ' ξ');
            }
            $('.sigma-gain').html(gain.toExponential2());
            $('.sigma-count').html(this.count.toExponential2());
            $('.sigma-conversion-rate').html(Game.sigma.conversion.rate.toExponential2());
            $('.sigma-conversion-cost').html(Game.sigma.conversion.price.toExponential2());
            $('.sigma-speed-rate').html(Game.sigma.speed.rate.toExponential2());
            $('.sigma-speed-cost').html(Game.sigma.speed.price.toExponential2());
            
            $('.sigma-gain-capped').text(gain == 1e100 ? '(capped)' : '');
            $('.sigma-conversion-capped').text(Game.sigma.conversion.rate > Game.singularity.upgrades['inc_conv_exp_cap'].exponent ? ' (capped)' : '');
            $('.sigma-speed-capped').text(Game.sigma.speed.rate >= 99 ? ' (capped)' : '');
        },
        buy: function(dimension) {
            if(this.count >= this.dimensions[dimension].price) {
                this.count -= this.dimensions[dimension].price;
                this.dimensions[dimension].count++;
                this.dimensions[dimension].price *= 3;
                this.render();
            }
        },
        convert: function() {
            let num = Game.OP.toSmallNumber();
            let gain = Math.max(
                (num / 10),
                Math.pow((num / 10), Game.sigma.conversion.rate)
            )
            gain = Math.min(gain, 1e100);
            this.count += gain;
            Game.reset.untilSigma();
        },
        unlock: function() {
            if(Game.OP.isLargerThan(2.2e2, true) && Game.base < 10) {
                this.unlocked = true;
                Game.reset.untilSigma();
            }
        }
    },

    singularity: {
        count: 0,
        unlocked: false,
        upgrades: {
            '100_u': {
                cost: 0,
                incremental: false,
                unlocked: false,
                onUnlock: function() {
                    if(Game.base == 10 && Game.OP.isSmallerThan(100)) {
                        ordinals[0] = 100;
                    }
                }
            },
            '10_e1_dims': {
                label: '10_e1_dims',
                cost: 10,
                incremental: false,
                unlocked: false
            },
            'sigma_unlock': {
                cost: 1,
                incremental: false,
                unlocked: false,
                onUnlock: function() {
                    if(!Game.sigma.unlocked) {
                        Game.sigma.unlocked = true;
                    }
                }
            },
            'auto_base': {
                cost: 1,
                incremental: false,
                unlocked: false
            },
            '2x_singular': {
                cost: 2,
                incremental: true,
                increase: e => e * 5,
                update: e => {
                    let self = Game.singularity.upgrades[e];
                    $(`.${e} .cost`).html(self.cost.toExponential2());
                    $(`.${e} .increment`).html(`x${(Math.pow(2, self.times)).toExponential2()}`);
                },
                times: 0,
                cap: 999999,
                unlocked: false
            },
            'e_gain': {
                cost: 2,
                incremental: true,
                increase: e => e * 2,
                update: e => {
                    let self = Game.singularity.upgrades[e];
                    $(`.${e} .cost`).html(self.cost.toExponential2());
                    $(`.${e} .increment`).text(`${5 * self.times}%`);
                },
                times: 0,
                cap: 20,
                unlocked: false
            },
            'inc_conv_exp': {
                cost: 5,
                incremental: true,
                increase: e => e * 10,
                update: e => {
                    let self = Game.singularity.upgrades[e];
                    $(`.${e} .cost`).html(self.cost.toExponential2());
                    $(`.${e} .increment`).text(`${(1.05 + self.times * 0.05).toFixed(2)} -> ${(1.05 + (self.times + 1) * 0.05).toFixed(2)}`);
                },
                times: 0,
                cap: 19,
                unlocked: false
            },
            'inc_conv_exp_cap': {
                cost: 10,
                incremental: true,
                increase: e => Math.pow(e, 1.5),
                update: e => {
                    let self = Game.singularity.upgrades[e];
                    Game.singularity.upgrades[e].exponent = 3.00 + self.times * 0.10;
                    $(`.${e} .cost`).html(self.cost.toExponential2());
                    if(self.times < self.cap)
                        $(`.${e} .increment`).html(`x<sup>${(3.00 + self.times * 0.10).toFixed(2)}</sup> -> x<sup>${(3.00 + (self.times + 1) * 0.10).toFixed(2)}</sup>`);
                    else
                        $(`.${e} .increment`).html(`x<sup>${(3.00 + self.times * 0.10).toFixed(2)}`);
                },
                exponent: 3.00,
                times: 0,
                cap: 10,
                unlocked: false
            },
        },
        unlock: function(key) {
            let upgrade = this.upgrades[key];
            if(upgrade.unlocked || this.count < upgrade.cost) return;
            this.count -= upgrade.cost;
            if(upgrade.incremental && upgrade.times < upgrade.cap) {
                this.upgrades[key].cost = upgrade.increase(upgrade.cost);
                this.upgrades[key].times++;
                this.upgrades[key].update(key);
            }
            if(!upgrade.incremental || upgrade.times == upgrade.cap) {
                this.upgrades[key].unlocked = true;
                $(`.${key}`).addClass('bought');
                if(upgrade.cap) $(`.${key} .cap`).show();
                $(`.${key} .price-tag`).hide();
            }
            if(upgrade.onUnlock) upgrade.onUnlock();
        },
        compress: function() {
            this.count++;
            this.unlocked = false;
            Game.reset.untilSingularity();
        },
        render: function() {
            $('.psi-count').text(this.count);
            if(Game.isInfinity()) {
                this.unlocked = true;
            }
            if(!this.unlocked) {
                $('.compress').hide();
            } else {
                $('.compress').show();
            }
        }
    },

    reset: {
        untilSigma: function() {
            Game.OP = new Exadecimal(0);
            Game.base = 10;
            ordinals = [0];
            Game.price.debase.current = 0;
            Game.updateText();
        },
        untilSingularity: function() {
            Game.sigma.count = 0;
            Game.sigma.unlocked = false;
            Game.sigma.dimensions = [
                { count: 0, price: 1},
                { count: 0, price: 100},
                { count: 0, price: 1e10},
                { count: 0, price: 1e99},
            ];
            Game.sigma.conversion.rate = 1.00;
            Game.sigma.conversion.price = 1e4;
            Game.sigma.speed.rate = 1.00;
            Game.sigma.speed.price = 1e10;
            this.untilSigma();
        }
    },

    tick: function() {
        ordinals[0] += (Game.sigma.dimensions[0].count / 1000 * 17);
        if(this.singularity.upgrades['100_u'].unlocked)
            ordinals[0] += 0.017;

        if(this.singularity.upgrades['e_gain'].times > 0) {
            let num = Game.OP.toSmallNumber();
            let gain = Math.max(
                (num / 10),
                Math.pow((num / 10), Game.sigma.conversion.rate)
            );
            gain = Math.min(gain, 1e100);
            gain /= 100;
            gain *= (this.singularity.upgrades['e_gain'].times);
            this.sigma.count += gain / 1000 * 17;
        }

        if(this.singularity.upgrades['auto_base'].unlocked) {
            this.debase();
        }

        update();
    },

    up: function() {
        ordinals[0]++;
        update();
    },
    debase: function() {
        let bcost = Game.price.debase.tiers[Game.price.debase.current];
        if(Game.OP.isLargerThan(bcost, true) && Game.base > 3) {
            ordinals = [0];
            Game.base--;
            Game.price.debase.current++;
            update();
            Game.updateText();
        }
    },
    unlockSigma: function() {

    },

    updateText: function() {
        let bcost = Game.price.debase.tiers[Game.price.debase.current];
        $('.base-cost').html(bcost.toString());
    },

    init: function() {
        setInterval(() => Game.singularity.render(), 17);
        setInterval(() => Game.sigma.update(), 17);
        setInterval(() => Game.tick(), 17);
    }
};

$(() => Game.init());
