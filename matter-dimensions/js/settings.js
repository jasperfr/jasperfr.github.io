function saveGame() {
    const data = {
        dimensions: dimensions.slice()
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
}

function exportGame() {
    const data = {
        dimensions: dimensions.slice()
    }
    const compressed = btoa(JSON.stringify(data));
    navigator.clipboard.writeText(compressed).then(() => 
        console.log('Copied save game to clipboard.'),
        (err) => console.log(err));
}
