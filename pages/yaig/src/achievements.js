const achievements = {
    11: {
        title: 'Gen 1',
        description: 'Get your first generator.',
        $el: null,
        get unlocked() {
            return player.generator.generators[1].amount.gte(1);
        }
    },
    12: {
        title: 'Gen 2',
        description: 'Get your first 2nd generator.',
        $el: null,
        get unlocked() {
            return player.generator.generators[2].amount.gte(1);
        }
    },
    13: {
        title: 'Gen 3',
        description: 'Get your first 3rd generator.',
        $el: null,
        get unlocked() {
            return player.generator.generators[3].amount.gte(1);
        }
    },
    14: {
        title: 'Gen 4',
        description: 'Get your first 4th generator.',
        $el: null,
        get unlocked() {
            return player.generator.generators[4].amount.gte(1);
        }
    },
    15: {
        title: 'Gen 5',
        description: 'Get your first 5th generator.',
        $el: null,
        get unlocked() {
            return player.generator.generators[5].amount.gte(1);
        }
    },
    16: {
        title: 'Gen 6',
        description: 'Get your first 6th generator.',
        $el: null,
        get unlocked() {
            return player.generator.generators[6].amount.gte(1);
        }
    },
    17: {
        title: 'Gen 7',
        description: 'Get your first 7th generator.',
        $el: null,
        get unlocked() {
            return player.generator.generators[7].amount.gte(1);
        }
    },
    18: {
        title: 'Gen 8',
        description: 'Get your first 8th generator.',
        $el: null,
        get unlocked() {
            return player.generator.generators[8].amount.gte(1);
        }
    },
    21: {
        title: 'Prestigious',
        description: 'Prestige for the first time.',
        $el: null,
        get unlocked() {
            return player.prestige.multiplier.gt(1);
        }
    },
    22: {
        title: 'That\'s a Lot',
        description: 'Get your prestige bonus over x10.',
        $el: null,
        get unlocked() {
            return player.prestige.multiplier.gte(10);
        }
    }
}

function updateAchievements() {
    for(let [key,achievement] of Object.entries(achievements)) {
        if(achievement.unlocked && player.achievements.indexOf(key) === -1) {
            player.achievements.push(key);
            achievement.$el.addClass('completed');
        }
    }
}

$(() => {
    const $table = $('table.achievements');
    for(let y = 0; y <= 8; y++) {
        const $row = $('<tr>');
        for(let x = 0; x <= 8; x++) {
            const achNo = `${y}${x}`;
            if(achNo in achievements) {
                const obj = achievements[achNo];
                obj.$el = $(`<td class="achievement${player.achievements.indexOf(achNo) != -1? ' completed' : ''}">
                    <h4>${obj.title}</h4>
                    <p>${obj.description}</p>
                </td>`);
                $row.append(obj.$el);
            }
        }
        $table.append($row);
    }
});
