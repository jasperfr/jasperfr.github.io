const Game = {
    omega: new Exadecimal(0),
    ordinals2: Array(2000).fill(null).map(e => e = new Exadecimal(1)),

    ordinals: {
        alpha: new Exadecimal(1),
        beta: new Exadecimal(1),
        gamma: new Exadecimal(1),
        delta: new Exadecimal(1),
        delta: new Exadecimal(1),
        omega: new Exadecimal(0)
    },

    i: new Exadecimal(0),
    j: new Exadecimal(0),
    amu: new Exadecimal(0),
    aareq: 1,

    collapse: function() {
        this.ordinals2 = Array(2000).fill(null).map(e => e = new Exadecimal(1));
        this.omega.add(1);
    },

    setMarkup: function() {
        this.ordinals2[0].add(1);
        for(let i = 1; i < this.ordinals2.length; i++) {
            this.ordinals2[i].multiply(this.ordinals2[i - 1]);
        }

        if(this.ordinals2.some(ord => ord.exponent === Infinity)) {
            this.collapse();
        }

        let htmlStr = this.omega.isLargerThan(0)? `${this.omega.toString() == '1' ? '' : this.omega.toString()}ω + ` : '';

        for(let i = 0; i < 3; i++) {
            htmlStr += `α<sub>${i}</sub>${this.ordinals2[i].toString()} ${i < 3 - 1 ? '<sup>' : `<sup>...<sup>α<sub>${this.ordinals2.length - 1}</sub>${this.ordinals2[this.ordinals2.length - 1].toString()}</sup></sup>`}`;
        }
        for(let i = 0; i < 3; i++) {
            htmlStr += '</sup>';
        }

        // for(let i = 0; i < this.ordinals2.length; i++) {
        //     htmlStr += `α<sub>${i}</sub>${this.ordinals2[i].toString()} ${i < this.ordinals2.length - 1 ? '<sup>' : ''}`;
        // }
        // for(let i = 0; i < this.ordinals2.length; i++) {
        //     htmlStr += '</sup>';
        // }

        htmlStr += '= ' + (this.omega.isLargerThan(0)? `${this.omega.toString() == '1' ? '' : this.omega.toString()}ω + ` : '');
        htmlStr += `${this.ordinals2[this.ordinals2.length - 1]}`;
        $('.count').html(htmlStr);

        return;

        this.ordinals.alpha.add(1);

        this.ordinals.beta.multiply(this.ordinals.alpha);
        this.ordinals.gamma.multiply(this.ordinals.beta);
        this.ordinals.delta.multiply(this.ordinals.gamma);

        this.ordinals.omega = this.ordinals.alpha.copy();
        if(!this.ordinals.beta.equals(0)) {
            this.ordinals.omega.multiply(this.ordinals.beta);
            if(!this.ordinals.gamma.equals(0)) {
                this.ordinals.omega.multiply(this.ordinals.gamma);
                if(!this.ordinals.delta.equals(0)) {
                    this.ordinals.omega.multiply(this.ordinals.delta);
                    $('.count').html(`α<sub>${this.ordinals.alpha.toString()}</sub><sup>β<sub>${this.ordinals.beta.toString()}</sub><sup>γ<sub>${this.ordinals.gamma.toString()}</sub><sup>δ<sub>${this.ordinals.delta.toString()}</sub></sup></sup></sup> = ${this.ordinals.omega.toString()}`);
                } else {
                    $('.count').html(`α<sub>${this.ordinals.alpha.toString()}</sub><sup>β<sub>${this.ordinals.beta.toString()}</sub><sup>γ<sub>${this.ordinals.gamma.toString()}</sub></sup></sup> = ${this.ordinals.omega.toString()}`);
                }
            } else {
                $('.count').html(`α<sub>${this.ordinals.alpha.toString()}</sub><sup>β<sub>${this.ordinals.beta.toString()}</sub></sup> = ${this.ordinals.omega.toString()}`);
            }
        } else {
            $('.count').html(`α<sub>${this.ordinals.alpha.toString()}</sub> = ${this.ordinals.omega.toString()}`);
        }
    },

    tick: function() {
        Game.setMarkup();
    }
}

function up() {
    Game.i.add(new Exadecimal(1));
    $('.count').html('α<sub>' + Game.i.toString() + '</sub> = ' + Game.i.toString());

    Game.amu.add(new Exadecimal('1e-2'));
    $('#amu').text(Game.amu.toString());
}

function autogain() {
    let e = Game.i.exponent;
    if(e < Game.aareq) return;
    Game.aareq++;

    Game.i = new Exadecimal('0e0');
    Game.j.add(new Exadecimal(1));
    $('.count').html('α<sub>' + Game.i.toString() + '</sub> = ' + Game.i.toString());
    $('#auto-cost').text(Game.aareq);
}

$(() => {
    setInterval(Game.tick, 30);
});
