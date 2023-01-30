const INFINITY = 2 ** 256;
const LOG10_INFINITY = 77.06367888997919;
const s=['K','M','B','T','Qd','Qt','Sx','Sp','Oc','No','Dc'];
const __=(n,p=0,w=0)=>n===null||n===undefined?'NaN':n.mag<0.001?(0).toFixed(p):n.e<3?n.toFixed(p):n.e<=s.length*3?n.div(`1e${n.e-n.e%3}`).toFixed(w)+' '+s[~~(n.e/3)-1]:n.toFixed(w);
const gameWorker = new Worker('./src/game.mjs', { type: 'module' });
const notations = ['Scientific', 'Mixed Scientific', 'Logarithm', 'Full Logarithm', 'Infinity', 'Blind', 'OTTFFSSENT', 'Kanji', 'Do I have it?'];

var notation = 0;

const toggleButton = function(element, query) {
    document.querySelector(element).classList[['remove', 'add'][0 | query]]('cant');
}

const F = function(number, precision = 3, precisionHigh = 3) {
    number = new Decimal(number);
    switch(notations[notation]) {
        case 'Scientific':
            if(number.lt(1e4)) return number.toFixed(precision);
            return number.toExponential(precisionHigh).replace('+', '').replace(/\.\d+\e/, (e) => {
                // shitty decimal hack function
                let no = e.slice(1, e.length - 1);
                while(no.length < precisionHigh) no += '0';
                return `.${no}e`;
            });
        case 'Mixed Scientific': 
            return __(number, precision, precisionHigh);
        case 'Logarithm':
            if(number.lt(1e4)) return number.toFixed(precision);
            return 'e' + Decimal.log10(number).toFixed(precisionHigh);
        case 'Full Logarithm':
            if(number.eq(0)) return 'e' + number.toFixed(precision);
            return 'e' + Decimal.log10(number).toFixed(precisionHigh);
        case 'Infinity':
            if(number.lt(1e4)) return number.toFixed(precision);
            return Decimal.log(number, 2 ** 256).toFixed(precisionHigh) + '∞'
        case 'OTTFFSSENT':
            if(number.lt(1e4)) return number.toFixed(precision).replace('+', '').replace('e', 'E').replace(/1/g, 'o').replace(/2/g, 't').replace(/3/g, 'T').replace(/4/g, 'f').replace(/5/g, 'F').replace(/6/g, 's').replace(/7/g, 'S').replace(/8/g, 'e').replace(/9/g, 'n').replace(/0/g, 'z')
            return number.toExponential(precisionHigh).replace('+', '').replace('e', 'E').replace(/1/g, 'o').replace(/2/g, 't').replace(/3/g, 'T').replace(/4/g, 'f').replace(/5/g, 'F').replace(/6/g, 's').replace(/7/g, 'S').replace(/8/g, 'e').replace(/9/g, 'n').replace(/0/g, 'z')
        case 'Kanji':
            if(number.lt(1e4)) return number.toFixed(precision).replace('+', '').replace('.', '。').replace('e', 'ｅ').replace(/1/g, '一').replace(/2/g, '二').replace(/3/g, '三').replace(/4/g, '四').replace(/5/g, '五').replace(/6/g, '六').replace(/7/g, '七').replace(/8/g, '八').replace(/9/g, '九').replace(/0/g, '〇')
            return number.toExponential(precisionHigh).replace('+', '').replace('.', '。').replace('e', 'ｅ').replace(/1/g, '一').replace(/2/g, '二').replace(/3/g, '三').replace(/4/g, '四').replace(/5/g, '五').replace(/6/g, '六').replace(/7/g, '七').replace(/8/g, '八').replace(/9/g, '九').replace(/0/g, '〇')
        case 'Blind':
            return '';
        case 'Do I have it?':
            return number.gt(0) ? 'some' : 'no';
        default: return number.toFixed(precision);
    }
}

const call = (fn, args) => {
    if(Array.isArray(args)) {
        gameWorker.postMessage({fn, args});
    } else {
        gameWorker.postMessage({fn, args: [args]});
    }
}

function render() {
    gameWorker.postMessage({ fn: 'render', args: ['points'] });
    gameWorker.postMessage({ fn: 'render', args: ['generators'] });
    gameWorker.postMessage({ fn: 'render', args: ['boost'] });
    gameWorker.postMessage({ fn: 'render', args: ['collapse'] });
    gameWorker.postMessage({ fn: 'render', args: ['prestige'] });
    gameWorker.postMessage({ fn: 'render', args: ['statistics'] });
    gameWorker.postMessage({ fn: 'render', args: ['infinity'] });
}

function exec(fn, args) {
    gameWorker.postMessage({ fn: fn, args: args });
}

function importSave() {
    let data = prompt('Paste your savegame in here.');
    if(data) {
        exec('load', [data]);
    }
}

function setAutoSaveInterval() {
    let interval = prompt('Set a new interval in seconds, max 1000 (0 to disable autosave)');
    if(isNaN(interval)) return;
    if(interval) {
        interval = parseInt(interval);
        if(interval > 1000) return;
        call('setAutoSaveInterval', interval);
    }
}

function setNotation() {
    notation++;
    if(notation >= notations.length) notation = 0;
    const notationString = notations[notation];
    call('setNotation', notationString);
}

function main() {
    
    // Load the save game first.
    const savegame = localStorage.yaigSaveGame;
    if(savegame) {
        gameWorker.postMessage({ fn: 'load', args: [savegame] });
    } else {
        gameWorker.postMessage({ fn: 'init', args: [] });
    }

    const renderables = {
        'points': {
            refresh(value) {
                $('.points').text(F(value.points, 0, 3));
                $('.point-gain').text(F(value.pointgen, 0, 3));
                
                if(new Decimal(value.points).eq(2 ** 256)) {
                    $('.points').text('Infinite');
                    $('.point-gain').text('Infinite');
                }

                // calculate percentage bar
                let percentage = Decimal.max(0, Decimal.log10(value.points).div(LOG10_INFINITY).times(100));
                $(`.infinity-percentage-label`).text(F(percentage, 2) + '% to Infinity');
                $('.infinity-percentage-value').css('width', percentage.toNumber() + '%');
            }
        },

        'generators': {
            refresh(value) {
                $('[class^=gen-]').hide();
                for(let [k, v] of value) {
                    const cost = new Decimal(v.cost);

                    $(`.gen-${k}`).show();
                    $(`.generator-amount-${k}`).text(F(v.amount));
                    $(`.generator-multiplier-${k}`).text('x'+F(v.multiplier));
                    $(`.generator-cost-${k}`).text(F(cost, 0, 3));
                    $(`.generator-gain-${k}`).text('(+' + F(v.gain, 3, 3) + '%)');
                    toggleButton(`.btn-generator-${k}`, !v.canAfford);

                    if(cost.gte(2 ** 256)) {
                        $(`.generator-cost-${k}`).text('Infinite');
                    }
                }
            }
        },

        'boost': {
            refresh(value) {
                const cost = new Decimal(value.cost);

                $('.boost-cost').text('Cost: ' + F(value.cost, 0, 3))
                $('.boost-amount').text(F(value.amount, 0, 3))
                $('.boost-effect').text(F(value.effect))
                $('.boost-multiplier').text(F(value.multiplier))
                toggleButton(`.boost-cost`, !value.canAfford);
                toggleButton(`.boost-cost-max`, !value.canAfford);

                if(cost.gte(2 ** 256)) {
                    $(`.boost-cost`).text('Cost: Infinite');
                }
            }
        },

        'collapse': {
            refresh(value) {
                let amount = new Decimal(value.amount).toNumber();
                $('.collapse-need').text(['4th', '5th', '6th', '7th'][amount]);
                $('.collapse').toggle(value.visible);
                toggleButton('.btn-collapse', !value.canAfford);
            }
        },

        'prestige': {
            refresh(value) {
                const amount = new Decimal(value.amount);
                const gain = new Decimal(value.gain);

                $('.prestige-bonus').toggle(amount.gt(1));
                $('.prestige').toggle(value.visible);
                $('.prestige-bonus-current').text(F(amount));
                $('.prestige-bonus-next').text(F(gain));
                $('.prestige-bonus-gain-add').text(F(gain.minus(amount)));
                $('.prestige-bonus-gain-mult').text(F(gain.div(amount)));
                toggleButton('.btn-prestige', !value.canAfford);

                if(amount.gte(2.5)) {
                    $('.prestige-bonus-next').text(F(gain) + ' (MAX)');
                    toggleButton('.btn-prestige', true);
                }
            }
        },

        'infinity': {
            refresh(value) {
                const hasInfinitied = new Decimal(value.infinities).gt(0);
                $('.nav-infinity').toggle(hasInfinitied)
                $('.btn-gain-infinity').toggle(value.canAfford);
                $('.ip-header').toggle(hasInfinitied || new Decimal(value.infinityPoints).gt(0));
                toggleButton('.btn-gain-infinity', !value.canAfford);
                $('.infinity-points').text(F(value.infinityPoints, 0, 3));

                for(let [k, v] of value.generators) {
                    const cost = new Decimal(v.cost);
                    $(`.infinity-generator-amount-${k}`).text(F(v.amount));
                    $(`.infinity-generator-multiplier-${k}`).text('x'+F(v.multiplier));
                    $(`.infinity-generator-cost-${k}`).text(F(cost, 0, 3));
                    $(`.infinity-generator-gain-${k}`).text('(+' + F(v.gain, 3, 3) + '%)');
                    toggleButton(`.btn-infinity-generator-${k}`, !v.canAfford);
                }

                $('.infinity-power').text(F(value.infinityPower, 0, 3));
                $('.infinity-power-effect').text('x' + F(value.infinityPowerEffect, 3));
                $('.infinity-infinities').text(F(value.infinities, 0, 3));

                const nerf = Decimal.min(Decimal.div(value.infinities, 256), 1).toNumber();
                $('.infinity-nerf').text(F(nerf, 4));
            }
        },

        'autoSaveInterval': {
            refresh(value) {
                $('.save-interval').text(value === 0 ? 'OFF' : `${value}s`);
            }
        },

        'notation': {
            refresh(value) {
                $('.notation').text(value);
                notation = notations.indexOf(value);
            }
        },

        'statistics': {
            refresh(value) {
                $('.stat-time-in-infinity').text(new Date(value.timeInCurrentInfinity).toISOString().slice(11, 23));
                $('.stat-infinities').text(F(value.infinities, 0, 3));
            }
        }
    }

    gameWorker.onerror = (e) => {
        console.error(e.message);
    }

    gameWorker.onmessage = (e) => {
        let saveGame;
        switch(e.data.fn) {
            case 'save':
                saveGame = e.data.result.savegame;
                localStorage.yaigSaveGame = saveGame;
                $.notify('Game saved!', 'success');
                break;
            case 'load':
                $.notify('Game loaded!', 'success');
                break;
            case 'export':
                saveGame = e.data.result.savegame;
                navigator.clipboard.writeText(savegame);
                console.log('Exported game to clipboard!');
                break;
            case 'offline':
                const { fromDate, toDate, max, progress, status } = e.data.result;
                
                $('.offline-tick-progress').html(`${new Date(fromDate).toISOString().slice(11, 23)} → ${new Date(toDate).toISOString().slice(11, 23)}<br>
                ${progress} / ${max} ticks simulated<br>
                (${new Date(progress).toISOString().slice(11, 23)} / ${new Date(max).toISOString().slice(11, 23)})`);
    
                let percentage = (progress / max) * 100;
                $(`.offline-tick-percentage-label`).text(F(percentage, 2) + '%');
                $('.offline-tick-percentage-value').css('width', percentage + '%');
    
                $('.offline-tick-modal').toggle(status !== 'complete');
                break;
            case 'render':
                renderables[e.data.result.key]?.refresh(e.data.result.value);
                break;
        }
    }

    setInterval(render, 1000/60);
}

document.addEventListener('DOMContentLoaded', main);

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'm': case 'M':
            call('buyMaxAll', []);
            break;
    }
})