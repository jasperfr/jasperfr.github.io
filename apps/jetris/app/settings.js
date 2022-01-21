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

var handling = {
    ARR: 2,
    DAS: 10,
    DCD: 1,
    SDF: 6
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

    ARR = handling.ARR;
    $('#arr input').val(5.0 - ARR);
    $('#arr .val').html(`${(ARR * 16.666).toFixed(1)}ms / ${ARR}F`);
    DAS = handling.DAS;
    $('#das input').val(21.0 - DAS);
    $('#das .val').html(`${(DAS * 16.666).toFixed(1)}ms / ${DAS}F`);
    DCD = handling.DCD;
    $('#dcd input').val(21.0 - DCD);
    $('#dcd .val').html(`${(DCD * 16.666).toFixed(1)}ms / ${DCD}F`);
    SDF = handling.SDF;
    $('#sdf input').val(SDF);
    $('#sdf .val').html(`${SDF <= 40 ? SDF : '∞'}x`);
}

function loadSettings() {
    if(localStorage.settings) {
        settings = JSON.parse(atob(localStorage.settings));
    }
    if(localStorage.handling) {
        handling = JSON.parse(atob(localStorage.handling));
    }
    setSettingsValues();
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

    handling = {
        DAS: DAS,
        ARR: ARR,
        SDF: SDF,
        DCD: DCD,
    }

    localStorage.settings = btoa(JSON.stringify(settings));
    localStorage.handling = btoa(JSON.stringify(handling));
    setSettingsValues();
}

function changeSetting(setting, value) {
    settings[setting] = value;
    setSettingsValues();
};

$(() => loadSettings());

$(() => {
    $('#arr input').on('input', function() {
        ARR = (5.0 - $('#arr input').val()).toFixed(1);
        $('#arr .val').html(`${(ARR * 16.666).toFixed(1)}ms / ${ARR}F`);
    });
    $('#das').on('input', function() {
        DAS = (21.0 - $('#das input').val()).toFixed(1);
        $('#das .val').html(`${(DAS * 16.666).toFixed(1)}ms / ${DAS}F`);
    });
    $('#dcd').on('input', function() {
        DCD = (21.0 - $('#dcd input').val()).toFixed(1);
        $('#dcd .val').html(`${(DCD * 16.666).toFixed(1)}ms / ${DCD}F`);
    });
    $('#sdf').on('input', function() {
        SDF = $('#sdf input').val();
        $('#sdf .val').html(`${SDF <= 40 ? SDF : '∞'}x`);
    });
})