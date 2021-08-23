ExpantaNum.prototype.toHTML = function() {
    return this.toString().replace(/e/g, '×10<sup>');
}

const app = new Vue({
    el: '#app',
    data: {
        btc: new ExpantaNum(0),
        production: new ExpantaNum(1e-21)
    },
    methods: {
        tick: function() {
            this.btc = this.btc.plus(this.production);
        },
        getProfit: function() {
            return this.btc.times(4000);
        }
    },
    created: function() {
        setInterval(this.tick, 1000);
    }
});
