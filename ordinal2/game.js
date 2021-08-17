Number.prototype.scientific = function(floored = false) {
    if(this < 1000) return floored ? Math.floor(this) : this.toFixed(1);
    var s = ["", "K", "M", "B", "T", "Qa", "Qd", "Sx", "Sp", "Oc", "No"],
        l = Math.log10(this),
        v = Math.floor(l / 3),
        q = Math.floor(l % 3),
        e = (this / Math.pow(10, Math.floor(l - q))).toFixed(2);
    return v < 11 ? `${e} ${s[v]}` : `${e}e${v * 3}`;
}

const shiftCost = [
    200, // 10 - 9
    1000, // 9 - 8
    10000, // 8 - 7
    350000, // 7 - 6
    1e13, // 6 - 5
    1e30, // 5 - 4
    1e100 // 4 - 3
];

const game = {
    op: 0,
    ordinal: [0],
    base: 10,
    autosucc: 0,
    automax: 0,
    factors: [],
    up: function() {
        this.ordinal[0]++;
        this.update();
    },
    maximize: function() {
        for(let i = 0; i < this.ordinal.length; i++) {
            let ord = this.ordinal[i];
            let cut = Math.floor(ord / this.base);
            let rem = ord % this.base;
            if(cut > 0)
                if (this.ordinal[i + 1] === undefined) this.ordinal.push(cut);
                else this.ordinal[i + 1] += cut;
            this.ordinal[i] = rem;
        }
        this.update();
    },
    markup: function() {
        const op = getORD(this.ordinal, this.base);
        if(op >= 10240) {
            this.op += getOP(this.ordinal, this.base);
            this.ordinal = [0];
            this.update();
        }
    },
    update: function() {
        const str = createOrdinalHtml(this.ordinal, this.base);
        $('h1.ordinal').html(str);

        const op = getORD(this.ordinal, this.base);
        if(op >= 10240) {
            let gain = getOP(this.ordinal, this.base);
            $('.button-markup').text(`Markup to gain ${gain.scientific(true)} OP`);
        } else {
            $('.button-markup').text(`You need 10240 to markup`);
        }

        $('.OP').text(this.op.scientific(true));

        const succPrice = 100 * (2 ** this.autosucc);
        $('.buy-succ').text(`Buy 1 Successor Autobuyer for ${succPrice.scientific(true)} OP`);
        $('.amt-succ').text(this.autosucc);
        $('.tim-succ').text(this.autosucc); // TODO ADD BOOSTERS ETC
        $('.tim-succ').text((this.autosucc * this.getFactor()).scientific(true));

        const maxPrice = 100 * (2 ** this.automax);
        $('.buy-max').text(`Buy 1 Maximizer Autobuyer for ${maxPrice.scientific(true)} OP`);
        $('.amt-max').text(this.automax);
        $('.tim-max').text(this.automax); // TODO ADD BOOSTERS ETC
        $('.tim-max').text((this.automax * this.getFactor()).scientific(true));

    },
    updateFactors: function() {
        if(this.factors.length == 0) {
            $('.factors').text('You have no factors. Perform a Factor Shift to get one!');
        } else {
            $('.factors').empty();
            for(let i = 0; i < this.factors.length; i++) {
                let cost = (10 ** (i + 1)) * (20 ** (this.factors[i] - 1));
                $('.factors').append($(`<div>Factor ${i + 1} x${this.factors[i]} <button onclick="game.buyFactor(${i});">Increase for ${cost.scientific(true)} OP</button></div>`));
            }
            $('.factors').append(`Your factors are multiplying autoclickers by x${this.getFactor().scientific(true)}`);
        }
        
        $('.f-shift-count').text(this.factors.length);
        let cost = shiftCost[this.factors.length];
        if(cost) 
            $('.f-shift-cost').text((cost).scientific(true));
        else 
            $('.f-shift-cost').text('Infinity');
    },
    buyFactor: function(factor) {
        let cost = (10 ** (factor + 1)) * (20 ** (this.factors[factor] - 1));
        if(this.op >= cost) {
            this.op -= cost;
            this.factors[factor]++;
            this.updateFactors();
            return true;
        } else return false;
    },
    getFactor: function() {
        if(this.factors.length == 0) return 1;
        return this.factors.reduce((a, b) => (a || 1) * b) || 1;
    },
    fps: 0,
    tick: function() {
        const autoSucc = (this.autosucc / 60) * this.getFactor();
        this.ordinal[0] += autoSucc;
        this.maximize();
        this.update();

        /*
        this.fps++;
        if(this.fps >= 60) {
            this.fps = 0;

            for(let _ = 0; _ < this.automax * this.getFactor(); _++ ) {
                const maximizer = (this.base);
                if(this.ordinal[0] >= maximizer) {
                    this.ordinal[0] -= maximizer;
                    if (this.ordinal[1] === undefined) this.ordinal.push(1);
                    else this.ordinal[1]++;
        
                    for(let i = 1; i < this.ordinal.length; i++) {
                        let ord = this.ordinal[i];
                        let cut = Math.floor(ord / this.base);
                        let rem = ord % this.base;
                        if(cut > 0)
                            if (this.ordinal[i + 1] === undefined) this.ordinal.push(cut);
                            else this.ordinal[i + 1] += cut;
                        this.ordinal[i] = rem;
                    }
                } else return;
            }
        }
        */
    },
    buySuccAndMax: function() {
        while(this.buySucc());
        while(this.buyMax());
        for(let i = 0; i < this.factors.length; i++) {
            while(this.buyFactor(i));
        }
    },
    buySucc: function() {
        const price = 100 * (2 ** this.autosucc);
        if(this.op >= price) {
            this.op -= price;
            this.autosucc++;
            this.update();
            return true;
        } 
        return false;
    },
    buyMax: function() {
        const price = 100 * (2 ** this.automax);
        if(this.op >= price) {
            this.op -= price;
            this.automax++;
            this.update();
            return true;
        } 
        return false;
    },
    factorShift: function() {
        if(this.op >= shiftCost[this.factors.length]) {
            this.factors = this.factors.map(() => 1);
            this.factors.push(1);
            this.ordinal = [0];
            this.op = 0;
            this.base--;
            this.automax = 0;
            this.autosucc = 0;
            this.update();
            this.updateFactors();
        }
    },

    // loader functions
    save: function() {
        const data = JSON.stringify(({
            op: this.op,
            base: this.base,
            ordinal: this.ordinal.join(','),
            autosucc: this.autosucc,
            automax: this.automax,
            factors: this.factors.join(',')
        }));
        localStorage.om2 = btoa(data);
    },
    load: function() {
        if(!localStorage.om2) { this.update(); return; }
        const data = JSON.parse(atob(localStorage.om2));
        this.op = data.op;
        this.base = data.base;
        this.ordinal = data.ordinal.split(',').map(e => parseInt(e));
        this.autosucc = data.autosucc;
        this.automax = data.automax;
        this.factors = data.factors.length? data.factors.split(',').map(e => parseInt(e)) : [];
        this.update();
        this.updateFactors();
    },
    export: function() {
        const data = JSON.stringify(({
            op: this.op,
            base: this.base,
            ordinal: this.ordinal.join(','),
            autosucc: this.autosucc,
            automax: this.automax,
            factors: this.factors.join(',')
        }));
        navigator.clipboard.writeText(btoa(data)).then(() => window.alert('Copied save to clipboard.'), err => console.error(err));
    },
    import: function() {
        navigator.clipboard.readText().then(clp => {
            var data;
            try {
                data = JSON.parse(atob(clp));
            } catch { return }
            this.op = data.op;
            this.base = data.base;
            this.ordinal = data.ordinal.split(',').map(e => parseInt(e));
            this.autosucc = data.autosucc;
            this.automax = data.automax;
            this.factors = data.factors.length? data.factors.split(',').map(e => parseInt(e)) : [];
            this.update();
            this.updateFactors();
        }, err => console.error(err));
    },
    restart: function() {
        if(confirm('Are you SURE you want to restart?')) {
            this.op = 0;
            this.base = 10;
            this.ordinal = [0];
            this.autosucc = 0;
            this.automax = 0;
            this.factors = [];
            this.update();
            this.updateFactors();
        }
    }
}

$(() => game.load());
$(() => setInterval(() => game.save(), 10000));
$(() => setInterval(() => game.tick(), 16.666));