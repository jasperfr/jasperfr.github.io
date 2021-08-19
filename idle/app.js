ExpantaNum.prototype.toHTML = function() {
    return this.toString().replace(/e/g, '×10<sup>');
}

const tickspeed = 16.67;
const app = new Vue({
    el: '#app',
    data: {
        particles: new ExpantaNum(0),
        quarks: {
            up: {
                count: new ExpantaNum(2),
                getProduction: function() {
                    return new ExpantaNum(1.0).plus(new ExpantaNum(this.count).pow(this.count));
                },
                add: function() {
                    this.count = this.count.pow(this.count);
                }
            },
            dn: new ExpantaNum(0),
        },
        unlocked: {
            quarks: true
        }
    },
    methods: {
        gain: function() {
            this.particles = this.particles.plus(1);
        },
        tick: function() {
            this.particles = this.particles.plus(1 / 60).times(this.quarks.up.getProduction());
            this.quarks.up.add();
        },
        purchase: function(type) {
            switch(type) {
                case 'quarks.up': {
                    this.quarks.up = this.quarks.up.add(1);
                }
            }
        }
    },
    created: function() {
        setInterval(this.tick, tickspeed);
    }
})

/*
const app = new Vue({
    el: '#app',
    data: {
        particleCount: new ExpantaNum(0),
        strings: 0,
        timeframes: 0,
        upgrades: [0, 0, 0, 0, 0],
        expanta: new ExpantaNum(7)
    },
    methods: {
        gain: function() {
            this.particleCount++;
        },
        convert: function() {
            if(this.particleCount >= 10) {
                this.particleCount -= 10;
                this.strings++;
            }
        },
        tick: function() {
            this.particleCount += (this.strings / 60 * (this.upgrades[1] ? 2 : 1)) * this.getTimeSpeed();
            if(this.upgrades[2] && this.particleCount > 100) {
                let gain = Math.floor(this.particleCount / 100);
                this.particleCount -= (gain * 100);
                this.strings += gain;
            }
            this.expanta = this.expanta.pow(this.expanta);
        },
        timeshift: function() {
            this.timeframes += (this.upgrades[4] ? Math.floor(Math.log10(this.strings)) : 1);
            this.particleCount = 0;
            this.strings = this.upgrades[0] ? 1 : 0;
        },
        getTimeSpeed: function() {
            return ((this.upgrades[3] ? 1.05 : 1.02) ** this.timeframes);
        },
        upgrade: function(u) {
            const prices = [2, 10, 25, 100, 5];
            if(this.timeframes >= prices[u]) {
                this.timeframes -= prices[u];
                this.upgrades[u] = 1;
            }
        },
        save: function() {
            let obj = {
                particleCount: this.particleCount,
                strings: this.strings,
                timeframes: this.timeframes,
                upgrades: this.upgrades
            };
            localStorage.idlesave = btoa(JSON.stringify(obj));
        },
        load: function() {
            if(!localStorage.idlesave) return;
            let obj = JSON.parse(atob(localStorage.idlesave));
            for(let key of Object.keys(obj)) {
                this[key] = obj[key];
            }
        },
        restart: function() {
            this.particleCount = 0;
            this.strings = 0;
            this.timeframes = 0;
            this.upgrades = this.upgrades.map(() => 0);
            this.save();
        }
    },
    created: function() {
        setInterval(this.save, 10000);
        setInterval(this.tick, 500);
        this.load();
    }
});
*/