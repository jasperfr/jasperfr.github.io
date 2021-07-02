/* @region Helper functions */
function fmod(a, b) {
    return (a < 0 && b + a) || a % b;
}

function playSound(sound) {
    new Audio(`audio/${sound}.ogg`).play();
}

function show($el) {
    $el.show();
}

function hide($el) {
    $el.hide();
}

function shuffle(array) {
    var currentIndex = array.length, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function drawLine(ctx, x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

/* @region constants */
const s = 20; // piece size
const MARGIN = 2;
const pcs = ['J', 'L', 'T', 'O', 'I', 'S', 'Z', 'H'];
const fillStyles = ['#0000FF', '#FF8000', '#FF00FF', '#FFFF00', '#00FFFF', '#00FF00', '#FF0000', '#808080'];
const BAG = ['J', 'Z', 'O', 'S', 'L', 'T', 'I'];
const TICKSPEED = 17;
const _BOARD_ = (Array(40).fill(null).map(() => [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]).concat([Array(12).fill(1)]));
const spins = ['SINGLE', 'DOUBLE', 'TRIPLE', 'WHAT'];
const particles2 = [];
const pressedKeys = [];
const INTERVAL = 1000 / 60;

/* @region variables */
var DAS = 20;
var DCD = 0;
var SDF = 0;
var ARR = 0;
var rotation = 0;
var posX = 3;
var posY = 16;
var rotation = 0;
var currentPiece = getNextPiece();
var holdPiece = null;
var bags = shuffle(BAG.slice()).concat(shuffle(BAG.slice()));
var lineClears = 0;
var piecesPlaced = 0;
var millisecondsElapsed = 0.0001;
var paused = false;
var boardRotate = 0;
var $lineClear;
var $combo;
var $comboCount;
var $tSpinHeader;
var $tSpinCount;
var sprites = {};
var score = 0;
var board = JSON.parse(JSON.stringify(_BOARD_));
var dropRate = 200;
var dropTimer = 0;
var lockDelay = 30;
var lockTimer = 0;
var triggerLockDelay = false;
var combo = 0;
var b2b = 0;
var dasTimer = 100;
var dasTime = 0;
var dasTrigger = false;
var dasEnabled = false;
var holdBool = false;
var kick = -1;
var tspin = 0;
var warning = 0;
var sWarning = 0;
var $canvas;
var ctx;
var game = 'running';
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
var dropButtonPresses = 0;
var preventHD = 0;
var sBounce = 0;
var garbageTimer = 0;
var garbageDelay = 0;
var garbageAppear = false;
var critical = false;
var elapsedFrames = 0;
var elapsedTime = 0;
var deltaTime = 0;
var startTime = 0;
var startFrames = 0;
var bx = 0;
var by = 0;
var then = 0;
var replay = new Replay();

/* @region keyboard functions */
function keyDownEvent(e) {
    if(pressedKeys.indexOf(e.key) == -1) {
        pressedKeys.push(e.key);
        replay.addFrame(e.key, 1);
    }
}

function keyUpEvent(e) {
    let index = pressedKeys.indexOf(e.key);
    if(index != -1) {
        pressedKeys.splice(index, 1);
        replay.addFrame(e.key, 0);
    }
}

function removeKey(key) {
    let index = pressedKeys.indexOf(key);
    if(index != -1) {
        pressedKeys.splice(index, 1);
        replay.addFrame(key, 0);
    }
    index = pressedKeys.indexOf(key.toUpperCase());
    if(index != -1) {
        pressedKeys.splice(index, 1);
        replay.addFrame(key, 0);
    }
}

/* @region game functions */
function createAllClear() {
    let $element = $(`<h1 id="all-clear" style="z-index:9999;">PERFECT CLEAR!</h1>`);
    $('#game').prepend($element);
    setTimeout(() => {
        $element.remove();
    }, 3000);
    explode();
};

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

function checkTSpin(piece, board, x, y, r, kick) {
    if(piece !== 'T') return false;
    let pieceGrid = pieces['T']['grid'][r];

    let corners = {
        topLeft: board[y + 1][x + 1] != 0,
        topRight: board[y + 1][x + 3] != 0,
        bottomLeft: board[y + 3][x + 1] != 0,
        bottomRight: board[y + 3][x + 3] != 0
    }

    let facingCorners = 0;
    let behindCorners = 0;

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

    if(kick == 4) console.log('Exception: kick table is 4.')

    if(facingCorners + behindCorners >= 3) {
        if(facingCorners == 1 && kick != 4) {
            return 1;
        } else {
            return 2;
        }
    }

    return false;
}

function getNextPiece() {
    if(!bags) bags = shuffle(BAG.slice()).concat(shuffle(BAG.slice()));
    let piece = bags.shift();
    if(bags.length < 7) {
        bags = bags.concat(shuffle(BAG.slice()));
    }
    return piece;
}

function restart() {

    startTime += elapsedTime;
    elapsedFrames = 0;
    replay.reset();

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
    critical = false;
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
        $('#game').addClass('warning');
    }
    else {
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

function addGarbageLine(lines) {
    let bottom = board.pop();
    let arr = [1, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 1];
    arr[1 + Math.floor(Math.random() * 10)] = 0;
    for(let i = 0; i < lines; i++) {
        board.splice(0, 1);
        board.push(arr.slice());
    }
    board.push(bottom);
    posY--;
}

function removeAllKeys(keys) {
    for(let k of keys.split(',')) {
        removeKey(k);
    }
}

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
    const pps = piecesPlaced / (elapsedTime * 0.001);
    const m = Math.floor(elapsedTime / 60000);
    const s = ('00' + Math.floor(elapsedTime / 1000) % 60).slice(-2);
    const ms =('000' + Math.floor(elapsedTime % 1000)).slice(-3);

    $('.score-box').text(Score.get());
    $('#s-level').text(Level.getLevel());
    $('#s-time-played').text(`${m}:${s}.${ms}`);
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

function addGarbage() {
    if(garbageDelay != 0) {
        garbageTimer++;
        if(!garbageAppear) {
            $('#garbage-progress .progressbar').css('height', `${garbageTimer / garbageDelay}%`);
            if((garbageTimer / garbageDelay) > 99.9) {
                garbageAppear = true;
                $('#garbage-progress .progressbar').css('animation', 'flash 200ms infinite');
                setTimeout(() => {
                    addGarbageLine(1);
                    garbageAppear = false;
                    garbageTimer = 0;
                    $('#garbage-progress .progressbar').css('animation', '');
                    setTimeout(() => clearInterval(interval), 100);
                    playSound('combobreak');
                }, 500);
            }
        }
    }
}

/* @region event functions */
function warningEvent() {
    sWarning++;
    if(warning && sWarning > 20) {
        let e = new Shiny(particles2, 10);
        e.element.css('background-color', 'red');
        particles2.push(e);
    }
    if(sWarning >= 60 && warning && !critical) {
        sWarning = 0;
        playSound('warning');
    }
    if(sWarning >= 60 && critical) {
        sWarning = 0;
        playSound('critical');
    }
    if(warning) {
        $('#background').css('opacity', '1');
        $('#game').addClass('warning');
    }
    else {
        $('#background').css('opacity', '0');
        $('#game').removeClass('warning');
    }
}

function lockTimerEvent() {
    if(dropTimer > dropRate) {
        if(canMoveTo(posX, posY + 1, rotation)) {
            posY++;
            tspin = 0;
        }
        dropTimer = 0;
    }
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
}

function keyHandleEvent() {
    function isKeyDown(keyMap) {
        const map = keyMap.split(',');
        return pressedKeys.some(i =>
            map.includes(i) ||
            map.map(m => m.toUpperCase()).includes(i)
        );
    }

    const keys = settings.boundKeys;

    // LEFT-RIGHT (DAS)
    arrTimer = dasEnabled ? arrTimer + 1 : 0;
    let antiWhile = 0;
    while(arrTimer > ARR && antiWhile < 20) {
        arrTimer -= ARR;
        antiWhile++;
        if((isKeyDown(keys.right) || isKeyDown(keys.left)) && (dasEnabled && dasTrigger)) {
            if(isKeyDown(keys.left) && canMoveTo(posX - 1, posY, rotation)) { posX--; tspin = 0; }
            if(isKeyDown(keys.right) && canMoveTo(posX + 1, posY, rotation)) { posX++; tspin = 0; }
        }
    };

    // LEFT
    if(isKeyDown(keys.right) || isKeyDown(keys.left)) {
        if(!dasTrigger && !dasEnabled) {
            if(pressedKeys.some(i => keys.left.split(',').includes(i))) {
                if(canMoveTo(posX - 1, posY, rotation)) {
                    posX--;
                    tspin = 0;
                    if(!dasEnabled) playSound('move');
                }
            }
            if(pressedKeys.some(i => keys.right.split(',').includes(i))) {
                if(canMoveTo(posX + 1, posY, rotation)) {
                    posX++;
                    tspin = 0;
                    if(!dasEnabled) playSound('move');
                }
            }
        }
        if(!dasTrigger) {
            dasTrigger = true;
        }
    } else {
        dasEnabled = false;
        dasTrigger = false;
        dasTime = 0;
    }

    if(dasTrigger) {
        dasTime++;
        if(dasTime > (DAS) && !dasEnabled) {
            dasEnabled = true;
        }
    }

    // Hard drop
    if(pressedKeys.some(i => keys.hardDrop.split(',').includes(i)) && preventHD >= 5) {
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
    if(!holdBool && isKeyDown(keys.hold)) {
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
    if(isKeyDown(keys.softDrop)) {
        if(canMoveTo(posX, posY + 1, rotation)) {
            if(SDF > 40) {
                while(canMoveTo(posX, posY + 1, rotation)) {
                    posY++;
                    Score.add(1);
                }
            } else {
                for(let i = 0; i < SDF / 10; i++) {
                    if(canMoveTo(posX, posY + 1, rotation)) {
                        posY++;
                        Score.add(1);
                    }
                }
            }

            if(!canMoveTo(posX, posY + 1, rotation)) playSound('softdrop');
            Score.add(1);
        } else {
            by += 6;
        }
    }

    // Restart.
    if(isKeyDown('r')) {
        restart();
    }

    // Flip
    if(isKeyDown(keys.rotate180)) {
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
    if(isKeyDown(keys.rotateCW)) {
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
    if(isKeyDown(keys.rotateCCW)) {
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
    removeKey('r');
    // Remove rotation keypresses.
    removeAllKeys(keys.rotateCW);
    removeAllKeys(keys.rotateCCW);
    removeAllKeys(keys.rotate180);
    // Remove hard drop keypress.
    removeAllKeys(keys.hardDrop);
    // Remove hold keypress.
    removeAllKeys(keys.hold);
}

function drawEvent() {
    const piece = pieces[currentPiece];

    // Draw the background
    ctx.clearRect(0, 0, 204, 484);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 80, 204, 484);

    // Draw the grid
    ctx.strokeStyle = '#444';
    for(let x = 0; x < 10; x++) drawLine(ctx, 2 + x * s, 82, 2 + x * s, 484);
    for(let y = 0; y < 20; y++) drawLine(ctx, 2, 82 + y * s, 204, 82 + y  * s);

    // Draw the border
    ctx.strokeStyle = warning ? '#ff0000' : '#ffffff';
    drawLine(ctx, 0.5, 80, 0.5, 484);
    drawLine(ctx, 1.5, 80, 1.5, 484);

    drawLine(ctx, 202.5, 80, 202.5, 484);
    drawLine(ctx, 203.5, 80, 203.5, 484);

    drawLine(ctx, 0, 482.5, 204, 482.5);
    drawLine(ctx, 0, 483.5, 204, 483.5);

    // Draw the shadow piece
    ctx.fillStyle = '#808080';
    let dy = 0;
    do { dy++ } while (canMoveTo(posX, posY + dy, rotation));
    dy--;
    for(let _x = 0; _x < 4; _x++) {
        for(let _y = 0; _y < 4; _y++) {
            let current = piece.grid[rotation][_y * 4 + _x];
            if (current == 1) {
                ctx.drawImage(sprites.G, MARGIN + (_x + posX) * s, MARGIN + (_y + posY + dy - 20) * s + 80);
            }
        }
    }

    // Draw the current piece
    ctx.fillStyle = '#808080';
    for(let _x = 0; _x < 4; _x++) {
        for(let _y = 0; _y < 4; _y++) {
            let current = piece.grid[rotation][_y * 4 + _x];
            if (current == 1) {
                ctx.drawImage(sprites[currentPiece], MARGIN + (_x + posX) * s, MARGIN + (_y + posY - 20) * s + 80);
            }
        }
    }

    // Draw the board pieces
    for(let y = 15; y < 40; y++) {
        for(let x = 0; x < 10; x++) {
            let piece = board[y][x + 1];
            if(piece == 0) continue;
            let px = pcs[piece - 1];
            if(px == undefined) continue;
            ctx.drawImage(sprites[px], MARGIN + x * s, MARGIN + (y - 20) * s + 80);
        }
    }

    // Draw the hold piece
    const ch = document.getElementById('hold');
    const ctxh = ch.getContext('2d');
    ctxh.clearRect(0, 0, 200, 150);
    if(holdPiece) {
        const p = pieces[holdPiece];
        const sprite = holdBool ? sprites['H'] : sprites[holdPiece];
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
    
    // Draw the next queue
    const cn = document.getElementById('next');
    const ctxn = cn.getContext('2d');
    ctxn.clearRect(0, 0, 100, 320);

    for(let i = 0; i < 5; i++) {
        const p = pieces[bags[i]];
        const pc = bags[i];
        const sprite = sprites[pc];
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

    // Draw the warning (X) pieces.
    if(warning) {
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
        critical = checkCritical(posX, posY, rotation, currentPiece);
    }
    particles.forEach(p => p.render(ctx));

    // Render the score GUI.
    Score.tick();
}

function statisticsEvent() {
    // Set pieces per second
    const pps = piecesPlaced / (elapsedTime * 0.001);
    $('#pieces-per-second').text(pps.toFixed(2));

    // set time played
    const m = Math.floor(elapsedTime / 60000);
    const s = ('00' + Math.floor(elapsedTime / 1000) % 60).slice(-2);
    const ms =('000' + Math.floor(elapsedTime % 1000)).slice(-3);
    $('#time').text(`${m}:${s}.${ms}`);

    // set line clears
    $('#lines').text(lineClears);
}

function step(now) {

    requestAnimationFrame(step);

    if(game == 'over') {
        particles2.forEach(p => p.delete());
        return;
    }

    let elapsed = now - then;
    if(elapsed > INTERVAL) {
        then = now - (elapsed % INTERVAL);

        elapsedFrames++;
        deltaTime = now * 0.001 - deltaTime;
        elapsedTime = now - startTime;
    
        preventHD = Math.min(preventHD + 1, 5);
        dropTimer += Level.getLevel() * 2;
    
        addGarbage();
        warningEvent();
        lockTimerEvent();
        keyHandleEvent();
        drawEvent();
        statisticsEvent();

        $('#debugger').text(`
            FRAME: ${elapsedFrames},
            START FRAME: ${startFrames}
        `);
    }
}
requestAnimationFrame(step);

$(() => {
    var $canvas = document.getElementById('main');
    ctx = $canvas.getContext('2d');
    window.addEventListener('keydown', keyDownEvent);
    window.addEventListener('keyup', keyUpEvent);
    
    $lineClear = $('#line-clear');
    $combo = $('#combo');
    $comboCount = $('#combo-count');
    $tSpinHeader = $('#tspin');
    $tSpinCount = $('#tspin-count');

    hide($lineClear);
    hide($combo);
    hide($tSpinHeader);
    hide($tSpinCount);

    $('#garb').on('input', function() {
        let delay = parseInt($('#garb').val());
        if(delay == 0) {
            garbageDelay = 0;
            $('#garb-val').text('OFF');
        } else {
            garbageDelay = 11 - delay;
            $('#garb-val').text($('#garb').val());
        }
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
    
    setInterval(() => {
        for(let p of particles2) {
            p.update();
            p.render();
        }
    }, 17);
});