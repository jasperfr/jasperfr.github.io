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

// Returns [x, y, new rotation], or [0, 0, same rotation] if no kick has been found.
function getKickTable(piece, board, xpos, ypos, rotationFrom, rotationTo) {
    let key = `${piece=='I'?'I':'N'}${rotationFrom}-${rotationTo}`;
    let table = SRSX[key];
    let pieceMatrix = pieces[piece].grid[rotationTo];
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
        if(ok) return [xpos + tx, ypos - ty, rotationTo];
    }
    return [xpos, ypos, rotationFrom];
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
    $time.text(`${Math.floor(time / 60000)}:${Math.floor(time / 1000) % 60}.${Math.floor(time % 1000)}`);
}
function getLines() {
    let $lines = $('#lines');
    $lines.text(lineClears);
}

var board = JSON.parse(JSON.stringify(_BOARD_));

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
    bags = shuffle(BAG.slice()).concat(shuffle(BAG.slice()));
    posX = 3;
    posY = 0;
    holdPiece = null;
    currentPiece = getNextPiece();
    board = JSON.parse(JSON.stringify(_BOARD_));
    dropTimer = 0;
    rotation = 0;
    piecesPlaced = 0;
    millisecondsElapsed = 0.0001;
    lineClears = 0;
}

const s = 20; // piece size
function drawGrid(ctx) {
    ctx.clearRect(0, 0, 200, 400);
    ctx.strokeStyle = '#444';

    for(let x = 0; x < 10; x++) {
        drawLine(ctx, x * s, 0, x * s, 400);
    }
    for(let y = 0; y < 20; y++) {
        drawLine(ctx, 0, y * s, 200, y * s);
    }
}

// J L T O I S Z
fillStyles = ['#0000FF', '#FF8000', '#FF00FF', '#FFFF00', '#00FFFF', '#00FF00', '#FF0000']
function drawPieces(ctx) {
    for(let y = 0; y < 20; y++) {
        for(let x = 0; x < 20; x++) {
            let piece = board[y][x + 1];
            if(piece == 0) continue;
            ctx.fillStyle = fillStyles[piece - 1];
            ctx.fillRect(x * 20, y * 20, 20, 20);
        }
    }
}

function drawHoldPiece() {
    let ch = document.getElementById('hold');
    let ctxh = ch.getContext('2d');
    ctxh.clearRect(0, 0, 64, 64);

    if(!holdPiece) return;
    let p = pieces[holdPiece];
    ctxh.fillStyle = p.color;
    for(let _x = 0; _x < 4; _x++) {
        for(let _y = 0; _y < 4; _y++) {
            let current = p.grid[0][_y * 4 + _x];
            if (current == 1) {
                ctxh.fillRect(_x * 16, _y * 16, 16, 16);
            }
        }
    }
}

function drawNext() {
    let cn = document.getElementById('next');
    let ctxn = cn.getContext('2d');
    ctxn.clearRect(0, 0, 64, 320);

    for(let i = 0; i < 5; i++) {
        let offset = i * 64;
        let p = pieces[bags[i]];
        ctxn.fillStyle = p.color;
        for(let _x = 0; _x < 4; _x++) {
            for(let _y = 0; _y < 4; _y++) {
                let current = p.grid[0][_y * 4 + _x];
                if (current == 1) {
                    ctxn.fillRect(_x * 16, _y * 16 + offset, 16, 16);
                }
            }
        }
    }
}

var rotation = 0;
var posX = 3;
var posY = -1;
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
                ctx.fillRect((_x + x) * s, (_y + y) * s, s, s);
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
                ctx.fillRect((_x + x) * s, (_y + y + dy) * s, s, s);
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
        for(let i = 0; i < 15; i++) {
            let x = posX + i % 4;
            let y = posY + Math.floor(i / 4);
            if(board[y] == undefined) continue;
            if(matrix[i]) board[y][x + 1] = fill;
        }
    }

    posX = 3;
    posY = -1;
    rotation = 0;
    currentPiece = getNextPiece();
}

function drawLine(ctx, x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
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

var dropRate = 25, dropTimer = 0, lockDelay = 30000, lockTimer = 0, triggerLockDelay = false;

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

function checkTetraLines() {
    for(let y = 0; y < 20; y++) {
        let line = board[y];
        if(!line.some(i => i == 0)) {
            // remove this line and add an empty on top of the board
            board.splice(y, 1);
            board.unshift([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);
            lineClears++;
        }
    }
}

var dasTimer = 10; dasTime = 0; dasTrigger = false; dasEnabled = false;
var holdBool = false;

var $canvas, ctx;
function tick() {
    dropTimer++;
    if(dropTimer > dropRate) {
        if(canMoveTo(posX, posY + 1, rotation)) {
            posY++;
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
            triggerLockDelay = false;
            lockTimer = 0;
        }
    }

    /* Handle keys */

    // LEFT
    if(pressedKeys.some(i => [37, 39].includes(i))) {
        if((!dasTrigger && !dasEnabled) || dasEnabled && dasTrigger) {
            if(pressedKeys.some(i => [37].includes(i))) {
                if(canMoveTo(posX - 1, posY, rotation)) {
                    posX--;
                } else {
                    bx -= 6;
                }
            }
            if(pressedKeys.some(i => [39].includes(i))) {
                if(canMoveTo(posX + 1, posY, rotation)) {
                    posX++;
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
        if(dasTime > dasTimer) {
            dasEnabled = true;
        }
    }

    // Hard drop
    if(pressedKeys.some(i => [32].includes(i))) {
        for(let i = 0; i < 20; i++)
        if(canMoveTo(posX, posY + 1, rotation)) {
            posY++;
        }
        by = 40;
        newPiece();
    }

    // Hold
    if(!holdBool && pressedKeys.some(i => [16].includes(i))) {
        holdBool = true;
        // No hold piece
        if(!holdPiece) {
            holdPiece = currentPiece;
            newPiece(true);
        }

        // With hold piece
        else {
            [currentPiece, holdPiece] = [holdPiece, currentPiece];
            rotation = 0;
            posY = -1;
            posX = 3;
        }
    }

    if(pressedKeys.some(i => [83, 40].includes(i))) {
        if(canMoveTo(posX, posY + 1, rotation)) {
            posY++;
        } else {
            by += 6;
        }
    }

    if(pressedKeys.some(i => [82].includes(i))) {
        restart();
    }

    // Flip
    if(pressedKeys.some(i => [65].includes(i))) {
        switch(rotation) {
            case 0: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 0, 2); break;
            case 1: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 1, 3); break;
            case 2: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 2, 0); break;
            case 3: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 3, 1); break;
        }
    }

    // Rotate clockwise
    if(pressedKeys.some(i => [38, 88].includes(i))) {
        switch(rotation) {
            case 0: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 0, 1); break;
            case 1: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 1, 2); break;
            case 2: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 2, 3); break;
            case 3: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 3, 0); break;
        }
    }

    // Rotate counterclockwise
    if(pressedKeys.some(i => [90].includes(i))) {
        switch(rotation) {
            case 0: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 0, 3); break;
            case 1: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 1, 0); break;
            case 2: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 2, 1); break;
            case 3: [posX, posY, rotation] = getKickTable(currentPiece, board, posX, posY, 3, 2); break;
        }
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

    checkTetraLines();

    /* Render */
    drawGrid(ctx);
    drawShadowPiece(ctx, posX, posY, currentPiece, rotation);
    drawPiece(ctx, posX, posY, currentPiece, rotation);
    drawPieces(ctx);
    drawHoldPiece();
    drawNext();
    getPPS();
    getTime();
    getLines();
}

var bx = 0, by = 0;
function boardBounce() {
    bx = bx / 1.2;
    by = by / 1.15;
    $('#game').css('transform', `translateX(${bx}px) translateY(${by}px)`);
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