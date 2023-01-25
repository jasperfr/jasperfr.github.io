import '../lib/break_eternity.mjs';
const defaultRefreshRate = 1000 / 60;
const data = { offlineTickSpeed: 100 };

const player = {
    points: new Decimal(2),
    lastTick: Date.now(),
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
    options: {
        notation: 'Scientific',
        theme: 'Dark',
        hotkeys: true,
        newsticker: true,
        // autoSaveInterval: 10_000,
    }
}

const functions = {

    // options /////////////////////////////////////////////////////////////////

    toggleHotkeys() {
        hotkeys ^= true;
        return { value: player.options.hotkeys }
    },

    toggleNews() {
        news ^= true;
        return { value: player.options.news }
    },

    export() {
        return {
            savegame: btoa(JSON.stringify(player))
        };
    },

    save() {
        return {
            savegame: btoa(JSON.stringify(player))
        };
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

        this.start();

        return {};
    },

    // rendering /////////////////////////////////////////////////////////////////

    getRenderData(key) {
        switch(key) {
            case 'player-points': return {
                key: key,
                value: {
                points: player.points,
                pointgen: this.getPointGain()
            } };
            case 'generators': return {
                key: key,
                value: Object.entries(player.generators).map(([i, g]) => [i, {
                    amount: g.amount,
                    multiplier: this.getGeneratorMultiplier(i),
                    cost: this.getGeneratorCost(i),
                    gain: this.getGeneratorPercentageGain(i),
                    canAfford: this.canAffordGenerator(i)
                }])
            }
        }
    },

    getPointGain() {
        return this.getGeneratorAmount(1).times(this.getGeneratorMultiplier(1));
    },

    // generator functions /////////////////////////////////////////////////////////////////

    buyGenerator(x) {
        const cost = this.getGeneratorCost(x);
        if(!this.canAffordGenerator(x)) return false;
        player.points = player.points.minus(cost);
        player.generators[x].purchased = player.generators[x].purchased.plus(1);
        player.generators[x].amount = player.generators[x].amount.plus(1);
        return true;
    },
    
    buyMaxGenerator(x) {
        let can = true;
        do { can = this.buyGenerator(x) } while(can);
    },

    canAffordGenerator(x) {
        // do not buy when the generator has not been unlocked yet!
        // if(player.collapse.count.plus(4).lt(x)) return false;
        return player.points.gte(this.getGeneratorCost(x));
    },

    getGeneratorAmount(x) {
        return player.generators[x]?.amount ?? new Decimal(0);
    },

    getGeneratorCost(x) {
        return player.generators[x].baseCost.times(Decimal.pow(player.generators[x].baseCostScaling, player.generators[x].purchased));
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
        let multiplier = Decimal
            .times(player.generators[x]?.purchased ?? 0)
            .plus(1)
        return multiplier;
    },

    // initialization /////////////////////////////////////////////////////////////////

    start() {
        let now = Date.now();
        let last =  player.lastTick;
        let delta = now - last;

        function loop() {
            if(last < now) {
                postMessage({ fn: 'renderOfflineProgress', result: {
                    fromDate: last,
                    toDate: now,
                    progress: (delta - now) + last,
                    max: delta,
                    status: 'pending'
                }});
                last += data.offlineTickSpeed;
                tick(1000 / data.offlineTickSpeed);
                setTimeout(loop, 0);
            } else {
                postMessage({ fn: 'renderOfflineProgress', result: {
                    fromDate: last,
                    toDate: now,
                    progress: (delta - now) + last,
                    max: delta,
                    status: 'complete'
                }});
                setInterval(() => tick(60), defaultRefreshRate);
            }
        }
        loop();
        return true;
    },

    increaseOfflineTickSpeed() {
        data.offlineTickSpeed *= 2;
        return true;
    }
}


function tick(delta) {
    player.points = player.points.plus(functions.getPointGain().div(delta));
    player.lastTick = Date.now();

    // Update generators
    for(let i = 1; i <= 7; i++) {
        player.generators[i].amount = player.generators[i].amount.plus(
            functions.getGeneratorGain(i + 1).div(delta)
        );
    }
}

onmessage = (msg) => {
    const result = functions[msg.data.fn]?.(...msg.data.args);
    postMessage({ fn: msg.data.fn, result: result });
}
