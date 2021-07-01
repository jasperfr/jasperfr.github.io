function fmod(a, b) {
    return (a < 0 && b + a) || a % b;
}  

const SRSX = {
    "_comment1": "Kicks",
    "N0-1": [[ 0, 0], [-1, 0], [-1, 1], [ 0,-2], [-1,-2]],
    "N1-0": [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]],
    "N1-2": [[ 0, 0], [ 1, 0], [ 1,-1], [ 0, 2], [ 1, 2]],
    "N2-1": [[ 0, 0], [-1, 0], [-1, 1], [ 0,-2], [-1,-2]],
    "N2-3": [[ 0, 0], [ 1, 0], [ 1, 1], [ 0,-2], [ 1,-2]],
    "N3-2": [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]],
    "N3-0": [[ 0, 0], [-1, 0], [-1,-1], [ 0, 2], [-1, 2]],
    "N0-3": [[ 0, 0], [ 1, 0], [ 1, 1], [ 0,-2], [ 1,-2]], 

    "_comment2": "180 Kicks",
    "N0-2": [[ 0, 0], [ 1, 0], [ 2, 0], [ 1,-1], [ 2,-1], [-1, 0], [-2, 0], [-1,-1], [-2,-1], [ 0, 1], [ 3, 0], [-3, 0]],
    "N1-3": [[ 0, 0], [ 0,-1], [ 0,-2], [-1,-1], [-1,-2], [ 0, 1], [ 0, 2], [-1, 1], [-1, 2], [ 1, 0], [ 0,-3], [ 0, 3]],
    "N2-0": [[ 0, 0], [-1, 0], [-2, 0], [-1, 1], [-2, 1], [ 1, 0], [ 2, 0], [ 1, 1], [ 2, 1], [ 0,-1], [-3, 0], [ 3, 0]],
    "N3-1": [[ 0, 0], [ 0,-1], [ 0,-2], [ 1,-1], [ 1,-2], [ 0, 1], [ 0, 2], [ 1, 1], [ 1, 2], [-1, 0], [ 0,-3], [ 0, 3]],

    "_comment3": "I Piece Kicks",
    "I0-1": [[ 0, 0], [-2, 0], [ 1, 0], [-2,-1], [ 1, 2]],
    "I1-0": [[ 0, 0], [ 2, 0], [-1, 0], [ 2, 1], [-1,-2]],
    "I1-2": [[ 0, 0], [-1, 0], [ 2, 0], [-1, 2], [ 2,-1]],
    "I2-1": [[ 0, 0], [ 1, 0], [-2, 0], [ 1,-2], [-2, 1]],
    "I2-3": [[ 0, 0], [ 2, 0], [-1, 0], [ 2, 1], [-1,-2]],
    "I3-2": [[ 0, 0], [-2, 0], [ 1, 0], [-2,-1], [ 1, 2]],
    "I3-0": [[ 0, 0], [ 1, 0], [-2, 0], [ 1,-2], [-2, 1]],
    "I0-3": [[ 0, 0], [-1, 0], [ 2, 0], [-1, 2], [ 2,-1]],

    "_comment4": "I Piece 180 Kicks",
    "I0-2": [[ 0, 0], [-1, 0], [-2, 0], [ 1, 0], [ 2, 0], [ 0,-1]],
    "I1-3": [[ 0, 0], [ 0,-1], [ 0,-2], [ 0, 1], [ 0, 2], [-1, 0]],
    "I2-0": [[ 0, 0], [ 1, 0], [ 2, 0], [-1, 0], [-2, 0], [ 0, 1]],
    "I3-1": [[ 0, 0], [ 0,-1], [ 0,-2], [ 0, 1], [ 0, 2], [ 1, 0]]
}

function createAllClear() {
    let $element = $(`<h1 id="all-clear" style="z-index:9999;">PERFECT CLEAR!</h1>`);
    $('#game').prepend($element);
    setTimeout(() => {
        $element.remove();
    }, 3000);
    explode();
};

function show($el) {
    $el.show();
}
function hide($el) {
    $el.hide();
}

var paused = false;
var DAS = 10, SDF = 4;
var boardRotate = 0;

var $lineClear, $combo, $comboCount, $tSpinHeader, $tSpinCount;

$(() => {
    $lineClear = $('#line-clear');
    $combo = $('#combo');
    $comboCount = $('#combo-count');
    $tSpinHeader = $('#tspin');
    $tSpinCount = $('#tspin-count');

    hide($lineClear);
    hide($combo);
    hide($tSpinHeader);
    hide($tSpinCount);

    $('#sdf').on('input', function() {
        SDF = $('#sdf').val();
        $('#sdf-val').text($('#sdf').val());
    });
    $('#das').on('input', function() {
        DAS = $('#das').val();
        $('#das-val').text($('#das').val());
    });
    window.addEventListener('keydown', function(e) {
        if(e.keyCode == 27) {
            $('#settings').toggle();
            paused ^= true;
        }
    });
    $('#settings').hide();

    sprites.J = new Image(20, 20); sprites.J.src = 'sprites/J.png';
    sprites.Z = new Image(20, 20); sprites.Z.src = 'sprites/Z.png';
    sprites.O = new Image(20, 20); sprites.O.src = 'sprites/O.png';
    sprites.S = new Image(20, 20); sprites.S.src = 'sprites/S.png';
    sprites.L = new Image(20, 20); sprites.L.src = 'sprites/L.png';
    sprites.I = new Image(20, 20); sprites.I.src = 'sprites/I.png';
    sprites.T = new Image(20, 20); sprites.T.src = 'sprites/T.png';
    sprites.H = new Image(20, 20); sprites.H.src = 'sprites/H.png';
    sprites.G = new Image(20, 20); sprites.G.src = 'sprites/G.png';
    sprites.X = new Image(20, 20); sprites.X.src = 'sprites/X.png';
});

var sprites = {};

function playSound(sound) {
    new Audio(`audio/${sound}.ogg`).play();
};

var score = 0;

// Returns [x, y, new rotation], or [0, 0, same rotation] if no kick has been found.
function getKickTable(piece, board, xpos, ypos, rotationFrom, rotationTo) {
    let key = `${piece=='I'?'I':'N'}${rotationFrom}-${rotationTo}`;
    let table = SRSX[key];
    let pieceMatrix = pieces[piece].grid[rotationTo];
    let q = 0;
    for(let xy of table) {
        let tx = xy[0];
        let ty = xy[1];
        let ok = true;
        for(let i = 0; i <= 15; i++) {
            let x = xpos + i % 4 + tx;
            let y = ypos + Math.floor(i / 4) - ty;
            if(board[y] == undefined) continue; // prevent overflowing
            if(board[y][x + 1] != 0 && pieces[currentPiece].grid[rotationTo][i] == 1) ok = false;
        }
        if(ok) {
            playSound('rotate');
            score += 1;
            return [xpos + tx, ypos - ty, rotationTo, q];
        }
        q++;
    }
    return [xpos, ypos, rotationFrom, -1];
}

const _BOARD_ = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

var lineClears = 0;
const TICKSPEED = 17;
var piecesPlaced = 0, millisecondsElapsed = 0.0001;
function getPPS() {
    millisecondsElapsed += TICKSPEED;
    let $pps = $('#pieces-per-second');
    let pps = piecesPlaced / millisecondsElapsed * 1000;
    $pps.text(pps.toFixed(2));
};
function getTime() {
    let $time = $('#time');
    let time = millisecondsElapsed;
    $time.text(`${Math.floor(time / 60000)}:${('00' + Math.floor(time / 1000) % 60).slice(-2)}.${('000' + Math.floor(time % 1000)).slice(-3)}`);
}
function getLines() {
    let $lines = $('#lines');
    $lines.text(lineClears);
}

var board = JSON.parse(JSON.stringify(_BOARD_));

function checkTSpin(piece, board, x, y, r, kick) {
    if(piece !== 'T') return false;
    let pieceGrid = pieces['T']['grid'][r];

    let corners = {
        topLeft: board[y + 1][x + 1] != 0,
        topRight: board[y + 1][x + 3] != 0,
        bottomLeft: board[y + 3][x + 1] != 0,
        bottomRight: board[y + 3][x + 3] != 0
    }

    //console.log(corners);

    let facingCorners = 0;
    let behindCorners = 0;

    //console.log('Rotation: ' + r);
    switch(r) {
        case 0: // ┴
        facingCorners = corners.topLeft + corners.topRight;
        behindCorners = corners.bottomLeft + corners.bottomRight;
        break;
        case 1: // ├
        facingCorners = corners.topRight + corners.bottomRight;
        behindCorners = corners.topLeft + corners.bottomLeft;
        break;
        case 2: // ┬
        facingCorners = corners.bottomLeft + corners.bottomRight;
        behindCorners = corners.topLeft + corners.topRight;
        break;
        case 3: // ┤
        facingCorners = corners.topLeft + corners.bottomLeft;
        behindCorners = corners.topRight + corners.bottomRight;
        break;
    }

    //console.log('facing corners: ' + facingCorners);
    //console.log('corners behind T: ' + behindCorners);
    if(kick == 4) console.log('Exception: kick table is 4.')

    if(facingCorners + behindCorners >= 3) {
        if(facingCorners == 1 && kick != 4) {
            //console.log('This is a T-Spin mini.');
            return 1;
        } else {
            //console.log('This is a T-Spin.');
            return 2;
        }
    }

    return false;
}

const pieces = {
    "J": {
        color: '#0000FF',
        fill: 1,
        grid: [
            [
                0, 0, 0, 0,
                1, 0, 0, 0,
                1, 1, 1, 0,
                0, 0, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 0, 0,
                0, 1, 0, 0,
            ],
            [
                0, 0, 0, 0,
                0, 0, 0, 0,
                1, 1, 1, 0,
                0, 0, 1, 0
            ],
            [
                0, 0, 0, 0,
                0, 1, 0, 0,
                0, 1, 0, 0,
                1, 1, 0, 0
            ],
        ]
    },
    "L": {
        color: '#FF8000',
        fill: 2,
        grid: [
            [
                0, 0, 0, 0,
                0, 0, 1, 0,
                1, 1, 1, 0,
                0, 0, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 1, 0, 0,
                0, 1, 0, 0,
                0, 1, 1, 0
            ],
            [
                0, 0, 0, 0,
                0, 0, 0, 0,
                1, 1, 1, 0,
                1, 0, 0, 0
            ],
            [
                0, 0, 0, 0,
                1, 1, 0, 0,
                0, 1, 0, 0,
                0, 1, 0, 0
            ],
        ]
    },
    "T": {
        color: '#FF00FF',
        fill: 3,
        grid: [
            [
                0, 0, 0, 0,
                0, 1, 0, 0,
                1, 1, 1, 0,
                0, 0, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 1, 0, 0,
                0, 1, 1, 0,
                0, 1, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 0, 0, 0,
                1, 1, 1, 0,
                0, 1, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 1, 0, 0,
                1, 1, 0, 0,
                0, 1, 0, 0
            ]
        ]
    },
    "O": {
        color: '#FFFF00',
        fill: 4,
        grid: [
            [
                0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 1, 0,
                0, 0, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 1, 0,
                0, 0, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 1, 0,
                0, 0, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 1, 0,
                0, 0, 0, 0
            ],
        ]
    },
    "I": {
        color: '#00FFFF',
        fill: 5,
        grid: [
            [
                0, 0, 0, 0,
                1, 1, 1, 1,
                0, 0, 0, 0,
                0, 0, 0, 0
            ],
            [
                0, 0, 1, 0,
                0, 0, 1, 0,
                0, 0, 1, 0,
                0, 0, 1, 0
            ],
            [
                0, 0, 0, 0,
                0, 0, 0, 0,
                1, 1, 1, 1,
                0, 0, 0, 0
            ],
            [
                0, 1, 0, 0,
                0, 1, 0, 0,
                0, 1, 0, 0,
                0, 1, 0, 0
            ],
        ]
    },
    "S": {
        color: '#00FF00',
        fill: 6,
        grid: [
            [
                0, 0, 0, 0,
                0, 1, 1, 0,
                1, 1, 0, 0,
                0, 0, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 1, 0, 0,
                0, 1, 1, 0,
                0, 0, 1, 0
            ],
            [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 1, 1, 0,
                1, 1, 0, 0
            ],
            [
                0, 0, 0, 0,
                1, 0, 0, 0,
                1, 1, 0, 0,
                0, 1, 0, 0
            ],
        ]
    },
    "Z": {
        color: '#FF0000',
        fill: 7,
        grid: [
            [
                0, 0, 0, 0,
                1, 1, 0, 0,
                0, 1, 1, 0,
                0, 0, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 0, 1, 0,
                0, 1, 1, 0,
                0, 1, 0, 0
            ],
            [
                0, 0, 0, 0,
                0, 0, 0, 0,
                1, 1, 0, 0,
                0, 1, 1, 0
            ],
            [
                0, 0, 0, 0,
                0, 1, 0, 0,
                1, 1, 0, 0,
                1, 0, 0, 0
            ],
        ]
    },
}

function shuffle(array) {
    var currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

const BAG = ['J', 'Z', 'O', 'S', 'L', 'T', 'I'];
var bags = shuffle(BAG.slice()).concat(shuffle(BAG.slice()));
function getNextPiece() {
    let piece = bags.shift();
    if(bags.length < 7) {
        bags = bags.concat(shuffle(BAG.slice()));
    }
    return piece;
}

function restart() {
    Score.set(0);
    Level.restart();
    kick = -1;
    tspin = 0;
    bags = shuffle(BAG.slice()).concat(shuffle(BAG.slice()));
    posX = 3;
    posY = 16;
    holdPiece = null;
    currentPiece = getNextPiece();
    board = JSON.parse(JSON.stringify(_BOARD_));
    dropTimer = 0;
    rotation = 0;
    piecesPlaced = 0;
    millisecondsElapsed = 0.0001;
    lineClears = 0;
    holdBool = false;
    warning = false;
    $('#game').removeClass('warning');
}

const s = 20; // piece size
function drawGrid(ctx) {
    ctx.clearRect(0, 0, 204, 484);

    ctx.fillStyle = '#000000CC';
    ctx.fillRect(0, 80, 204, 484);

    ctx.strokeStyle = '#444';
    for(let x = 0; x < 10; x++) {
        drawLine(ctx, 2 + x * s, 82, 2 + x * s, 484);
    }
    for(let y = 0; y < 20; y++) {
        drawLine(ctx, 2, 82 + y * s, 204, 82 + y  * s);
    }
}

function drawBorder(ctx) {
    ctx.strokeStyle = warning ? '#ff0000' : '#ffffff';
    drawLine(ctx, 0.5, 80, 0.5, 484);
    drawLine(ctx, 1.5, 80, 1.5, 484);

    drawLine(ctx, 202.5, 80, 202.5, 484);
    drawLine(ctx, 203.5, 80, 203.5, 484);

    drawLine(ctx, 0, 482.5, 204, 482.5);
    drawLine(ctx, 0, 483.5, 204, 483.5);
}

const MARGIN = 2;

// J L T O I S Z
const pcs = ['J', 'L', 'T', 'O', 'I', 'S', 'Z', 'H'];
fillStyles = ['#0000FF', '#FF8000', '#FF00FF', '#FFFF00', '#00FFFF', '#00FF00', '#FF0000', '#808080']
function drawPieces(ctx) {
    for(let y = 15; y < 40; y++) {
        for(let x = 0; x < 10; x++) {
            let piece = board[y][x + 1];
            if(piece == 0) continue;
            let px = pcs[piece - 1];
            if(px == undefined) continue;
            ctx.drawImage(sprites[px], MARGIN + x * s, MARGIN + (y - 20) * s + 80);
        }
    }
}

function drawHoldPiece() {
    let ch = document.getElementById('hold');
    let ctxh = ch.getContext('2d');
    ctxh.clearRect(0, 0, 200, 150);

    if(!holdPiece) return;
    let p = pieces[holdPiece];
    let sprite = holdBool ? sprites['H'] : sprites[holdPiece];
    ctxh.fillStyle = p.color;
    for(let x = 0; x < 4; x++) {
        for(let y = 0; y < 4; y++) {
            let current = p.grid[0][y * 4 + x];
            if (current == 1) {
                if(holdPiece == 'I') {
                    ctxh.drawImage(sprite,  x * 20 + 10, y * 20 + 10);
                }
                else if(holdPiece == 'O')
                    ctxh.drawImage(sprite, x * 20 + 10, y * 20);
                else 
                    ctxh.drawImage(sprite, x * 20 + 20, y * 20);
            }
        }
    }
}

function drawNext() {
    let cn = document.getElementById('next');
    let ctxn = cn.getContext('2d');
    ctxn.clearRect(0, 0, 100, 320);

    for(let i = 0; i < 5; i++) {
        let offset = i * 64;
        let p = pieces[bags[i]];
        let pc = bags[i];
        let sprite = sprites[pc];
        for(let x = 0; x < 4; x++) {
            for(let y = 0; y < 4; y++) {
                let current = p.grid[0][y * 4 + x];
                if (current == 1) {
                    if(pc == 'I') {
                        ctxn.drawImage(sprite, x * 20 + 10, i * 60 + y * 20 + 10);
                    }
                    else if(pc == 'O')
                        ctxn.drawImage(sprite, x * 20 + 10, i * 60 + y * 20);
                    else 
                        ctxn.drawImage(sprite, x * 20 + 20, i * 60 + y * 20);
                }
            }
        }
    }
}

var rotation = 0;
var posX = 3;
var posY = 16;
var rotation = 0;
var currentPiece = getNextPiece();
var holdPiece = null;

function drawPiece(ctx, x, y, piece, r) {
    let p = pieces[piece];
    ctx.fillStyle = p.color;
    for(let _x = 0; _x < 4; _x++) {
        for(let _y = 0; _y < 4; _y++) {
            let current = p.grid[r][_y * 4 + _x];
            if (current == 1) {
                ctx.drawImage(sprites[piece], MARGIN + (_x + x) * s, MARGIN + (_y + y - 20) * s + 80);
            }
        }
    }
}

function drawShadowPiece(ctx, x, y, piece, r) {
    let p = pieces[piece];
    ctx.fillStyle = '#808080';
    let dy = 0;
    do {
        dy++
    } while (canMoveTo(x, y + dy, r));
    dy--;

    for(let _x = 0; _x < 4; _x++) {
        for(let _y = 0; _y < 4; _y++) {
            let current = p.grid[r][_y * 4 + _x];
            if (current == 1) {
                ctx.drawImage(sprites.G, MARGIN + (_x + x) * s, MARGIN + (_y + y + dy - 20) * s + 80);
            }
        }
    }
}

function newPiece(isHold = false) {

    if(!isHold) {
        piecesPlaced++;
        holdBool = false;
        let p = pieces[currentPiece];
        let fill = p.fill;
        let matrix = p.grid[rotation];
        for(let i = 0; i <= 15; i++) {
            let x = posX + i % 4;
            let y = posY + Math.floor(i / 4);
            if(board[y] == undefined) continue;
            if(matrix[i]) board[y][x + 1] = fill;
        }
    }

    warning = false;
    for(let y = 0; y < 6; y++) {
        for(let x = 1; x < 10; x++) {
            if(board[y][x] != 0) warning = true;
        }
    }
    if(warning) {
        $('#background').css('opacity', '1');
        $('#game').addClass('warning');
    }
    else {
        $('#background').css('opacity', '2');
        $('#game').removeClass('warning');
    }

    triggerLockDelay = false;
    lockTimer = 0;

    posX = 3;
    posY = 16;
    rotation = 0;
    currentPiece = getNextPiece();
    // if(piecesPlaced % 4 == 0) addGarbage(1);
    if(!canMoveTo(3, 16, 0)) gameOver();
}

function drawWarning(ctx) {
    let p = pieces[bags[0]];
    ctx.fillStyle = p.color;
    for(let _x = 0; _x < 4; _x++) {
        for(let _y = 0; _y < 4; _y++) {
            let current = p.grid[0][_y * 4 + _x];
            if (current == 1) {
                ctx.drawImage(sprites['X'], MARGIN + (_x + 3) * s, MARGIN + (_y + 16 - 20) * s + 80);
            }
        }
    }
}

let critical = false;
function checkCritical(x, y, r, piece) {
    // todo fix, make a 4x4 array grid thing ugh
    let next = pieces[bags[0]].grid[0];
    let curr = pieces[piece].grid[r];

    let dy = 0;
    do {
        dy++
    } while (canMoveTo(x, y + dy, r));
    dy--;

    let gridNext = [
        next.slice(0, 4),
        next.slice(4, 8),
        next.slice(8, 12),
        next.slice(12, 16),
    ];

    let gridCurr = [
        curr.slice(0, 4),
        curr.slice(4, 8),
        curr.slice(8, 12),
        curr.slice(12, 16),
    ];

    let __x = x - 3;
    let __y = y - 16;

    for(let _y = 0; _y < 4; _y++) {
        let rowNext = gridNext[_y];
        let rowCurr = gridCurr[_y - __y - dy];
        if(rowCurr == undefined) continue;
        for(let _x = 0; _x < 4; _x++) {
            let xyNext = rowNext[_x];
            let xyCurr = rowCurr[_x - __x];
            if(xyCurr == undefined) continue;
            if(xyNext != 0 && xyNext == xyCurr) return true;
        }
    }

    // check board
    for(let i = 0; i <= 15; i++) {
        let x = 3 + i % 4;
        let y = 16 + Math.floor(i / 4);
        if(board[y] == undefined) continue;
        if(board[y][x + 1] != 0 && pieces[bags[0]].grid[0][i] == 1) return true;
    }

    return false;
}

function drawLine(ctx, x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function addGarbage(lines) {
    let bottom = board.pop();
    let arr = [1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1];
    arr[1 + Math.floor(Math.random() * 10)] = 0;
    for(let i = 0; i < lines; i++) {
        board.splice(0, 1);
        board.push(arr.slice());
    }
    posY--;
    board.push(bottom);
}

/* Key handling */
const pressedKeys = [];
function keyDownEvent(e) {
    if(pressedKeys.indexOf(e.keyCode) == -1) {
        pressedKeys.push(e.keyCode);
    }
}
function keyUpEvent(e) {
    let index = pressedKeys.indexOf(e.keyCode);
    if(index != -1) {
        pressedKeys.splice(index, 1);
    }
}
function removeKey(key) {
    let index = pressedKeys.indexOf(key);
    if(index != -1) {
        pressedKeys.splice(index, 1);
    }
}

var dropRate = 25, dropTimer = 0, lockDelay = 99999999930, lockTimer = 0, triggerLockDelay = false;

function canMoveTo(xpos, ypos, r) {
    let pieceMatrix = pieces[currentPiece].grid[r];
    for(let i = 0; i <= 15; i++) {
        let x = xpos + i % 4;
        let y = ypos + Math.floor(i / 4);
        if(board[y] == undefined) continue;
        if(board[y][x + 1] != 0 && pieces[currentPiece].grid[r][i] == 1) return false;
    }
    return true;
}

class Particle {
    constructor(x, y, c) {
        this.x = x;
        this.y = y;
        this.c = c;
        this.vx = Math.random() * 10 - Math.random() * 10;
        this.vy = Math.random() * 10 - Math.random() * 10;
    }
    render(context) {
        // update
        this.x += this.vx;
        this.y += this.vy;
        this.vx /= 1.1;
        this.vy /= 1.1;
        // render
        context.fillStyle = fillStyles[this.c - 1];
        let size = Math.min(this.vx * 4, 8);
        context.fillRect(this.x - size / 2, this.y - size / 2, size, size);

        if(this.vx < 0.1 && this.vy < 0.1) {
            this.remove();
        }
    }
    remove() {
        particles.splice(particles.indexOf(this), 1);
    }
}
const particles = [];

function addParticle(x, y, color) {
    particles.push(new Particle(x, y, color));
}

const spins = ['SINGLE', 'DOUBLE', 'TRIPLE', 'WHAT'];
var combo = 0;
var b2b = 0;
function checkTetraLines(spin) {
    hide($tSpinHeader);
    hide($tSpinCount);
    if(spin) show($tSpinHeader);
    let clear = 0;
    for(let y = 0; y < 40; y++) {
        let line = board[y];
        if(!line.some(i => i == 0)) {
            // remove this line and add an empty on top of the board
            let l = board.splice(y, 1)[0];
            for(let p = 1; p < l.length - 1; p++) {
                for(let _ = 0; _ < 10 + Math.floor(Math.random() * 10); _++) {
                    addParticle(p * 20, y * 10 + 80, l[p]);
                }
            }

            board.unshift([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
            lineClears++;
            clear++;
        }
    }

    // Check if all clear
    // createAllClear();
    let pc = true;
    for(let y = 0; y < 40; y++) {
        for(let x = 0; x < 10; x++) {
            if(board[y][x + 1]) pc = false;
        }
    }
    if(pc) {
        clears.allclears++;
        playSound('allclear');
        createAllClear();
        score += 4000;
    }

    if(clear == 4) {
        if(!pc) playSound(b2b ? 'clearbtb' : 'clearquad');
        Score.add(b2b ? 1200 : 800);
        b2b++;
    } else if(spin) {
        clears.tspin++;
        if(!pc) playSound('spinend');
        $tSpinCount.text(spins[clear - 1]);
        show($tSpinCount);
        switch(clear) {
            case 3: Score.add(b2b ? 2400 : 1600); break;
            case 2: Score.add(b2b ? 1800 : 1200); break;
            case 1: Score.add(b2b ? 1200 :  800); break;
            case 0: Score.add(100); break;
        }
        b2b++;
    } else if(clear > 0) {
        switch(clear) {
            case 3: Score.add(500); break;
            case 2: Score.add(300); break;
            case 1: Score.add(100); break;
        }

        if(b2b > 1) if(!pc) playSound('btb_break');
        if(!pc) playSound(combo ? `combo_${Math.min(combo, 16)}` : 'clearline');
        maxb2b = Math.max(b2b, maxb2b);
        b2b = 0;
        combo++;
    } else {
        if(combo > 1) if(!pc) playSound('combobreak');
        maxCombo = Math.max(combo, maxCombo);
        combo = 0;
    }
    maxCombo = Math.max(combo, maxCombo);
    maxb2b = Math.max(b2b, maxb2b);
    
    Level.add(clear);

    if(combo <= 1) {
        hide($combo);
    } else {
        $comboCount.text(`x${combo - 1}`);
        show($combo);
    }

    switch(clear) {
        case 4: clears.quad++; break;
        case 3: clears.triple++; break;
        case 2: clears.double++; break;
        case 1: clears.single++; break;
    }

    // Generate warning
    warning = false;
    for(let y = 0; y < 24; y++) {
        for(let x = 1; x < 10; x++) {
            if(board[y][x] != 0) warning = true;
        }
    }
    if(warning) $('#game').addClass('warning');
    else $('#game').removeClass('warning');
}

var dasTimer = 10; dasTime = 0; dasTrigger = false; dasEnabled = false;
var holdBool = false;
var kick = -1, tspin = 0, warning = 0; sWarning = 0;

var $canvas, ctx;
var game = 'running';

function gameRestart() {
    restart();
    paused = true;
    clearInterval(interval);
    interval = undefined;
    gy = 1;
    $('#game').css('opacity', '0');
    game = 'running';
    $('#gameover').hide('drop', {easing: 'easeOutCubic', duration: 1000}, function() {
        $('#game').css('transform', `translateY(0px) rotate(0deg)`);
        $('#game').css('opacity', '1');
        $('#background').css('opacity', '0');
        paused = false;
    });

    clears = {
        single: 0,
        double: 0,
        triple: 0,
        quad: 0,
        tspin: 0,
        allclears: 0
    };
}

var clears = {
    single: 0,
    double: 0,
    triple: 0,
    quad: 0,
    tspin: 0,
    allclears: 0
};

var maxCombo = 0;
var maxb2b = 0;
var interval;
var gy = 1;
function gameOver() {
    game = 'over';
    playSound('topout')
    interval = setInterval(() => {
        $('#game').css('transform', `translateY(${gy}px) rotate(${gy / 50}deg)`);
        $('#game').css('opacity', (50 / gy));
        gy = Math.min(gy * 1.05 + 5, 1500);
        if(gy > 400) {
            $('#background').css('opacity', '0.5');
            $('#gameover').show('drop', {easing: 'easeOutCubic', duration: 1000});
        }
    }, 17);

    // set statistics
    let time = millisecondsElapsed;
    let pps = piecesPlaced / millisecondsElapsed * 1000;
    $('.score-box').text(Score.get());
    
    $('#s-level').text(Level.getLevel());
    
    $('#s-time-played').text(`${Math.floor(time / 60000)}:${('00' + Math.floor(time / 1000) % 60).slice(-2)}.${('000' + Math.floor(time % 1000)).slice(-3)}`);
    $('#s-pieces-placed').text(piecesPlaced);
    $('#s-pieces-per-second').text(pps.toFixed(2));
    $('#s-lines-cleared').text(lineClears);

    $('#s-singles').text(clears.single);
    $('#s-doubles').text(clears.double);
    $('#s-triples').text(clears.triple);
    $('#s-quads').text(clears.quad);
    $('#s-tspins').text(clears.tspin);
    $('#s-all-clears').text(clears.allclears);

    $('#s-max-combo').text(maxCombo + 1);
    $('#s-max-b2b').text(maxb2b);

}

var dropButtonPresses = 0, preventHD = 0;

const particles2 = [];
$(() => setInterval(() => {
    for(let p of particles2) {
        p.update();
        p.render();
    }
}), 17);

var sBounce = 0;

var garbageTimer = 0, garbageDelay = 3, garbageAppear = false;

function tick() {
    if(paused || game == 'over') return;

    garbageTimer++;
    if(!garbageAppear) {
        $('#garbage-progress .progressbar').css('height', `${garbageTimer / garbageDelay}%`);
        if((garbageTimer / garbageDelay) > 99.9) {
            garbageAppear = true;
            $('#garbage-progress .progressbar').css('animation', 'flash 200ms infinite');
            setTimeout(() => {
                addGarbage(1);
                garbageAppear = false;
                garbageTimer = 0;
                $('#garbage-progress .progressbar').css('animation', '');
                var interval = setInterval(() => {
                    bx += (Math.random() - Math.random() * 10);
                    by += (Math.random() - Math.random() * 10);
                }, 17);
                setTimeout(() => clearInterval(interval), 100);
                playSound('combobreak');
            }, 500);
        }
    }

    sWarning++;
    sBounce++;
    if(sBounce > 21) {
        sBounce = 0;
        //by -= 10;
    }
    if(sWarning >= 60 && warning && !critical) {
        sWarning = 0;
        playSound('warning');
    }
    if(sWarning >= 14 && critical) {
        sWarning = 0;
        playSound('critical');
    }
    if(warning) {
        for(let i = 0; i < 5; i++) {
            let e = new Shiny(particles2, 10);
            e.element.css('background-color', 'red');
            particles2.push(e);
        }
    }

    preventHD = Math.min(preventHD + 1, 5);

    dropTimer += Level.getLevel() * 2;
    if(dropTimer > dropRate) {
        if(canMoveTo(posX, posY + 1, rotation)) {
            posY++;
            tspin = 0;
        }
        dropTimer = 0;
    }

    /* Lock delay. */
    if(canMoveTo(posX, posY + 1, rotation)) {
        triggerLockDelay = false;
        lockTimer = 0;
    } else {
        triggerLockDelay = true;
    }
    if(triggerLockDelay) {
        lockTimer++;
        if(lockTimer > lockDelay) {
            newPiece();
            checkTetraLines(tspin);
            playSound('softdrop');
            kick = -1;
            triggerLockDelay = false;
            lockTimer = 0;
            dropButtonPresses = 0;
            lockDelay = 99999999930 - Level.getLevel();
            preventHD = 0;
        }
    }

    /* Handle keys */

    // DEBUG game over (q)
    if(pressedKeys.some(i => [81].includes(i))) {
        gameOver();
    }

    // LEFT
    if(pressedKeys.some(i => [37, 39].includes(i))) {
        if((!dasTrigger && !dasEnabled) || dasEnabled && dasTrigger) {
            if(pressedKeys.some(i => [37].includes(i))) {
                if(canMoveTo(posX - 1, posY, rotation)) {
                    posX--;
                    tspin = 0;
                    triggerLockDelay = false;
                    lockTimer = dropButtonPresses;
                    dropButtonPresses++;
                    if(!dasEnabled) playSound('move');
                } else {
                    bx -= 6;
                }
            }
            if(pressedKeys.some(i => [39].includes(i))) {
                if(canMoveTo(posX + 1, posY, rotation)) {
                    posX++;
                    tspin = 0;
                    triggerLockDelay = false;
                    lockTimer = dropButtonPresses;
                    dropButtonPresses++;
                    if(!dasEnabled) playSound('move');
                } else {
                    bx += 6;
                }
            }
        }
        dasTrigger = true;
    } else {
        dasEnabled = false;
        dasTrigger = false;
        dasTime = 0;
    }

    if(dasTrigger) {
        dasTime++;
        if(dasTime > DAS) {
            if(!dasEnabled) playSound('move');
            dasEnabled = true;
        }
    }

    // Hard drop
    if(pressedKeys.some(i => [32].includes(i)) && preventHD >= 5) {
        for(let i = 0; i < 40; i++)
        if(canMoveTo(posX, posY + 1, rotation)) {
            posY++;
            Score.add(2);
        }
        // checkTSpin(currentPiece, board, posX, posY, rotation, kick);
        newPiece();
        checkTetraLines(tspin);
        playSound('harddrop');
        by = 40;
        kick = -1;
        triggerLockDelay = false;
        lockTimer = 0;
        dropButtonPresses = 0;
        lockDelay = 99999999930 - Level.getLevel();
    }

    // Hold
    if(!holdBool && pressedKeys.some(i => [16].includes(i))) {
        tspin = 0;

        holdBool = true;
        playSound('hold');

        // No hold piece
        if(!holdPiece) {
            holdPiece = currentPiece;
            newPiece(true);
        }

        // With hold piece
        else {
            [currentPiece, holdPiece] = [holdPiece, currentPiece];
            rotation = 0;
            posY = 16;
            posX = 3;
        }

        triggerLockDelay = false;
        lockTimer = dropButtonPresses;
        dropButtonPresses++;
    }

    // Soft drop.
    if(pressedKeys.some(i => [83, 40].includes(i))) {
        if(canMoveTo(posX, posY + 1, rotation)) {
            for(let i = 0; i < SDF; i++) {
                if(canMoveTo(posX, posY + 1, rotation)) {
                    posY++;
                    Score.add(1);
                }
            }
            if(!canMoveTo(posX, posY + 1, rotation)) playSound('softdrop');
            Score.add(1);
        } else {
            by += 6;
        }
    }

    // Restart.
    if(pressedKeys.some(i => [82].includes(i))) {
        restart();
    }

    // Flip
    if(pressedKeys.some(i => [65].includes(i))) {
        [posX, posY, rotation, kick] = getKickTable(currentPiece, board, posX, posY, rotation, fmod((rotation + 2), 4));
        tspin = checkTSpin(currentPiece, board, posX, posY, rotation, kick);
        if(tspin) {
            playSound('spin');
        }
        triggerLockDelay = false;
        lockTimer = dropButtonPresses;
        dropButtonPresses++;
    }

    // Rotate clockwise
    if(pressedKeys.some(i => [38, 88].includes(i))) {
        [posX, posY, rotation, kick] = getKickTable(currentPiece, board, posX, posY, rotation, (rotation + 1) % 4);
        tspin = checkTSpin(currentPiece, board, posX, posY, rotation, kick);
        if(tspin) {
            boardRotate += 5;
            playSound('spin');
        }
        triggerLockDelay = false;
        lockTimer = dropButtonPresses;
        dropButtonPresses++;
    }

    // Rotate counterclockwise
    if(pressedKeys.some(i => [90].includes(i))) {
        [posX, posY, rotation, kick] = getKickTable(currentPiece, board, posX, posY, rotation, fmod((rotation - 1), 4));
        tspin = checkTSpin(currentPiece, board, posX, posY, rotation, kick);
        if(tspin) {
            boardRotate -= 5;
            playSound('spin');
        }
        triggerLockDelay = false;
        lockTimer = dropButtonPresses;
        dropButtonPresses++;
    }

    // Remove restart keypress.
    removeKey(82);
    // Remove rotation keypresses.
    removeKey(65);
    removeKey(38);
    removeKey(88);
    removeKey(90);
    // Remove hard drop keypress.
    removeKey(32);
    // Remove hold keypress.
    removeKey(16);

    /* Render */
    drawGrid(ctx);
    drawShadowPiece(ctx, posX, posY, currentPiece, rotation);
    drawPiece(ctx, posX, posY, currentPiece, rotation);
    drawPieces(ctx);
    drawHoldPiece();
    drawNext();
    drawBorder(ctx);
    getPPS();
    getTime();
    getLines();
    critical = false;
    if(warning) {
        drawWarning(ctx);
        critical = checkCritical(posX, posY, rotation, currentPiece);
    }
    particles.forEach(p => p.render(ctx));
    Score.tick(); // TODO move

}

var bx = 0, by = 0;
function boardBounce() {
    if(gy > 1) return;
    bx = bx / 1.2;
    by = by / 1.3;
    boardRotate /= 1.1;
    $('#game').css('transform', `translateX(${bx}px) translateY(${by}px) rotate(${boardRotate}deg)`);
}

$(() => {
    var $canvas = document.getElementById('main');
    ctx = $canvas.getContext('2d');

    window.addEventListener('keydown', keyDownEvent);
    window.addEventListener('keyup', keyUpEvent);
    window.setInterval(tick, 17);
    window.setInterval(boardBounce, 17);

    console.log('kagari isn\'t real');
    console.log('and even if she was');
    console.log('she would hate me');
});