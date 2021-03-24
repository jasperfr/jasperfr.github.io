function saveGame() {
    const data = {
        dimensions: dimensions.slice(),
        tickspeed: tickspeed
    }

    // convert data to base64 string based off a JSON object.
    const compressed = btoa(JSON.stringify(data));

    // store in local storage.
    localStorage.savegame = compressed;
}

function loadGame() {
    const data = localStorage.savegame;
    if(data == undefined) return;
    const parsed = JSON.parse(atob(data));

    dimensions = parsed.dimensions;
    tickspeed = parsed.tickspeed;

    $('.tickspeed').text(tickspeed.speed.toMixedScientific());
    $('.tickspeedCost').text(tickspeed.cost.toMixedScientific());
}

function exportGame() {
    const data = {
        dimensions: dimensions.slice(),
        tickspeed: tickspeed
    }
    const compressed = btoa(JSON.stringify(data));
    navigator.clipboard.writeText(compressed).then(() => 
        console.log('Copied save game to clipboard.'),
        (err) => console.log(err));
}

function resetGame() {
    if(confirm("WARNING! You will lose EVERYTHING! Are you ABSOLUTELY SURE you want to restart the entire game?")) {
        if(prompt("THIS IS YOUR LAST CHANCE. If you REALLY WANT TO RESET ALL PROGRESS, type \"stroopwafel\" into the field below.") == "stroopwafel") {
            
            // Reset dimensions.
            dimensions = [
                { amount: 10, multiplier: 1.0, bought: 0, price: null },
                { amount: 0, multiplier: 1.0, bought: 0, price: 1e1, increase: 3 },
                { amount: 0, multiplier: 1.0, bought: 0, price: 1e2, increase: 4 },
                { amount: 0, multiplier: 1.0, bought: 0, price: 1e3, increase: 5 },
                { amount: 0, multiplier: 1.0, bought: 0, price: 1e4, increase: 6 },
                { amount: 0, multiplier: 1.0, bought: 0, price: 1e5, increase: 7 },
                { amount: 0, multiplier: 1.0, bought: 0, price: 1e6, increase: 8 },
                { amount: 0, multiplier: 1.0, bought: 0, price: 1e7, increase: 9 },
                { amount: 0, multiplier: 1.0, bought: 0, price: 1e8, increase: 10 },
                { amount: 0, multiplier: 1.0, bought: 0, price: 1e9, increase: 11 }
            ];
            tickspeed = { speed: 1000.0, amount: 0, cost: 1000, decrease: 6 };

            $('.tickspeed').text(tickspeed.speed.toMixedScientific());
            $('.tickspeedCost').text(tickspeed.cost.toMixedScientific());

            // Reset dimension buyers.
            for(let $dimension of $dimensions) {
                $dimension.remove();
            }
            $dimensions = [];

            for(let i = 1; i <= 9; i++) {
                let $element = $(`
                <tr class="dimension ${i}">
                    <td class="dname">${i.toOrdinal()} dimension x<span class="multiplier">1.0</span></td>
                    <td class="damount"><span class="count">0</span> (<span class="bought">0</span>)</td>
                    <td class="dbuttons">
                        <button class="single notafford" onclick="buy(${i})">Cost: <span class="price">${(dimensions[i].price).toMixedScientific(true)}</span></button>
                        <button class="bulk notafford" onclick="buy(${i}, true)">Until 10, Cost: <span class="price10">${(dimensions[i].price * 10).toMixedScientific(true)}</span></button>
                    </td>
                </tr>`);
                
                $dimensions.push($element);
                $('table.dimensions').append($element);
            }
        }
    }
}