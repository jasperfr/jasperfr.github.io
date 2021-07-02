class Replay {
    constructor() {
        this.frames = [];
    }
    
    addFrame(key, keydown) {
        this.frames.push(getBoardState(key, keydown));
    }

    reset() {
        this.frames = [];
    }

    toString() {
        return JSON.stringify(this.frames);
    }
}

function getBoardState(key, keyDown = true) {
    return {
        _frame: elapsedFrames,
        _time: elapsedTime,
        piece: [currentPiece, posX, posY, rotation],
        hold: [holdPiece, holdBool],
        score: Score.get(),
        level: [Level.getLevel(), Level.getPercentile()],
        keyDown: keyDown ? key : 0,
        keyUp: !keyDown ? key : 0
    }
}

// boardState: JSON.stringify(board).replace(/[,\[\]]/g, '',