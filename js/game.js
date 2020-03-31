tickspeed = 20.0; // 1000t = 1 second, 50 ticks per second
generators = [];
multiplicators = [];
achievements = [];

$(document).ready(() => {
    $( "input" ).checkboxradio({
        icon: false
    });
});

// stuff is stored in a cookie. Quaint.

const Save = function() {
    // Bit Breaker stores the game in a cookie.
    // Just to ensure your privacy and stuff, here's an explanation of the
    // cookie's values which are stored and retrieved.
    // This is what is saved:
    // BIT - Byte count
    // GEN - Generators, an array of [ValueUpgrades, SpeedUpgrades, BoostUpgrades].
    // ACH - Achievements. 0 means the achievement is locked, 1 means unlocked.
    // OPT - Option values.
    //       LT-DK = Theme (light dark)
    //       EN-NL-JP = Language
    //       BC-TT = Tab bar display (BitCount - TiTle)
    //      (BIT:1020129,GEN:[[1,2,3],[1,1,1]],ACH:00000000,OPT:['LT','EN','BC'])
	let save = {};
	save.bytes = bytes;
	save.generators = [];
	for(let g of generators)
		save.generators.push([g.active,g.value.purchased,g.speed.purchased,g.boost.purchased]);
	save.achievements = [];
	for(let a of achievements)
		save.achievements.push(a.unlocked);
    	document.cookie = 'game=' + JSON.stringify(save);
}

const Load = function() {
	let saveFile = document.cookie;
	if(saveFile == "") return;
	let saveObj = JSON.parse(saveFile);
	console.log(saveObj);
}
