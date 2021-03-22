const Dialogs = [
    {
        "message": "You decide to step on a few bugs. Gotta start somewhere...",
        "unlock": function() {
            return Game.upgrades.bug.count == 1;
        },
        "unlocked": false
    },
    {
        "message": "You gotta squish more to actually make progress...",
        "unlock": function() {
            return Game.upgrades.bug.count == 2;
        },
        "unlocked": false
    },
    {
        "message": "Quite a few bugs are being mercilessly trampled by you. People start to notice.",
        "unlock": function() {
            return Game.upgrades.bug.count == 5;
        },
        "unlocked": false
    },
    {
        "message": "Some people are flattered by your height, standing over 2 metres tall now.",
        "unlock": function() {
            return Game.size > 2;
        },
        "unlocked": false
    },
    {
        "message": "You just keep crunching bugs under your heavy paws. Sooner or later, it's time to stomp something else.",
        "unlock": function() {
            return Game.upgrades.bug.count == 10;
        },
        "unlocked": false
    },
    {
        "message": "People are starting to get worried as you tower over them, 3 metres tall.",
        "unlock": function() {
            return Game.size > 3;
        },
        "unlocked": false
    },
    {
        "message": "You feel your powers grow, as you reach a nice 5 meters height. People are afraid.",
        "unlock": function() {
            return Game.size > 5;
        },
        "unlocked": false
    },
    {
        "message": "You decide to try out your new size, stomping down the first car you see. Someone was inside of it. They're dead.",
        "unlock": function() {
            return Game.upgrades.car.count == 1;
        },
        "unlocked": false
    },
    {
        "message": "Stomping bigger things will also crush more smaller things...",
        "unlock": function() {
            return Game.upgrades.car.count == 1;
        },
        "unlocked": false
    }
]

const Game = {
    $sizeCounter: undefined,
    $killCounter: undefined,
    $growRate: undefined,
    $killRate: undefined,
    $dialog: undefined,

    tickSpeed: 30,

    size: 1.8,
    kill: 1,

    upgrades: {
        'bug' : {
            'count': 0,
            'generated': 0,
            'sps': 0.001,
            'kps': 0.1,
            'price': 1,
            'pif': 1.02,
            'prev': false
        },
        'car' : {
            'count': 0,
            'generated': 0,
            'sps': 0.005,
            'kps': 0.2,
            'price': 100,
            'pif': 1.025,
            'prev': 'bug'
        },
    },

    buy: function(val) {
        let upgrade = Game.upgrades[val];

        if(Game.kill < upgrade.price) return;
        Game.kill -= upgrade.price;

        // Change upgrade values
        upgrade.count++;
        upgrade.price = Math.pow(1 + upgrade.price, upgrade.pif);

        // Change text values
        let dialog = $(`#${val}`);
        let counter = dialog.find('.counter');
        let costbtn = dialog.find('button');
        counter.text(upgrade.count + upgrade.generated);
        costbtn.text(`Cost: ${upgrade.price.toFixed(2)} kills`)
    },

    tick: function() {
        let bias = Game.tickSpeed / 1000;

        // Add generator constants
        for(const [k, v] of Object.entries(Game.upgrades)) {
            const upgrade = Game.upgrades[k];
            if(upgrade.prev) {
                const changer = Game.upgrades[upgrade.prev];
                changer.generated += 0.0001 * upgrade.count;
            }
        }

        // modify values based on upgrades
        for(const [k, v] of Object.entries(Game.upgrades)) {
            const upgrade = Game.upgrades[k];
            let gen = Math.max(1, upgrade.generated); // avoid multiplication by 0
            Game.size += upgrade.sps * upgrade.count * gen * bias;
            Game.kill += upgrade.kps * upgrade.count * gen * bias;
        }
        
        // Update text boxes
        for(const [k, v] of Object.entries(Game.upgrades)) {
            const upgrade = Game.upgrades[k];
            let dialog = $(`#${k}`);
            let counter = dialog.find('.counter');
            counter.text((upgrade.count + upgrade.generated).toFixed(2));
        }

        // set text
        Game.$sizeCounter.text(`${Game.size.toFixed(2)} m`);
        Game.$killCounter.text(`${Game.kill.toFixed(2)}`);
    },

    updateDialog: function() {
        for(let dialog of Dialogs) {
            if(dialog.unlocked) continue;
            if(dialog.unlock()) {
                let message = $('<p>').text(dialog.message);
                Game.$dialog.append(message);
                dialog.unlocked = true;
            }
        }
    }
}

$(() => {
    Game.$sizeCounter = $('#size');
    Game.$killCounter = $('#kill');
    Game.$growRate = $('#sizer');
    Game.$killRate = $('#killr');
    Game.$dialog = $('#dialog');
    setInterval(Game.tick, Game.tickSpeed);
    setInterval(Game.updateDialog, Game.tickSpeed);
})