Math.__proto__.fmod = function(a, b) {
    return (a < 0 && b + a) || a % b;
}  

const TICKSPEED = 16.67; // 60 FPS

const MAP = ['?', 'Z', 'L', 'O', 'S', 'I', 'J', 'T'];
const Colors = ['#ffffff', '#ff0000', '#ff8000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'];

const Board = [
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
    [1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 6, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const Pieces = {
    J: [
        [[0, 0, 0, 0],[1, 0, 0, 0],[1, 1, 1, 0],[0, 0, 0, 0]],
        [[0, 0, 0, 0],[0, 1, 1, 0],[0, 1, 0, 0],[0, 1, 0, 0]],
        [[0, 0, 0, 0],[0, 0, 0, 0],[1, 1, 1, 0],[0, 0, 1, 0]],
        [[0, 0, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0],[1, 1, 0, 0]]
    ],
    L: [
        [[0, 0, 0, 0],[0, 0, 1, 0],[1, 1, 1, 0],[0, 0, 0, 0]],
        [[0, 0, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 1, 0]],
        [[0, 0, 0, 0],[0, 0, 0, 0],[1, 1, 1, 0],[1, 0, 0, 0]],
        [[0, 0, 0, 0],[1, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0]]
    ],
    T: [
        [[0, 0, 0, 0],[0, 1, 0, 0],[1, 1, 1, 0],[0, 0, 0, 0]],
        [[0, 0, 0, 0],[0, 1, 0, 0],[0, 1, 1, 0],[0, 1, 0, 0]],
        [[0, 0, 0, 0],[0, 0, 0, 0],[1, 1, 1, 0],[0, 1, 0, 0]],
        [[0, 0, 0, 0],[0, 1, 0, 0],[1, 1, 0, 0],[0, 1, 0, 0]]
    ],
    O: [
        [[0, 0, 0, 0],[0, 1, 1, 0],[0, 1, 1, 0],[0, 1, 1, 0]],
        [[0, 0, 0, 0],[0, 1, 1, 0],[0, 1, 1, 0],[0, 1, 1, 0]],
        [[0, 0, 0, 0],[0, 1, 1, 0],[0, 1, 1, 0],[0, 1, 1, 0]],
        [[0, 0, 0, 0],[0, 1, 1, 0],[0, 1, 1, 0],[0, 1, 1, 0]]
    ],
    I: [
        [[0, 0, 0, 0],[1, 1, 1, 1],[0, 0, 0, 0],[0, 0, 0, 0]],
        [[0, 0, 1, 0],[0, 0, 1, 0],[0, 0, 1, 0],[0, 0, 1, 0]],
        [[0, 0, 0, 0],[0, 0, 0, 0],[1, 1, 1, 1],[0, 0, 0, 0]],
        [[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0],[0, 1, 0, 0]]
    ],
    S: [
        [[0, 0, 0, 0],[0, 1, 1, 0],[1, 1, 0, 0],[0, 0, 0, 0]],
        [[0, 0, 0, 0],[0, 1, 0, 0],[0, 1, 1, 0],[0, 0, 1, 0]],
        [[0, 0, 0, 0],[0, 0, 0, 0],[0, 1, 1, 0],[1, 1, 0, 0]],
        [[0, 0, 0, 0],[1, 0, 0, 0],[1, 1, 0, 0],[0, 1, 0, 0]],
    ],
    Z: [
        [[0, 0, 0, 0],[1, 1, 0, 0],[0, 1, 1, 0],[0, 0, 0, 0]],
        [[0, 0, 0, 0],[0, 0, 1, 0],[0, 1, 1, 0],[0, 1, 0, 0]],
        [[0, 0, 0, 0],[0, 0, 0, 0],[1, 1, 0, 0],[0, 1, 1, 0]],
        [[0, 0, 0, 0],[0, 1, 0, 0],[1, 1, 0, 0],[1, 0, 0, 0]],
    ]
};

const GameState = {
    COUNTDOWN: 'countdown',
    ACTIVE: 'active',
    PAUSED: 'paused',
    GAMEOVER: 'gameover'
};

const GameMode = {
    SPRINT: 'sprint',
    BLITZ: 'blitz'
};

const KickTable = {
    SRSX: {
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
    },

    getKickTable: function(piece, board, rr) {
        const { p, x, y, r } = piece;
        const key = `${p === 'I' ? 'I' : 'N'}${r}-${rr}`;
        const table = this.SRSX[key];
        const pmat = Pieces[p][r];
        for(let q = 0; q < table.length; q++) {
            let [tx, ty] = table[q];
            let ok = true;
            for(let yy = 0; yy < 4; yy++) {
                for(let xx = 0; xx < 4; xx++) {
                    let xxx = x + xx + tx + 1;
                    let yyy = y + yy - ty;
                    if(board[yyy] === undefined) continue;
                    if(board[yyy][xxx] != 0 && pmat[yy][xx] == 1) ok = false;
                }
            }
            if(ok) return [x + tx, y - ty, rr, q];
        }
        return [x, y, r, -1];
    },

    getMovement: function(piece, board, xto, yto) {
        const { p, x, y, r } = piece;
        const pmat = Pieces[p][r];
        for(let i = 0; i <= 15; i++) {
            let xx = x + i % 4;
            let yy = y + Math.floor(i / 4);
            if(board[yy][xx + 1] != 0 && pmat[yy][xx] == 1) return [x, y];
        }
        return [xto, yto];
    }
}

const Renderer = {
    context: undefined,
    width: 0,
    height: 0,
    clear: function() {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    drawLine: function(x0, y0, x1, y1) {
        this.context.beginPath();
        this.context.moveTo(x0 - 0.5, y0 - 0.5);
        this.context.lineTo(x1 - 0.5, y1 - 0.5);
        this.context.stroke();
    },
    drawGrid: function() {
        for(let x = 0; x < 10; x++) {
            this.drawLine(x * 20, 0, x * 20, this.height);
        }
        for(let y = 0; y < 20; y++) {
            this.drawLine(0, y * 20, this.width, y * 20);
        }
    },
    drawPiece: function(piece) {
        let { p, x, y, r } = piece;
        this.context.fillStyle = Colors[MAP.indexOf(p)];
        let grid = Pieces[p][r];
        for(let yy = 0; yy < 4; yy++) {
            for(let xx = 0; xx < 4; xx++) {
                let piece = grid[yy][xx];
                if(piece == 0) continue;
                this.context.fillRect((x + xx) * 20, (y + yy - 20) * 20, 20, 20);
            }
        }
    },
    drawBoard: function(board) {
        for(let y = 20; y < 40; y++) {
            for(let x = 1; x < 10; x++) {
                let piece = board[y][x];
                if(piece == 0) continue;
                this.context.fillStyle = Colors[piece];
                this.context.fillRect(x * 20 - 20, (y - 20) * 20, 20, 20);
            }
        }
    },
    initialize: function() {
        let canvas = document.getElementById('main');
        this.context = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }
};

const KeyboardHandler = {
    pressedKeys: [],
    onKeyDown: function(key) {
        if(this.pressedKeys.indexOf(key.keyCode) == -1) {
            this.pressedKeys.push(key.keyCode);
        }
    },
    onKeyUp: function(key) {
        let index = this.pressedKeys.indexOf(key.keyCode);
        if(index != -1) {
            this.pressedKeys.splice(index, 1);
        }
    },
    removeKey: function(key) {
        let index = this.pressedKeys.indexOf(key);
        if(index != -1) {
            this.pressedKeys.splice(index, 1);
        }
    },
    getKeys: function() {
        return this.pressedKeys.slice();
    },
    isKeyPressed: function(keyCode) {
        return this.pressedKeys.indexOf(keyCode) !== -1;
    },
    initialize: function() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
}

const Game = {
    state: GameState.ACTIVE,
    gamemode: GameMode.SPRINT,
    config: {
        keys: {
            left: [],
            right: [],
            softDrop: [],
            hardDrop: [],
            hold: [],
            rotateClockwise: [],
            rotateCounterClockwise: []
        },
        handling: {
            DAS: 10,
            ARR: 0,
            SDF: 4
        },
        effects: {
            boardBounciness: 100,
            rotateOnSpin: true
        }
    },
    effects: {
        board: {
            rotation: 0,
            deltaX: 0,
            deltaY: 0,
        }
    },
    statistics: {
        lineClears: 0,
        piecesPlaced: 0,
        level: 0,
        singles: 0,
        doubles: 0,
        triples: 0,
        quads: 0,
        pps: 0
    },

    board: null,
    piece: {
        p: 'T',
        x: 0,
        y: 23,
        r: 0
    },

    dasLeft: false,
    dasRight: false,

    initialize: function() {
        this.board = JSON.parse(JSON.stringify(Board));
        setInterval(() => this.tick(), TICKSPEED);
    },

    handleKeyboardEvents: function() {
        // Movement (right)
        if(KeyboardHandler.isKeyPressed(68)) {
            if(!this.dasRight) {
                [this.piece.x, this.piece.y] = KickTable.getMovement(this.piece, this.board, this.piece.x + 1, this.piece.y);
            }
            this.dasRight = true;
        } else {
            this.dasRight = false;
        }

        // Movement (left)
        if(KeyboardHandler.isKeyPressed(65)) {
            if(!this.dasLeft) this.piece.x--;
            this.dasLeft = true;
        } else {
            this.dasLeft = false;
        }

        // Movement (rotate CW)
        if(KeyboardHandler.isKeyPressed(39)) {
            let [x, y, r, q] = KickTable.getKickTable(this.piece, this.board, Math.fmod(this.piece.r + 1, 4));
            this.piece.x = x;
            this.piece.y = y;
            this.piece.r = r;
            KeyboardHandler.removeKey(39);
        }

        // Movement (rotate CCW)
        if(KeyboardHandler.isKeyPressed(37)) {
            let [x, y, r, q] = KickTable.getKickTable(this.piece, this.board, Math.fmod(this.piece.r - 1, 4));
            this.piece.x = x;
            this.piece.y = y;
            this.piece.r = r;
            KeyboardHandler.removeKey(37);
        }
    },

    render: function() {
        Renderer.clear();
        Renderer.drawBoard(this.board);
        Renderer.drawPiece(this.piece);
        Renderer.drawGrid();
    },

    tick: function() {
        this.handleKeyboardEvents();
        this.render();
    }
}

$(() => {
    Renderer.initialize();
    Game.initialize();
    KeyboardHandler.initialize();
})