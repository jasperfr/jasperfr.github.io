const Score = (() => {

    var $score, $trailing, trailingLength, score, scoreToAdd;

    const getScore = function() {
        return Math.round(score + scoreToAdd);
    }

    const setScore = function(s) {
        score = s;
        scoreToAdd = 0;
    }

    const addScore = function(score) {
        scoreToAdd += score * Level.getLevel();
    }

    const tick = function() {
        let delta = scoreToAdd / 20;
        score += delta;
        scoreToAdd -= delta;
        let log10 = Math.floor(Math.log10(score));
        trailingLength = Math.min(9 - log10, 9);
        $score.text(Math.round(score));
        $trailing.text(Array(trailingLength).fill(0).join(''));
    }

    const init = function() {
        $score = $('#score-box .score');
        $trailing = $('#score-box .zeroes');
        score = 0;
        scoreToAdd = 0;
        trailingLength = 10;
    }

    return {
        init: init,
        add: addScore,
        set: setScore,
        get: getScore,
        tick: tick
    }

})();

$(() => Score.init());
