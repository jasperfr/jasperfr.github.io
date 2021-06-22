const Game = {
    base: 10,
    OP: new Exadecimal(220),

    price: {
        debase: 100,
    },

    up: function() {
        ordinals[0]++;
        update();
    },
    debase: function() {
        if(Game.OP.isLargerThan(Game.price.debase - 1) && Game.base > 3) {
            ordinals = [0];
            Game.base--;
            update();
        }
    },
    unlockSigma: function() {

    }
};
