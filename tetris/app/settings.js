const HANDLING_GUIDELINE = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    softDrop: 'ArrowDown',
    hardDrop: ' ',
    rotateCW: 'ArrowUp,x',
    rotateCCW: 'z',
    rotate180: 'a',
    hold: 'Shift'
}

var settings = {
    boundKeys: {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        softDrop: 'ArrowDown',
        hardDrop: ' ',
        rotateCW: 'ArrowUp,x',
        rotateCCW: 'z',
        rotate180: 'a',
        hold: 'Shift'
    },
    ARR: 0,
    DAS: 0,
    SDF: 0,
    boardBounce: true,
    boardShake: true,
    volume: 100
};

function setSettingsValues() {
    $('input[name="left"]').val(settings.boundKeys.left);
    $('input[name="right"]').val(settings.boundKeys.right);
    $('input[name="softdrop"]').val(settings.boundKeys.softDrop);
    $('input[name="harddrop"]').val(settings.boundKeys.hardDrop);
    $('input[name="rotatecw"]').val(settings.boundKeys.rotateCW);
    $('input[name="rotateccw"]').val(settings.boundKeys.rotateCCW);
    $('input[name="flip"]').val(settings.boundKeys.rotate180);
    $('input[name="hold"]').val(settings.boundKeys.hold);
}

function loadSettings() {
    if(localStorage.settings) {
        settings = JSON.parse(atob(localStorage.settings));
        setSettingsValues();
    }
}

function saveSettings() {
    settings.boundKeys.left = $('input[name="left"]').val();
    settings.boundKeys.right = $('input[name="right"]').val();
    settings.boundKeys.softDrop = $('input[name="softdrop"]').val();
    settings.boundKeys.hardDrop = $('input[name="harddrop"]').val();
    settings.boundKeys.rotateCW = $('input[name="rotatecw"]').val();
    settings.boundKeys.rotateCCW = $('input[name="rotateccw"]').val();
    settings.boundKeys.rotate180 = $('input[name="flip"]').val();
    settings.boundKeys.hold = $('input[name="hold"]').val();

    localStorage.settings = btoa(JSON.stringify(settings));
    setSettingsValues();
}

function changeSetting(setting, value) {
    settings[setting] = value;
    setSettingsValues();
};

$(() => loadSettings());
