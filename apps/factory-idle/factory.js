
const App = new Vue({
    el: '#App',
    data: {
        then: 0,
        power: {
            generation: 0,
            stored: 0,
        },
        miners: {
            free: 0,
            'coal': 0,
            'iron ore': 0,
            'copper ore': 0,
            'stone': 0,
        },
        smelters: {
            free: 0,
            'iron': 0,
            'copper': 0,
            'stone': 0,
        },
        inventory: {
            'iron ore': 0,
            'copper ore': 0,
            'stone': 0,
            'coal': 0,
            'copper plate': 0,
            'iron plate': 0,
            'stone brick': 0,
            'graphite': 0,
            'copper wire': 0,
            'iron gear': 0,
            'basic circuit': 0,
            'miner': 0,
            'smelter': 0,
            'assembler': 0,
            'research kit I': 0,
            'boiler': 0,
            'steam engine': 0
        },
        mineTimer: { time: 0, interval: null },
        smeltTimer: { time: 0, interval: null },

        recipes: {
            'copper wire': { type: 'intermediate', unlocked: 1, yield: 2, ingredients: { 'copper plate': 1 } },
            'basic circuit': { type: 'intermediate', unlocked: 1, yield: 1, ingredients: { 'copper wire': 3, 'iron plate': 1 } },
            'iron gear': { type: 'intermediate', unlocked: 1, yield: 1, ingredients: { 'iron plate': 2 } },
            'iron pipe': { type: 'intermediate', unlocked: 1, yield: 1, ingredients: { 'iron plate': 1 } },
            'miner': { type: 'building', unlocked: 1, yield: 1, ingredients: { 'iron plate': 2, 'iron gear': 2, 'stone brick': 2 } },
            'smelter': { type: 'building', unlocked: 1, yield: 1, ingredients: { 'stone brick': 5 } },
            'boiler': { type: 'building', unlocked: 1, yield: 1, ingredients: { 'stone brick': 3, 'iron pipe': 2 } },
            'steam engine': { type: 'building', unlocked: 1, yield: 1, ingredients: { 'stone brick': 5 } }
        }
    },
    beforeMount() {
        this.load();
        this.miners.free = this.inventory.miner;
        this.smelters.free = this.inventory.smelter;

        // savegame interval
        setInterval(() => this.save(), 10000);

        // miner interval
        setInterval(() => {
            for (let [k, v] of Object.entries(this.miners)) {
                if (k != 'free') {
                    this.inventory[k] += v * 0.01 * 0.5;
                }
            }
        }, 50);

        // smelter interval
        const KVP = { copper: ['copper ore', 'copper plate'], iron: ['iron ore', 'iron plate'], stone: ['stone', 'stone brick'] }
        setInterval(() => {
            for (let [k, v] of Object.entries(this.smelters)) {
                if (k != 'free') {
                    const oreAmount = this.inventory[KVP[k][0]];
                    const oreNeeded = 0.1 / 20; // 0.1 per second
                    const coalNeeded = 0.05 / 20; // 2 per second
                    if (this.inventory.coal >= coalNeeded && oreAmount >= oreNeeded) {
                        this.inventory.coal -= coalNeeded * v;
                        this.inventory[KVP[k][0]] -= oreNeeded * v;
                        this.inventory[KVP[k][1]] += oreNeeded * v;
                    };

                }
            }
        }, 50);

        requestAnimationFrame(this.tick);

    },
    methods: {

        getRecipeText(name, recipe) {
            return `${Object.entries(recipe.ingredients).map(([k, v]) => `${v} ${k}`).join(' + ')} → ${recipe.yield} ${name}`;
        },

        tick(delta) {
            const now = delta - this.then;
            this.then = delta;
            requestAnimationFrame(this.tick);
        },

        getPowerConsumption() {
            const minerConsumption = (this.inventory.miner - this.miners.free) * 150;
            const smelterConsumption = (this.inventory.smelter - this.smelters.free) * 60;

            return minerConsumption + smelterConsumption;
        },

        hasEnoughPower() {
            return this.getPowerConsumption() > (this.power.generation + this.power.stored);
        },

        generatePower() {

        },

        smelter: function (resource, operation) {
            if (operation == 'add') {
                if (this.smelters.free > 0) {
                    this.smelters.free--;
                    this.smelters[resource]++;
                }
            } else {
                if (this.smelters[resource] > 0) {
                    this.smelters[resource]--;
                    this.smelters.free++;
                }
            }
        },

        miner: function (resource, operation) {
            if (operation == 'add') {
                if (this.miners.free > 0) {
                    this.miners.free--;
                    this.miners[resource]++;
                }
            } else {
                if (this.miners[resource] > 0) {
                    this.miners[resource]--;
                    this.miners.free++;
                }
            }
        },

        save: function () {
            console.log('saving game')
            const data = JSON.stringify({
                inventory: this.inventory,
                mineTimer: this.mineTimer,
                smeltTimer: this.smeltTimer
            });
            localStorage.factorySaveGame = btoa(data);
        },

        load: function () {
            var data = localStorage.factorySaveGame;
            if (!data) {
                console.log('No savegame has been found, skipping loading.')
                return;
            }
            data = JSON.parse(atob(data));
            this.inventory = { ...this.inventory, ...data.inventory };

            // configure intervals
            this.mineTimer = data.mineTimer;
            if (this.mineTimer.interval) {
                let timer = this.mineTimer;
                timer.interval = setInterval(() => {
                    timer.time--;
                    if (timer.time < 0) {
                        timer.time = 0;
                        clearInterval(timer.interval);
                        timer.interval = null;
                    }
                }, 1000);
            }
            this.smeltTimer = data.smeltTimer;
            if (this.smeltTimer.interval) {
                let timer = this.smeltTimer;
                timer.interval = setInterval(() => {
                    timer.time--;
                    if (timer.time < 0) {
                        timer.time = 0;
                        clearInterval(timer.interval);
                        timer.interval = null;
                    }
                }, 1000);
            }
        },

        mine: function (ore) {
            const timer = this.mineTimer;
            if (timer.interval) return;
            this.inventory[ore]++;
            timer.time = 2;
            timer.interval = setInterval(() => {
                timer.time--;
                if (timer.time < 0) {
                    timer.time = 0;
                    clearInterval(timer.interval);
                    timer.interval = null;
                }
            }, 1000);
        },

        smelt: function (ore) {
            const timer = this.smeltTimer;
            if (timer.interval) return;

            const products = { 'copper ore': 'copper plate', 'iron ore': 'iron plate', 'stone': 'stone brick', 'coal': 'graphite' }
            if (this.inventory.coal < 0.5 || this.inventory[ore] < 1) return;

            timer.time = 3;
            timer.interval = setInterval(() => {
                timer.time--;
                if (timer.time < 0) {
                    timer.time = 0;
                    clearInterval(timer.interval);
                    timer.interval = null;
                }
            }, 1000);

            this.inventory[ore]--;
            this.inventory.coal -= 0.5;
            this.inventory[products[ore]]++;
        },

        craft: function (product) {
            let recipe = this.recipes[product];
            if (!recipe) {
                alert('This recipe does not exist yet. Contact the developer.');
                return;
            }

            for (let [item, amount] of Object.entries(recipe.ingredients)) {
                if (this.inventory[item] < amount) return;
            }

            this.inventory[product] += recipe.yield;
            if (product == 'miner') this.miners.free++;
            if (product == 'smelter') this.smelters.free++;
            for (let [item, amount] of Object.entries(recipe.ingredients)) {
                if (this.inventory[item] -= amount);
            }
        }
    }
});