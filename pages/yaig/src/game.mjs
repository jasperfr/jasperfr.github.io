import '../lib/break_eternity.mjs';
const defaultRefreshRate = 1000 / 60;
const LOG_INFINITY = 77.06367888997919;
const INFINITY = 2 ** 256;
const kvpChallenges = {
    1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,
    'b':9,'c':10,'p':11,'i':12
};

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
    infinityGenerators: {
        1: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 1), baseCostScaling: new Decimal(2) },
        2: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 4), baseCostScaling: new Decimal(2) },
        3: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 8), baseCostScaling: new Decimal(4) },
        4: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 16), baseCostScaling: new Decimal(4) },
        5: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 32), baseCostScaling: new Decimal(6) },
        6: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 64), baseCostScaling: new Decimal(6) },
        7: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 96), baseCostScaling: new Decimal(8) },
        8: { amount: new Decimal(0), purchased: new Decimal(0), baseCost: new Decimal(2 ** 128), baseCostScaling: new Decimal(8) },
    },
    infinityPower: new Decimal(0),

    autobuyers: {
        '1': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e10' },
        '2': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e15' },
        '3': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e20' },
        '4': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e25' },
        '5': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e30' },
        '6': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e35' },
        '7': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e40' },
        '8': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e45' },
        'b': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e50' }, // booster autobuyer
        'c': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e60' }, // collapse autobuyer
        'p': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1e70', mode: 'time', value: 10.0 }, // prestige autobuyer
        'i': { unlocked: false, enabled: false, max: true, slow: true, delta: 0, cost: '1.16e77', mode: 'time', value: 10.0 }, // infinity autobuyer
    },

    inChallenge: null,
    challenges: [],
    challenge5mult: new Decimal(0),

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
            if(!fn.challenges.isCompleted(kvpChallenges[x])) {
                player.points = player.points.minus(cost);
            }
            player.generators[x].purchased = player.generators[x].purchased.plus(1);
            player.generators[x].amount = player.generators[x].amount.plus(1);

            // challenge 2
            if(player.inChallenge === 2 && x > 1) {
                for(let i = x - 1; i >= 1; i--) {
                    player.generators[i].amount = new Decimal(0);
                }
            }

            if(player.inChallenge === 5) {
                player.challenge5mult = new Decimal(0);
            }

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
            if(player.inChallenge === 6 && this.amount(x).gte(10)) return false;
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
                .pow((player.inChallenge === 7 && x > 5) ? 1 : fn.prestige.amount())
                .pow(player.inChallenge === 3 && x == 1 && fn.generators.amount(8).gte(10) ? 8 : 1)
                .pow(player.inChallenge === 4 ? 5 : 1)
                .times(player.inChallenge === 5 ? player.challenge5mult : 1)
                .times(fn.infinityPower.effect())
                .times(fn.challenges.bonus())
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
            if(!fn.challenges.isCompleted(kvpChallenges['b'])) {
                player.points = player.points.minus(cost);
            }
            player.boosts = player.boosts.plus(1);

            if(player.inChallenge === 5) {
                player.challenge5mult = new Decimal(0);
            }

            return true;
        },

        buyMax() {
            let can = true;
            do { can = this.buy() } while(can);
        },

        multiplier() {
            let multi = new Decimal(0.125).times(fn.collapses.amount().plus(1));
            return multi;
        },

        effect() {
            if(player.inChallenge === 9) return player.boosts.times(this.multiplier()).sqrt();
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
            if(player.inChallenge === 4) return false;
            return fn.generators.amount(this.amount().toNumber() + 4).gte(10);
        },

        buy() {
            if(!this.canAfford()) return false;
            fn.generators.reset();
            fn.boosts.reset();
            fn.points.reset();
            player.collapses = player.collapses.plus(1);

            if(player.inChallenge === 5) {
                player.challenge5mult = new Decimal(0);
            }

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
            if(player.inChallenge === 3) return false;
            return fn.generators.amount(8).gte((player.inChallenge === 8) ? 30 : 10) && this.gain().gt(this.amount());
        },

        gain() {
            if(player.inChallenge === 6) return Decimal.min(3, Decimal.max(Decimal.log(fn.points.amount(), INFINITY).times(3).plus(1), this.amount()));
            if(player.inChallenge === 3) return new Decimal(1);
            if(fn.challenges.in(1)) {
                return Decimal.min(2, Decimal.max(Decimal.log(fn.points.amount(), INFINITY).times(1.5).plus(1), this.amount()));
            }
            return Decimal.min(2.5, Decimal.max(Decimal.log(fn.points.amount(), INFINITY).times(1.5).plus(1), this.amount()));
        },

        buy() {
            if(!this.canAfford()) return false;
            player.prestige = this.gain();
            fn.points.reset();
            fn.generators.reset();
            fn.boosts.reset();
            fn.collapses.reset();

            if(player.inChallenge === 5) {
                player.challenge5mult = new Decimal(0);
            }

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
            fn.infinityPower.reset();
            fn.infinityGenerators.clear();
    
            player.statistics.timeInCurrentInfinity = 0;
            player.infinities = player.infinities.plus(1);
            player.infinityPoints = player.infinityPoints.plus(2); // v1.1 - add get gain

            // check if challenge completion
            let currentChallenge = player.inChallenge;
            if(currentChallenge !== -1) {
                fn.challenges.complete(currentChallenge);
                player.inChallenge = null;
            }
        }
    },

    infinities: {
        amount() {
            return player.infinities;
        }
    },

    infinityGenerators: {
        buy(x) {
            const cost = this.cost(x);
            if(!this.canAfford(x)) return false;
            player.infinityPoints = player.infinityPoints.minus(cost);
            player.infinityGenerators[x].purchased = player.infinityGenerators[x].purchased.plus(1);
            player.infinityGenerators[x].amount = player.infinityGenerators[x].amount.plus(1);
            return true;
        },

        buyMax(x) {
            let can = true;
            do { can = this.buy(x) } while(can);
        },

        cost(x) {
            return player.infinityGenerators[x].baseCost.times(
                Decimal.pow(player.infinityGenerators[x].baseCostScaling, player.infinityGenerators[x].purchased)
            );
        },

        canAfford(x) {
            return player.infinityPoints.gte(this.cost(x));
        },

        amount(x) {
            return player.infinityGenerators[x].amount;
        },

        gain(x) {
            return this.amount(x)
                .times(this.multiplier(x))
                .div(8)
                .mul(Decimal.min(player.infinities.div(256), 1));
        },

        percentageGain(x) {
            if(x >= 8) return new Decimal(0);
            return Decimal.max(0, this.gain(1 + x).div(this.amount(x)).times(100));
        },

        multiplier(x) {
            return new Decimal(1.0)
            .times(fn.challenges.bonus());
        },

        clear() {
            for(let i = 1; i <= 8; i++) {
                player.infinityGenerators[i].amount = player.infinityGenerators[i].purchased;
            }
        },

        reset() {
            for(let i = 1; i <= 8; i++) {
                player.infinityGenerators[i].amount = new Decimal(0);
                player.infinityGenerators[i].purchased = new Decimal(0);
            }
        }
    },

    infinityPower: {
        amount() {
            return player.infinityPower;
        },

        effect() {
            return Decimal.max(1, Decimal.log10(this.amount().plus(1)));
        },

        gain() {
            let gain = fn.infinityGenerators.amount(1).times(fn.infinityGenerators.multiplier(1));
            return gain;
        },

        reset() {
            player.infinityPower = new Decimal(0);
        }
    },

    autobuyers: {
        canAfford(x) {
            return player.points.lt(player.autobuyers[x].cost);
        },

        buy(x) {
            if(!player.autobuyers[x]) return false;
            if(player.points.lt(player.autobuyers[x].cost)) return false;
            if(player.autobuyers[x].unlocked) return false;

            player.points = player.points.minus(player.autobuyers[x].cost);
            player.autobuyers[x].unlocked = true;
            player.autobuyers[x].enabled = true;
        },

        autobuy(key, max) {
            switch(key) {
                case '1': case '2': case '3': case '4': 
                case '5': case '6': case '7': case '8':
                    if(max) fn.generators.buyMax(key);
                    else fn.generators.buy(key);
                break;
                case 'b':
                    if(max) fn.boosts.buyMax();
                    else fn.boosts.buy();
                break;
            }
            // todo booster etc.
        },

        // Update autobuyers.
        tick(fps) {
            const delta = 60 / fps;
            Object.entries(player.autobuyers).forEach(([key, autobuyer]) => {
                let completed = fn.challenges.isCompleted(kvpChallenges[key]);
                if(autobuyer.unlocked && autobuyer.enabled) {
                    if(autobuyer.slow && !completed) {
                        autobuyer.delta += delta;
                        if(autobuyer.delta >= 240) { // 4 seconds
                            autobuyer.delta = 0;
                            fn.autobuyers.autobuy(key, autobuyer.max);
                        }
                    } else {
                        if(completed && autobuyer.slow) {
                            player.autobuyers[key].slow = false;
                        }
                        fn.autobuyers.autobuy(key, autobuyer.max);
                    }
                }
            });
        }
    },

    // Normal challenges.
    challenges: {
        bonus() {
            return new Decimal(0.25).times(player.challenges.length).plus(1);
        },

        in(id) {
            return player.inChallenge == id;
        },

        start(id) {
            // Reset this infinity
            fn.points.reset();
            fn.boosts.reset();
            fn.generators.reset();
            fn.collapses.reset();
            fn.prestige.reset();
            fn.infinityPower.reset();
            fn.infinityGenerators.clear();
            player.challenge5mult = new Decimal(0);

            // Start the challenge
            player.inChallenge = id;
        },

        isCompleted(id) {
            return player.challenges.indexOf(id) !== -1;
        },

        complete(id) {
            if(player.challenges.indexOf(id) === -1) {
                player.challenges.push(id);
            }
        },

        restart() {
            if(player.inChallenge !== null) {
                this.start(player.inChallenge);
            }
        },

        exit() {
            // Reset this infinity
            fn.points.reset();
            fn.boosts.reset();
            fn.generators.reset();
            fn.collapses.reset();
            fn.prestige.reset();
            fn.infinityPower.reset();
            fn.infinityGenerators.clear();

            // Exit the challenge.
            player.inChallenge = null;
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

        for(let i = 1; i <= 7; i++) {
            player.infinityGenerators[i].amount = player.infinityGenerators[i].amount.plus(
                fn.infinityGenerators.gain(i + 1).div(delta)
            );
        }
        player.infinityPower = player.infinityPower.plus(fn.infinityPower.gain().div(delta));

        // Update statistics (replace somewhere else???)
        player.statistics.timeInCurrentInfinity += 1000 / delta;
        player.statistics.bestPoints = Decimal.max(fn.points.amount(), player.statistics.bestPoints);

        player.challenge5mult = Decimal.min(player.challenge5mult.plus((1000 / delta) / 60000), 1);

        fn.autobuyers.tick(delta);
    }
}

const methods = {

    /* Challenges */
    startChallenge(id) {
        id = parseInt(id);
        fn.challenges.start(id);
        return {};
    },

    restartChallenge() {
        fn.challenges.restart();
        return {};
    },

    exitChallenge() {
        fn.challenges.exit();
        return {};
    },

    /* Autobuyers */
    buyAutobuyer(key) {
        fn.autobuyers.buy(key);
        return {};
    },

    toggleAutobuyer(key) {
        player.autobuyers[key].enabled ^= true;
        return {};
    },

    enableAllAutobuyers() {
        for(const key of Object.keys(player.autobuyers)) {
            player.autobuyers[key].enabled = true;
        }
        return {};
    },

    disableAllAutobuyers() {
        for(const key of Object.keys(player.autobuyers)) {
            player.autobuyers[key].enabled = false;
        }
        return {};
    },

    toggleMaxAutobuyer(key) {
        player.autobuyers[key].max ^= true;
        return {};
    },

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
        player.options.autosave.interval = parseInt(data.options?.autosave?.interval ?? 0);
        player.options.notation = data.options.notation ?? 'Scientific';

        // load infinity data
        player.infinityPoints = new Decimal(data.infinityPoints ?? 0);
        player.infinities = new Decimal(data.infinities ?? 0);
        for(let i = 1; i <= 8; i++) {
            player.infinityGenerators[i].amount = new Decimal(data.infinityGenerators[i]?.amount ?? 0);
            player.infinityGenerators[i].purchased = new Decimal(data.infinityGenerators[i]?.purchased ?? 0);
        }
        player.infinityPower = new Decimal(data.infinityPower ?? 0);

        // load statistics
        player.statistics.timeInCurrentInfinity = parseFloat(data.statistics?.timeInCurrentInfinity) ?? 0;

        // load autobuyers
        if('autobuyers' in data) {
            for(const [k, v] of Object.entries(data.autobuyers)) {
                player.autobuyers[k].unlocked = v.unlocked;
                player.autobuyers[k].enabled = v.enabled;
                player.autobuyers[k].max = v.max;
                player.autobuyers[k].slow = v.slow;
            }
        }

        player.inChallenge = data.inChallenge ?? null;
        if('challenges' in data) {
            player.challenges = [...data.challenges];
        }
        player.challenge5mult = new Decimal(data.challenge5mult ?? 0);

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
                    gain: fn.prestige.gain(),
                    challenge: player.inChallenge,
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
                    infinities: player.infinities,
                    generators: Object.entries(player.infinityGenerators).map(([i, g]) => [i, {
                        amount: g.amount,
                        multiplier: fn.infinityGenerators.multiplier(i),
                        cost: fn.infinityGenerators.cost(i),
                        gain: fn.infinityGenerators.percentageGain(parseInt(i)),
                        canAfford: fn.infinityGenerators.canAfford(i)
                    }]),
                    infinityPowerEffect: fn.infinityPower.effect(),
                    infinityPower: fn.infinityPower.amount()
                }
            }

            case 'autobuyers': return {
                key: key,
                value: Object.entries(player.autobuyers)
                .map(([k, v]) => [k, {
                    unlocked: v.unlocked,
                    enabled: v.enabled,
                    slow: v.slow,
                    cost: v.cost
                }])
            }

            case 'challenges': return {
                key: key,
                value: {
                    unlocked: player.infinities.gte(1),
                    current: player.inChallenge,
                    completions: [...player.challenges],
                    challenge5mult: player.challenge5mult,
                    bonus: fn.challenges.bonus()
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

    buyInfinityGenerator(x) {
        fn.infinityGenerators.buy(x);
        return {};
    },

    buyMaxInfinityGenerator(x) {
        fn.infinityGenerators.buyMax(x);
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