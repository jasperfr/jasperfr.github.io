const app = new Vue({
    el: '#app',
    data: {
        particleCount: 0,
        strings: 0,
        timeframes: 0,
        upgrades: [0, 0, 0, 0, 0]
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
        setInterval(this.tick, 16.67);
        this.load();
    }
});
