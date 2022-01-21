const ButtonState = {
    OFF: 0,
    PRESSED: 1,
    HELD: 2,
    RELEASED: 3
};

const buttons = {
    left: ButtonState.OFF,
    right: ButtonState.OFF,
    softDrop: ButtonState.OFF,
    hardDrop: ButtonState.OFF,
    rotateCW: ButtonState.OFF,
    rotateCCW: ButtonState.OFF,
    rotate180: ButtonState.OFF,
    hold: ButtonState.OFF
};

const keybinds = {
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    softDrop: ['ArrowDown'],
    hardDrop: [' '],
    rotateCW: ['ArrowUp', 'x'],
    rotateCCW: ['z'],
    rotate180: ['a'],
    hold: ['Shift']
}

function debuggerKeys() {
    for(let button in buttons) {
        let element = document.getElementById(button);
        switch(buttons[button]) {
            case ButtonState.OFF: element.className = ''; break;
            case ButtonState.PRESSED: element.className = 'red'; break;
            case ButtonState.HELD: element.className = 'blue'; break;
            case ButtonState.RELEASED: element.className = 'green'; break;
        }
    }
}

window.addEventListener('keydown', function(e) {
    const key = e.key;
    const keyBind = Object.keys(keybinds).filter(k => keybinds[k].indexOf(key) !== -1)[0];
    if(!keyBind) return;
    if(buttons[keyBind] === ButtonState.OFF) {
        buttons[keyBind] = ButtonState.PRESSED;
        console.log(keyBind + ' is pressed.');
        setTimeout(function() {
            if(buttons[keyBind] === ButtonState.PRESSED) {
                buttons[keyBind] = ButtonState.HELD;
                console.log(keyBind + ' is held.');
                debuggerKeys();
            }
        }, 166.7);
    }
    debuggerKeys();
});

window.addEventListener('keyup', function(e) {
    const key = e.key;
    const keyBind = Object.keys(keybinds).filter(k => keybinds[k].indexOf(key) !== -1)[0];
    if(!keyBind) return;
    buttons[keyBind] = ButtonState.RELEASED;
    console.log(keyBind + ' is released.');
    debuggerKeys();
    setTimeout(function() {
        if(buttons[keyBind] === ButtonState.RELEASED) {
            buttons[keyBind] = ButtonState.OFF;
            console.log(keyBind + ' is off.');
            debuggerKeys();
        }
    }, 166.7);
});