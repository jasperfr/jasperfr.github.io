const INFINITY = 2 ** 256;
const LOG10_INFINITY = 77.06367888997919;
const s=['K','M','B','T','Qd','Qt','Sx','Sp','Oc','No','Dc'];
const __=(n,p=0,w=0)=>n===null||n===undefined?'NaN':n.mag<0.001?(0).toFixed(p):n.e<3?n.toFixed(p):n.e<=s.length*3?n.div(`1e${n.e-n.e%3}`).toFixed(w)+' '+s[~~(n.e/3)-1]:n.toFixed(w);
const gameWorker = new Worker('./src/game.mjs', { type: 'module' });

const toggleButton = function(element, query) {
    document.querySelector(element).classList[['remove', 'add'][0 | query]]('cant');
}

const F = function(number, precision = 3, precisionHigh = 3) {
    number = new Decimal(number);
    const options = { data: { notation: 'Scientific' } };
    switch(options.data.notation) {
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

function render() {
    gameWorker.postMessage({ fn: 'getRenderData', args: ['player-points'] });
    gameWorker.postMessage({ fn: 'getRenderData', args: ['generators'] });
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

function main() {
    
    // Load the save game first.
    const savegame = localStorage.yaigSaveGame;
    if(savegame) {
        gameWorker.postMessage({ fn: 'load', args: [savegame] });
    } else {
        gameWorker.postMessage({ fn: 'start', args: [] });
    }

    const renderables = {
        'player-points': {
            refresh(value) {
                $('.points').text(F(value.points));
                $('.point-gain').text(F(value.pointgen));
            }
        },

        'generators': {
            refresh(value) {
                for(let [k, v] of value) {
                    $(`.generator-amount-${k}`).text(F(v.amount));
                    $(`.generator-multiplier-${k}`).text('x'+F(v.multiplier));
                    $(`.generator-cost-${k}`).text(F(v.cost, 0, 3));
                    $(`.generator-gain-${k}`).text('(+' + F(v.gain, 3, 3) + '%)');
                    toggleButton(`.btn-generator-${k}`, !v.canAfford)
                }
            }
        }
    }

    gameWorker.onmessage = (e) => {
        let saveGame;
        switch(e.data.fn) {
            case 'save':
                saveGame = e.data.result.savegame;
                localStorage.yaigSaveGame = saveGame;
                console.log('Game saved.');
                break;
            case 'load':
                console.log('Loaded game.');
                break;
            case 'export':
                saveGame = e.data.result.savegame;
                navigator.clipboard.writeText(savegame);
                console.log('Exported game to clipboard!');
                break;
            case 'renderOfflineProgress':
                const { fromDate, toDate, max, progress, status } = e.data.result;
                
                $('.offline-tick-progress').html(`${new Date(fromDate).toISOString().slice(11, 23)} → ${new Date(toDate).toISOString().slice(11, 23)}<br>
                ${progress} / ${max} ticks simulated<br>
                (${new Date(progress).toISOString().slice(11, 23)} / ${new Date(max).toISOString().slice(11, 23)})`);
    
                let percentage = (progress / max) * 100;
                $(`.offline-tick-percentage-label`).text(F(percentage, 2) + '%');
                $('.offline-tick-percentage-value').css('width', percentage + '%');
    
                $('.offline-tick-modal').toggle(status !== 'complete');
                break;
            case 'getRenderData':
                renderables[e.data.result.key]?.refresh(e.data.result.value);
                break;
        }
    }

    setInterval(render, 1000/60);
}

document.addEventListener('DOMContentLoaded', main);