const HTML_ACHIEVEMENT = `
<div class="tooltip achievement">
    <span class="tooltiptext description"></span>
    <p class="text"></p>
</div>
`;
const HTML_ACHIEVEMENT_DIALOG = `
<div class="achievement-dialog" style="display:none;">
    <span class="text"></span>
</div>
`;

achievementMultiplier = 1.0;
class Achievement {
    constructor(name, description, func) {
        this.unlocked = false;
        this.name = name;
        this.description = description;
        this.unlocksAt = func;
        this.element = $(HTML_ACHIEVEMENT);
        $($(this.element).find('.description')).text(this.description);
        $($(this.element).find('.text')).text(this.name);
        $('.achievements-wrapper').append(this.element);
    }
    tick() {
        if(this.unlocksAt() && !this.unlocked) {
            this.unlocked = true;
            console.log(this.unlocksAt());
            $(this.element).addClass('unlocked');
            achievementMultiplier += 0.1;
            let notification = $(HTML_ACHIEVEMENT_DIALOG);
            $($(notification).find('.text')).text(this.name);
            $('#notifications').prepend(notification);
            $(notification).slideDown();
            setTimeout(() => $(notification).slideUp(), 3000);
            $('#achievement-multi').text(`x${achievementMultiplier}`);
        }
    }
};

$(document).ready(() => {
    achievements.push(new Achievement('The First of Many', 'Buy 1 generator.', () => generators.length > 1));
    achievements.push(new Achievement('Electric Boogaloo', 'Buy 2 generators.', () => generators.length > 2));
    achievements.push(new Achievement('HL3 Confirmed', 'Buy 3 generators.', () => generators.length > 3));
    achievements.push(new Achievement('Paper Hat', 'Buy 4 generators.', () => generators.length > 4));
    achievements.push(new Achievement('A handful of generators', 'Buy 5 generators.', () => generators.length > 5));
    achievements.push(new Achievement('6+9 nice', 'Buy 6 generators.', () => generators.length > 6));
    achievements.push(new Achievement('Lucky Numbers', 'Buy 7 generators.', () => generators.length > 7));
    achievements.push(new Achievement('There is no such thing as 9', 'Buy 8 generators.', () => generators.length > 8));

    setInterval(() => {
        for(let a of achievements) {
            a.tick();
        }
    }, 100);
});