import '../lib/break_eternity.mjs';
const defaultRefreshRate = 1000 / 60;
const LOG_INFINITY = 77.06367888997919;
const INFINITY = 2 ** 256;

const player = {
    points: new Decimal(2),
    lastTick: Date.now(),

    // generator layer
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
    boosts: new Decimal(0),
    collapses: new Decimal(0),
    prestige: new Decimal(1), // 1e33 is start

    // infinity layer
    infinityPoints: new Decimal(0),
    infinities: new Decimal(0),

    options: {
        notation: 'Scientific',
        theme: 'Dark',
        hotkeys: true,
        newsticker: true,
        autosave: {
            interval: 10,
            fn: null
        }
    },

    statistics: {
        timeInCurrentInfinity: 0
    }
}

const fn = {
    offlineTickSpeed: 100,

    points: {
        amount() {
            return player.points;
        },

        gain() {
            let gain = fn.generators.amount(1).times(fn.generators.multiplier(1));
            gain = Decimal.min(gain, 2 ** 256);
            return gain;
        },

        reset() {
            player.points = new Decimal(2);
        }
    },

    generators: {
        buy(x) {
            const cost = this.cost(x);
            if(!this.canAfford(x)) return false;
            player.points = player.points.minus(cost);
            player.generators[x].purchased = player.generators[x].purchased.plus(1);
            player.generators[x].amount = player.generators[x].amount.plus(1);
            return true;
        },

        buyMax(x) {
            let can = true;
            do { can = this.buy(x) } while(can);
        },

        cost(x) {
            return player.generators[x].baseCost.times(
                Decimal.pow(player.generators[x].baseCostScaling, player.generators[x].purchased)
            );
        },

        canAfford(x) {
            if(player.collapses.plus(4).lt(x)) return false;
            return player.points.gte(this.cost(x));
        },

        amount(x) {
            return player.generators[x].amount;
        },

        gain(x) {
            return this.amount(x)
                .times(this.multiplier(x))
                .div(8)
        },

        percentageGain(x) {
            if(x >= 8) return new Decimal(0);
            return Decimal.max(0, this.gain(1 + x).div(this.amount(x)).times(100));
        },

        multiplier(x) {
            let multiplier = fn.boosts.effect()
                .times(player.generators[x]?.purchased)
                .plus(1)
                .pow(fn.prestige.amount());
            return multiplier;
        },

        reset() {
            for(let i = 1; i <= 8; i++) {
                player.generators[i].amount = new Decimal(0);
                player.generators[i].purchased = new Decimal(0);
            }
        }
    },

    boosts: {
        amount() {
            return player.boosts;
        },

        cost() {
            const baseCost = new Decimal(64);
            const costScaling = new Decimal(8);

            return Decimal.times(baseCost, Decimal.pow(costScaling, this.amount()));
        },

        canAfford() {
            return player.points.gte(this.cost());
        },

        buy() {
            const cost = this.cost();
            if(!this.canAfford()) return false;
            player.points = player.points.minus(cost);
            player.boosts = player.boosts.plus(1);
            return true;
        },

        buyMax() {
            let can = true;
            do { can = this.buy() } while(can);
        },

        multiplier() {
            return new Decimal(0.125).times(fn.collapses.amount().plus(1));
        },

        effect() {
            return player.boosts.times(this.multiplier());
        },

        reset() {
            player.boosts = new Decimal(0);
        }
    },

    collapses: {
        amount() {
            return player.collapses;
        },

        visible() {
            return (this.amount().gt(0) || fn.generators.amount(4).gt(0)) && this.amount().lt(4);
        },

        canAfford() {
            return fn.generators.amount(this.amount().toNumber() + 4).gte(10);
        },

        buy() {
            if(!this.canAfford()) return false;
            fn.generators.reset();
            fn.boosts.reset();
            fn.points.reset();
            player.collapses = player.collapses.plus(1);
            return true;
        },

        reset() {
            player.collapses = new Decimal(0);
        }
    },

    prestige: {
        amount() {
            return player.prestige;
        },

        visible() {
            return fn.collapses.amount().gte(4);
        },

        canAfford() {
            return fn.generators.amount(8).gte(10) && this.gain().gt(this.amount());
        },

        gain() {
            return Decimal.min(2.5, Decimal.max(Decimal.log(fn.points.amount(), INFINITY).times(1.5).plus(1), this.amount()));
        },

        buy() {
            if(!this.canAfford()) return false;
            player.prestige = this.gain();
            fn.points.reset();
            fn.generators.reset();
            fn.boosts.reset();
            fn.collapses.reset();
            return true;
        },

        reset() {
            player.prestige = new Decimal(1);
        }
    },

    infinityPoints: {
        amount() {
            return player.infinityPoints;
        },

        canAfford() {
            return player.points.gte(2 ** 256);
        },

        buy() {
            fn.points.reset();
            fn.boosts.reset();
            fn.generators.reset();
            fn.collapses.reset();
            fn.prestige.reset();
    
            player.statistics.timeInCurrentInfinity = 0;
            player.infinities = player.infinities.plus(1);
            player.infinityPoints = player.infinityPoints.plus(2); // v1.1 - add get gain
        }
    },

    infinities: {
        amount() {
            return player.infinities;
        }
    },

    onTick(delta) {
        player.points = player.points.plus(fn.points.gain().div(delta));
        player.points = Decimal.min(player.points, 2 ** 256);
        player.lastTick = Date.now();

        // Update generators
        for(let i = 1; i <= 7; i++) {
            player.generators[i].amount = player.generators[i].amount.plus(
                fn.generators.gain(i + 1).div(delta)
            );
        }

        // Update statistics (replace somewhere else???)
        player.statistics.timeInCurrentInfinity += 1000 / delta;
        player.statistics.bestPoints = Decimal.max(fn.points.amount(), player.statistics.bestPoints);
    }
}

const methods = {

    /* Options */

    setNotation(notation) {
        player.options.notation = notation;

        postMessage({
            fn: 'render',
            result: {
                key: 'notation',
                value: notation
            }
        });
    },

    setAutoSaveInterval(interval) {
        player.options.autosave.interval = interval;
        if(player.options.autosave.fn) clearInterval(player.options.autosave.fn);
        if(interval != 0) {
            player.options.autosave.fn = setInterval(() => this.autosave(), interval * 1000);
        }

        postMessage({
            fn: 'render',
            result: {
                key: 'autoSaveInterval',
                value: interval
            }
        });

        return {};
    },

    toggleHotkeys() {
        hotkeys ^= true;
        return { value: player.options.hotkeys }
    },

    toggleNews() {
        news ^= true;
        return { value: player.options.news }
    },

    export() {
        return { savegame: btoa(JSON.stringify(player)) };
    },

    autosave() {
        postMessage({
            fn: 'save',
            result: this.save()
        });
    },

    save() {
        return { savegame: btoa(JSON.stringify(player)) };
    },

    load(saveString) {
        const data = JSON.parse(atob(saveString));

        // Load points
        player.points = new Decimal(data.points ?? 2);
        player.lastTick = data.lastTick ?? Date.now();
        
        // Load generators
        for(let i = 1; i <= 8; i++) {
            player.generators[i].amount = new Decimal(data.generators[i].amount ?? 0);
            player.generators[i].purchased = new Decimal(data.generators[i].purchased ?? 0);
        }

        // Load boosts
        player.boosts = new Decimal(data.boosts ?? 0);

        // Load collapses
        player.collapses = new Decimal(data.collapses ?? 0);

        // load prestige
        player.prestige = new Decimal(data.prestige ?? 1);

        // load options
        player.options.autosave.interval = parseInt(data.options.autosave.interval ?? 0);
        player.options.notation = data.options.notation ?? 'Scientific';

        // load infinity data
        player.infinityPoints = new Decimal(data.infinityPoints ?? 0);
        player.infinities = new Decimal(data.infinities ?? 0);

        // load statistics
        player.statistics.timeInCurrentInfinity = parseFloat(data.statistics?.timeInCurrentInfinity) ?? 0;

        this.init();

        return {};
    },

    /* Rendering */

    render(key) {
        switch(key) {
            case 'points': return {
                key: key,
                value: {
                points: fn.points.amount(),
                pointgen: fn.points.gain()
            } };

            case 'generators': return {
                key: key,
                value: Object.entries(player.generators)
                .filter(([i, _g]) => i <= Decimal.max(4, Decimal.plus(4, fn.collapses.amount())))
                .map(([i, g]) => [i, {
                    amount: g.amount,
                    multiplier: fn.generators.multiplier(i),
                    cost: fn.generators.cost(i),
                    gain: fn.generators.percentageGain(parseInt(i)),
                    canAfford: fn.generators.canAfford(i)
                }])
            }

            case 'boost': return {
                key: key,
                value: {
                    amount: fn.boosts.amount(),
                    cost: fn.boosts.cost(),
                    canAfford: fn.boosts.canAfford(),
                    multiplier: fn.boosts.multiplier(),
                    effect: fn.boosts.effect()
                }
            }

            case 'collapse': return {
                key: key,
                value: {
                    amount: fn.collapses.amount(),
                    visible: fn.collapses.visible(),
                    canAfford: fn.collapses.canAfford()
                }
            }

            case 'prestige': return {
                key: key,
                value: {
                    amount: fn.prestige.amount(),
                    visible: fn.prestige.visible(),
                    canAfford: fn.prestige.canAfford(),
                    gain: fn.prestige.gain()
                }
            }

            case 'statistics': return {
                key: key,
                value: {
                    timeInCurrentInfinity: player.statistics.timeInCurrentInfinity,
                    infinities: player.infinities,
                    bestPoints: player.statistics.bestPoints
                }
            }

            case 'infinity': return {
                key: key,
                value: {
                    canAfford: fn.infinityPoints.canAfford(),
                    ipGained: new Decimal(2),
                    infinityPoints: player.infinityPoints,
                    infinities: player.infinities
                }
            }
        }

        return {};
    },

    init() {
        let now = Date.now();
        let last = player.lastTick;
        let delta = now - last;

        function loop() {
            if(last < now) {
                postMessage({
                    fn: 'offline',
                    result: {
                        fromDate: last,
                        toDate: now,
                        progress: (delta - now) + last,
                        max: delta,
                        status: 'pending'
                    }});
                last += fn.offlineTickSpeed;
                fn.onTick(1000 / fn.offlineTickSpeed);
                setTimeout(loop, 0);
            } else {
                postMessage({
                    fn: 'offline',
                    result: {
                        fromDate: last,
                        toDate: now,
                        progress: (delta - now) + last,
                        max: delta,
                        status: 'complete'
                    }});
                setInterval(() => fn.onTick(60), defaultRefreshRate);
            }
        }
        loop();

        this.setAutoSaveInterval(player.options.autosave.interval);
        this.setNotation(player.options.notation);

        return {};
    },

    increaseOfflineTickSpeed() {
        fn.offlineTickSpeed *= 2;
        return {};
    },

    /* Gameplay */

    buyGenerator(x) {
        fn.generators.buy(x);
        return {};
    },

    buyMaxGenerator(x) {
        fn.generators.buyMax(x);
        return {};
    },

    buyBoost() {
        fn.boosts.buy();
        return {};
    },

    buyMaxBoost() {
        fn.boosts.buyMax();
        return {};
    },

    buyCollapse() {
        fn.collapses.buy();
        return {};
    },

    buyMaxAll() {
        this.buyMaxBoost();
        for(let i = 1; i <= 8; i++) {
            this.buyMaxGenerator(i);
        }
        return {};
    },

    buyPrestige() {
        fn.prestige.buy();
        return {};
    },

    doInfinity() {
        fn.infinityPoints.buy();
        return {};
    }
}

onmessage = (msg) => {
    if(!methods[msg.data.fn]) throw `Couldn't find function "${msg.data.fn}".`;

    const result = methods[msg.data.fn]?.(...msg.data.args);

    postMessage({
        fn: msg.data.fn,
        args: msg.data.args,
        result: result
    });
}