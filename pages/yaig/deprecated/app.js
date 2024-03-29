const INFINITY = 2 ** 256;
const LOG10_INFINITY = 77.06367888997919;
const s=['K','M','B','T','Qd','Qt','Sx','Sp','Oc','No','Dc'];
const __=(n,p=0,w=0)=>n===null||n===undefined?'NaN':n.mag<0.001?(0).toFixed(p):n.e<3?n.toFixed(p):n.e<=s.length*3?n.div(`1e${n.e-n.e%3}`).toFixed(w)+' '+s[~~(n.e/3)-1]:n.toFixed(w);

/**
 * Toggles a button based on a condition.
 * Useful for styling.
 */
const toggleButton = function(element, query) {
    document.querySelector(element).classList[['remove', 'add'][0 | query]]('cant');
}
/**
 * Formats a Decimal to point based precision using the provided notation.
 * @param number Input number
 * @param precision Lowest precision decimals
 * @param precisionHigh Maximum decimals
 */
const F = function(number, precision = 3, precisionHigh = 3) {
    switch(options.data.notation) {
        case 'Scientific':
            if(number.lt(1e4)) return number.toFixed(precision);
            return number.toExponential(precisionHigh).replace('+', '').replace(/\.\d+\e/, (e) => {
                // shitty decimal hack function
                let no = e.slice(1, e.length - 1);
                while(no.length < precisionHigh) no += '0';
                return `.${no}e`;
            });
        case 'Mixed Scientific': 
            return __(number, precision, precisionHigh);
        case 'Logarithm':
            if(number.lt(1e4)) return number.toFixed(precision);
            return 'e' + Decimal.log10(number).toFixed(precisionHigh);
        case 'Infinity':
            if(number.lt(1e4)) return number.toFixed(precision);
            return Decimal.log(number, 2 ** 256).toFixed(precisionHigh) + '∞'
        case 'OTTFFSSENT':
            if(number.lt(1e4)) return number.toFixed(precision).replace('+', '').replace('e', 'E').replace(/1/g, 'o').replace(/2/g, 't').replace(/3/g, 'T').replace(/4/g, 'f').replace(/5/g, 'F').replace(/6/g, 's').replace(/7/g, 'S').replace(/8/g, 'e').replace(/9/g, 'n').replace(/0/g, 'z')
            return number.toExponential(precisionHigh).replace('+', '').replace('e', 'E').replace(/1/g, 'o').replace(/2/g, 't').replace(/3/g, 'T').replace(/4/g, 'f').replace(/5/g, 'F').replace(/6/g, 's').replace(/7/g, 'S').replace(/8/g, 'e').replace(/9/g, 'n').replace(/0/g, 'z')
        case 'Kanji':
            if(number.lt(1e4)) return number.toFixed(precision).replace('+', '').replace('.', '。').replace('e', 'ｅ').replace(/1/g, '一').replace(/2/g, '二').replace(/3/g, '三').replace(/4/g, '四').replace(/5/g, '五').replace(/6/g, '六').replace(/7/g, '七').replace(/8/g, '八').replace(/9/g, '九').replace(/0/g, '〇')
            return number.toExponential(precisionHigh).replace('+', '').replace('.', '。').replace('e', 'ｅ').replace(/1/g, '一').replace(/2/g, '二').replace(/3/g, '三').replace(/4/g, '四').replace(/5/g, '五').replace(/6/g, '六').replace(/7/g, '七').replace(/8/g, '八').replace(/9/g, '九').replace(/0/g, '〇')
        case 'Blind':
            return '';
        case 'Do I have it?':
            return number.gt(0) ? 'some' : 'no';
        default: return number.toFixed(precision);
    }
}

const player = {
    lastTick: Date.now(),
    achievements: [],
    points: new Decimal(2),

    resetPoints() {
        this.points = new Decimal(2);
    },

    get pointGain() {
        return this.generator.getGeneratorAmount(1).times(this.generator.getGeneratorMultiplier(1));
    },

    statistics: {

        totalTimePlayed: 0,
        timeInCurrentInfinity: 0,
        bestInfinityTime: Infinity,

        onSave($data) {
            $data.statistics = {
                totalTimePlayed: this.totalTimePlayed,
                timeInCurrentInfinity: this.timeInCurrentInfinity,
                bestInfinityTime: this.bestInfinityTime
            }
            return $data;
        },

        onLoad($data) {
            if(!('statistics' in $data)) return;
            this.totalTimePlayed = $data.statistics.totalTimePlayed ?? 0;
            this.timeInCurrentInfinity = $data.statistics.timeInCurrentInfinity ?? 0;
            this.bestInfinityTime = $data.statistics.bestInfinityTime ?? 0;
        },

        onTick(delta) {
            this.totalTimePlayed += 1000 / delta;
            this.timeInCurrentInfinity = this.totalTimePlayed;
        },

        onRender() {
            $('.total-time-played').text(new Date(this.totalTimePlayed).toISOString().slice(11, 23));
            $('.time-in-current-infinity').text(new Date(this.timeInCurrentInfinity).toISOString().slice(11, 23));
        },

        onReset() {
            this.totalTimePlayed = 0;
            this.timeInCurrentInfinity = 0;
            this.bestInfinityTime = 0;
        }
    },

    // finished
    generator: {
        generators: {
            1: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 1), baseCostScaling: new Decimal(2) },
            2: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 7), baseCostScaling: new Decimal(2) },
            3: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 12), baseCostScaling: new Decimal(4) },
            4: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 19), baseCostScaling: new Decimal(4) },
            5: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 27), baseCostScaling: new Decimal(6) },
            6: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 46), baseCostScaling: new Decimal(6) },
            7: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 64), baseCostScaling: new Decimal(8) },
            8: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 82), baseCostScaling: new Decimal(8) },
        },

        buyGenerator(x) {
            const cost = this.getGeneratorCost(x);
            if(!this.canAffordGenerator(x)) return false;
            player.points = player.points.minus(cost);
            this.generators[x].purchased = this.generators[x].purchased.plus(1);
            this.generators[x].amount = this.generators[x].amount.plus(1);
            return true;
        },

        buyMaxGenerator(x) {
            let can = true;
            do { can = this.buyGenerator(x) } while(can);
        },

        canAffordGenerator(x) {
            // do not buy when the generator has not been unlocked yet!
            if(player.collapse.count.plus(4).lt(x)) return false;
            return player.points.gte(this.getGeneratorCost(x));
        },

        getGeneratorAmount(x) {
            return this.generators[x]?.amount ?? new Decimal(0);
        },

        getGeneratorCost(x) {
            return this.generators[x].baseCost.times(Decimal.pow(this.generators[x].baseCostScaling, this.generators[x].purchased));
        },

        getGeneratorGain(x) {
            return this.getGeneratorAmount(x)
                .times(this.getGeneratorMultiplier(x))
                .div(8)
        },

        getGeneratorPercentageGain(x) {
            return Decimal.max(0, this.getGeneratorGain(x + 1).div(this.getGeneratorAmount(x)).times(100));
        },

        getGeneratorMultiplier(x) {
            let multiplier = (player.boost.effect)
                .times(this.generators[x]?.purchased ?? 0)
                .plus(1)
            return multiplier;
        },

        onTick(delta) {
            for(let i = 1; i <= 7; i++) {
                this.generators[i].amount = this.generators[i].amount.plus(
                    this.getGeneratorGain(i + 1).div(delta)
                );
            }
        },

        onRender() {
            for(let i = 1; i <= 8; i++) {
                $(`.generator-amount-${i}`).text(F(this.generators[i].amount));
                $(`.generator-multiplier-${i}`).text('x'+F(this.getGeneratorMultiplier(i)));
                $(`.generator-cost-${i}`).text(F(this.getGeneratorCost(i), 0, 3));
                $(`.generator-gain-${i}`).text('(+' + F(this.getGeneratorPercentageGain(i), 3, 3) + '%)');
                toggleButton(`.btn-generator-${i}`, !this.canAffordGenerator(i))
            }
        },

        onSave($data) {
            $data.generators = {};
            for(let i = 1; i <= 8; i++) {
                $data.generators[i] = [ this.generators[i].amount.toString(), this.generators[i].purchased.toString() ];
            }
            return $data;
        },

        onLoad($data) {
            if(!'generators' in $data) return;
            for(let i = 1; i <= 8; i++) {
                this.generators[i].amount = new Decimal($data.generators[i][0]);
                this.generators[i].purchased = new Decimal($data.generators[i][1]);
            }
        },

        onReset() {
            for(let i = 1; i <= 8; i++) {
                this.generators[i].amount = new Decimal(0);
                this.generators[i].purchased = new Decimal(0);
            }
        }
    },

    // finished
    boost: {
        base: 0.15,
        amount: new Decimal(0),

        get multiplier() {
            return Decimal
                .plus(this.base, player.infinity.effect)
                .plus(player.collapse.count.times(0.10))
                .times(player.prestige.effect)
        },

        get cost() {
            return Decimal.times(64, Decimal.pow(8, this.amount));   
        },

        get effectOne() {
            return this.multiplier;
        },

        get effect() {
            return Decimal.times(
                this.multiplier,
                this.amount.plus(player.infinity.freeBoosterEffect)
            );
        },

        get gain() {
            return Decimal.times(
                this.multiplier,
                this.amount.plus(player.infinity.freeBoosterEffect).plus(1)
            );
        },

        get canAfford() {
            return player.points.gte(this.cost);
        },

        onBuy() {
            if(!this.canAfford) return false;
            player.points = player.points.minus(this.cost);
            this.amount = this.amount.plus(1);
            return true;
        },

        onRender() {
            $('.current-boost').text(F(this.effect, 2));
            $('.next-boost').text(F(this.gain, 2));
            $('.boost-cost').text(F(this.cost, 0, 3));
            $('.boost-count').text(F(this.amount, 0, 3));
            $('.boost-amount').text(F(this.effectOne, 2));
            toggleButton('.btn-boost', !this.canAfford);
        },

        onBuyMax() {
            let can = true;
            do { can = this.onBuy() } while(can);
        },

        onSave($data) {
            $data.boost = this.amount.toString();
            return $data;
        },

        onLoad($data) {
            if('boost' in $data)
            this.amount = new Decimal($data.boost);
        },

        onReset() {
            this.amount = new Decimal(0)
        }
    },

    // finished
    collapse: {
        count: new Decimal(0),

        get canDisplay() {
            return (this.count.gt(0) || player.generator.getGeneratorAmount(4).gt(0)) && this.count.lt(4);
        },

        get canAfford() {
            return player.generator.getGeneratorAmount(this.count.toNumber() + 4).gte(10);
        },

        onClick() {
            const collapseCount = this.count.toNumber();
            if(player.generator.generators[collapseCount + 3].amount.gte(10)) {
                player.generator.onReset();
                this.count = this.count.plus(1);
                player.resetPoints();
                player.boost.onReset();
            }
        },

        onRender() {
            // show/hide dimensions
            for(let x = 1; x <= 8; x++) {
                $(`.gen-${x}`).toggle(this.count.plus(4).gte(x));
            }

            $('.btn-collapse').toggle(this.canDisplay);
            $('.collapse-need').text(this.count.toNumber() + 4);
            toggleButton('.btn-collapse', !this.canAfford);
        },

        onSave($data) {
            $data.collapseCount = this.count;
            return $data;
        },

        onLoad($data) {
            if('collapseCount' in $data)
            this.count = new Decimal($data.collapseCount);
        },

        onReset() {
            this.count = new Decimal(0);
        }
        
    },

    // finished - requires balancing
    prestige: {
        multiplier: new Decimal(1),

        get canDisplay() {
            return player.collapse.count.gte(4);
        },

        get canAfford() {
            return player.generator.generators[8].amount.gte(10) && this.gain.gt(this.effect);
        },
        
        get effect() {
            return this.multiplier;
        },

        get gain() {
            if(player.points.lt(2 ** 82)) return this.multiplier;
            return Decimal.log(player.points.div(2 ** 82).plus(1), 16);
        },

        get ratio() {
            if(this.gain.lt(this.multiplier)) return new Decimal(1);
            return this.gain.div(this.multiplier);
        },

        onPrestige() {
            if(!this.canAfford) return;
            this.multiplier = this.gain;

            player.points = new Decimal(2);
            player.generator.onReset();
            player.boost.onReset();
            player.collapse.onReset();
        },

        onRender() {
            $('.prestige-multiplier').toggle(this.multiplier.gt(1));
            $('.prestige-multi').text(`${F(this.effect, 3)}`);

            $('.prestige').toggle(this.canDisplay);
            $('.current-prestige-bonus').text(`${F(this.effect, 3)}x`);
            $('.next-prestige-bonus').text(`${F(Decimal.max(this.gain, this.multiplier), 3)}x`);
            $('.ratio-prestige-bonus').text('x' + F(this.ratio, 3));
            toggleButton('.btn-prestige', !this.canAfford);
        },

        onSave($data) {
            $data.prestige = this.multiplier.toString();
            return $data;
        },

        onLoad($data) {
            if('prestige' in $data)
            this.multiplier = new Decimal($data.prestige);
        },

        onReset() {
            this.multiplier = new Decimal(1);
        },
    },

    autobuyers: {
        timer: 0,

        states: {
            'ab-1': { cost: 1e10, unlocked: false, slow: true, enabled: false },
            'ab-2': { cost: 1e15, unlocked: false, slow: true, enabled: false },
            'ab-3': { cost: 1e20, unlocked: false, slow: true, enabled: false },
            'ab-4': { cost: 1e25, unlocked: false, slow: true, enabled: false },
            'ab-5': { cost: 1e30, unlocked: false, slow: true, enabled: false },
            'ab-6': { cost: 1e35, unlocked: false, slow: true, enabled: false },
            'ab-7': { cost: 1e40, unlocked: false, slow: true, enabled: false },
            'ab-8': { cost: 1e45, unlocked: false, slow: true, enabled: false },
            'ab-b': { cost: 1e50, unlocked: false, slow: true, enabled: false },
        },

        buy(id) {
            if(!player.points.gte(this.states[id].cost)) return;
            player.points = player.points.minus(this.states[id].cost);
            this.states[id].unlocked = true;
            this.states[id].enabled = true;
        },

        toggle(id) {
            if(!this.states[id].unlocked) return;
            this.states[id].enabled ^= true;
        },

        toggleAll(state) {
            for(let value of Object.values(this.states)) {
                value.enabled = state;
            }
        },

        onTick(delta) {
            if(player.points.gte(INFINITY) && !player.infinity.broken) return;

            // purchase fast autobuyers
            for(let [id, state] of Object.entries(this.states)) {
                if(state.slow || !state.enabled || !state.unlocked) continue;
                switch(id) {
                    case 'ab-1': player.generator.buyMaxGenerator(1); break;
                    case 'ab-2': player.generator.buyMaxGenerator(2); break;
                    case 'ab-3': player.generator.buyMaxGenerator(3); break;
                    case 'ab-4': player.generator.buyMaxGenerator(4); break;
                    case 'ab-5': player.generator.buyMaxGenerator(5); break;
                    case 'ab-6': player.generator.buyMaxGenerator(6); break;
                    case 'ab-7': player.generator.buyMaxGenerator(7); break;
                    case 'ab-8': player.generator.buyMaxGenerator(8); break;
                    case 'ab-b': player.boost.onBuyMax(); break;
                }
            }

            this.timer += 1000 / delta;
            if(this.timer < 4000) return;
            this.timer = 0;

            // purchase slow autobuyers
            for(let [id, state] of Object.entries(this.states)) {
                if(!state.slow || !state.enabled || !state.unlocked) continue;
                switch(id) {
                    case 'ab-1': player.generator.buyMaxGenerator(1); break;
                    case 'ab-2': player.generator.buyMaxGenerator(2); break;
                    case 'ab-3': player.generator.buyMaxGenerator(3); break;
                    case 'ab-4': player.generator.buyMaxGenerator(4); break;
                    case 'ab-5': player.generator.buyMaxGenerator(5); break;
                    case 'ab-6': player.generator.buyMaxGenerator(6); break;
                    case 'ab-7': player.generator.buyMaxGenerator(7); break;
                    case 'ab-8': player.generator.buyMaxGenerator(8); break;
                    case 'ab-b': player.boost.onBuyMax(); break;
                }
            }
        },

        onRender() {
            for(let [id, state] of Object.entries(this.states)) {
                let $button = $(`.btn-${id}`),
                    $div    = $(`.div-${id}`),
                    $check  = $(`.chk-${id}`);
                
                $check.prop('checked', state.enabled);
                $button.toggle(!state.unlocked);
                $div.toggle(state.unlocked);
            }
        },

        onSave($data) {
            $data.abstates = JSON.parse(JSON.stringify(this.states));
            return $data;
        },

        onLoad($data) {
            if(!'abstates' in $data) return;
            this.states = JSON.parse(JSON.stringify($data.abstates));
        }
    },

    // REDO THIS ENTIRE THING GOD
    infinity: {
        points: new Decimal(0),
        power: new Decimal(0),
        infinities: new Decimal(0),
        unlocked: false,
        broken: false,

        sacrificeBoost: {
            amount: new Decimal(0),

            get cost() {
                return Decimal.times(4, Decimal.pow(16, this.amount));
            },

            get effect() {
                return Decimal.times(0.125, this.amount).plus(1);
            },

            get effectNext() {
                return Decimal.times(0.125, this.amount.plus(1)).plus(1);
            },

            canAfford() {
                return this.cost.lte(player.infinity.points);
            },

            buy() {
                if(!this.canAfford()) return false;
                player.infinity.points = player.infinity.points.minus(this.cost);
                this.amount = this.amount.plus(1);
                return true;
            },

            buyMax() {
                let can = true;
                do { can = this.buy() } while(can);
            },

            onRender() {
                $('.sacrifice-boost-amount').text(`^${F(this.effect, 3)}`);
                $('.sacrifice-boost-amount-next').text(`^${F(this.effectNext, 3)}`);

                toggleButton(`.sacrifice-boost-button`, !this.canAfford());
                $('.sacrifice-boost-button').text(`Cost: ${F(this.cost, 0, 3)}`);
            },

            onSave($data) {
                $data.sacrificeBoost = this.amount.toString();
                return $data;
            },

            onLoad($data) {
                if(!'sacrificeBoost' in $data) return;
                this.amount = new Decimal($data.sacrificeBoost);
            }
        },

        boostPerInfG: {
            amount: new Decimal(0),

            get cost() {
                return Decimal.times(4, Decimal.pow(8, this.amount));
            },

            get effect() {
                return Decimal.times(0.250, this.amount).plus(0.025);
            },

            get effectNext() {
                return Decimal.times(0.250, this.amount.plus(1)).plus(0.025);
            },

            canAfford() {
                return this.cost.lte(player.infinity.points);
            },

            buy() {
                if(!this.canAfford()) return false;
                player.infinity.points = player.infinity.points.minus(this.cost);
                this.amount = this.amount.plus(1);
                return true;
            },

            buyMax() {
                let can = true;
                do { can = this.buy() } while(can);
            },

            onRender() {
                $('.infg-boost-amount').text(`${F(this.effect.plus(1), 3)}x`);
                $('.infg-boost-amount-next').text(`${F(this.effectNext.plus(1), 3)}x`);

                toggleButton(`.infg-boost-button`, !this.canAfford());
                $('.infg-boost-button').text(`Cost: ${F(this.cost, 0, 3)}`);
            },

            onSave($data) {
                $data.boostPerInfG = this.amount.toString();
                return $data;
            },

            onLoad($data) {
                if(!'boostPerInfG' in $data) return;
                this.amount = new Decimal($data.boostPerInfG);
            }
        },

        generators: {
            1: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 2) },
            2: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 4) },
            3: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 8) },
            4: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 16) },
            5: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 24) },
            6: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 32) },
            7: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 48) },
            8: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 64) },
        },

        buyGenerator(x) {
            const cost = this.getGeneratorCost(x);
            if(!this.canAffordGenerator(x)) return false;
            this.points = this.points.minus(cost);
            this.generators[x].purchased = this.generators[x].purchased.plus(1);
            this.generators[x].amount = this.generators[x].amount.plus(1);
            return true;
        },

        buyMaxGenerator(x) {
            let can = true;
            do { can = this.buyGenerator(x) } while(can);
        },

        canAffordGenerator(x) {
            return this.points.gte(this.getGeneratorCost(x));
        },

        getGeneratorAmount(x) {
            return this.generators[x].amount;
        },

        getGeneratorCost(x) {
            return this.generators[x].baseCost.times(Decimal.pow(8, this.generators[x].purchased));
        },

        getGeneratorMultiplier(x) {
            return Decimal.times(this.generators[x].purchased, player.infinity.boostPerInfG.effect).plus(1).times(this.infinitiesMult);
        },

        get freeBoosterEffect() {
            return Decimal.sqrt(this.infinities).floor();
        },

        get infinityPowerPerSecond() {
            return this.getGeneratorAmount(1)
            .times(this.getGeneratorMultiplier(1))
        },

        get infinitiesMult() {
            return Decimal.times(this.infinities, 0.005).plus(1);
        },

        get effect() {
            return Decimal.max(0, this.power.div(1000));
        },

        get gain() {
            return Decimal.log(player.points, INFINITY).times(4);
        },

        onGain() {
            this.points = this.points.plus(this.gain);
            this.power = new Decimal(0);
            this.unlocked = true;
            this.infinities = this.infinities.plus(1);

            player.points = new Decimal(2);
            player.generator.onReset();
            player.boost.onReset();
            player.prestige.onReset();

            for(let i = 1; i <= 8; i++) {
                this.generators[i].amount = new Decimal(this.generators[i].purchased);
            }

            showTab(lastTabShown);
        },

        onTick(delta) {
            for(let i = 1; i <= 7; i++) {
                this.generators[i].amount = this.generators[i].amount.plus(
                    this.getGeneratorAmount(i + 1)
                    .times(this.getGeneratorMultiplier(i + 1))
                    .div(delta)
                );
            }

            this.power = this.power.plus(
                this.getGeneratorAmount(1)
                .times(this.getGeneratorMultiplier(1))
                .div(delta)
            );
        },
        
        onRender() {
            if(player.points.gte(INFINITY)) {
                if(!this.broken) {
                    player.points = new Decimal(INFINITY);
                    $('.tab-generators').hide();
                    $('.points').text('infinite');
                    $('.gain').text('0');
                }
            }
            $('.infinity-points').text(F(this.points, 0, 3));
            $('.btn-gain-infinity').toggle(player.points.gte(INFINITY));
            $('.nav-infinity').toggle(this.unlocked);
            $('.nav-challenges').toggle(this.unlocked);
            $('.infinity-points').toggle(this.unlocked);
            $('.infinity-gain').text(this.gain);
            $('.infinity-generator-power').text(F(this.power));
            $('.infinity-generator-effect').text(F(this.effect));
            $('.infinity-count').text(F(this.infinities, 0, 3));
            $('.infinity-count-multiplier').text(F(this.infinitiesMult, 3));
            $('.infinity-generator-power-gain').text(F(this.infinityPowerPerSecond, 3));
            $('.free-booster-count').text(F(this.freeBoosterEffect, 0, 3));

            this.sacrificeBoost.onRender();
            this.boostPerInfG.onRender();

            for(let i = 1; i <= 8; i++) {
                $(`.infinity-generator-amount-${i}`).text(F(this.generators[i].amount));
                $(`.infinity-generator-multiplier-${i}`).text('x'+F(this.getGeneratorMultiplier(i)));
                $(`.infinity-generator-cost-${i}`).text(F(this.getGeneratorCost(i), 0, 3));
                toggleButton(`.btn-infinity-generator-${i}`, !this.canAffordGenerator(i))
            }
        },

        onSave($data) {
            $data.infinity = {
                points: this.points.toString(),
                power: this.power.toString(),
                infinities: this.infinities.toString(),
                unlocked: this.unlocked,
                broken: this.broken,
                generators: {}
            };
            for(let i = 1; i <= 8; i++) {
                $data.infinity.generators[i] = [ this.generators[i].amount.toString(), this.generators[i].purchased.toString() ];
            }

            $data = this.sacrificeBoost.onSave($data);
            $data = this.boostPerInfG.onSave($data);

            return $data;
        },

        onLoad($data) {
            if(!'infinity' in $data) return;
            this.points = new Decimal($data.infinity.points);
            this.power = new Decimal($data.infinity.power);
            this.infinities = new Decimal($data.infinity.infinities);
            this.unlocked = $data.infinity.unlocked;
            this.broken = $data.infinity.broken;
            for(let i = 1; i <= 8; i++) {
                this.generators[i].amount = new Decimal($data.infinity.generators[i][0]);
                this.generators[i].purchased = new Decimal($data.infinity.generators[i][1]);
            };

            this.sacrificeBoost.onLoad($data);
            this.boostPerInfG.onLoad($data);
        },

        onReset() {

        }
    }
}

function maxAll() {
    for(let i = Decimal.plus(4, Decimal.min(player.collapse.count, 4)); i >= 1; i--) {
        player.generator.buyMaxGenerator(i);
    }
    player.boost.onBuyMax();
}

/**
 * Hotkey list.
 */
const hotkeys = {
    m: function() {
        if(!options.data.hotkeys) return;
        maxAll();
    },
    p: function() {
        if(!options.data.hotkeys) return;
        player.prestige.onPrestige();
    },
}

/**
 * Main function, used for updates and rendering.
 */
function main() {

    function setTimeInGame() {
        const $element = $('.time-in-game');
        $($element.text(new Date(then).toISOString().slice(11, 23)))
    };

    let then;

    function tick(now) {
        if(!then) {
            then = now;
            requestAnimationFrame(tick);
            return;
        }
        let delta = 1000 / (now - then);
        then = now;

        setTimeInGame();

        player.points = player.points.plus(player.pointGain.div(delta));
        player.lastTick = Date.now();

        for(let entry of Object.values(player)) {
            entry.onTick?.(delta);
        }

        $('.points').text(F(player.points));
        $('.gain').text(F(player.pointGain));

        for(let entry of Object.values(player)) {
            entry.onRender?.();
        }

        let percentage = Decimal.max(0, Decimal.log10(player.points).div(LOG10_INFINITY).times(100));
        $(`.infinity-percentage-label`).text(F(percentage, 2) + '% to Infinity');
        $('.infinity-percentage-value').css('width', percentage.toNumber() + '%');

        let epercentage = Decimal.max(0, Decimal.log10(player.infinity.points).div(LOG10_INFINITY).times(100));
        $(`.eternity-percentage-label`).text(F(epercentage, 2) + '% to Eternity');
        $('.eternity-percentage-value').css('width', epercentage.toNumber() + '%');
        
        updateAchievements();

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

/**
 * DOM Content loaded ? start the application.
 */
document.addEventListener('DOMContentLoaded', main);
document.addEventListener('keydown', (e) => { hotkeys[e.key]?.(); });
