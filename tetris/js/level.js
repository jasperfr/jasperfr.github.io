const Level = (() => {

    var $level, $progressBar, level, lines, linesRequired, _audio;

    const refresh = function() {
        if(lines >= linesRequired) {
            lines -= linesRequired;
            level++;
            let $el = $(`<h2 class="level">${level}</h2>`);
            $('#main-area').prepend($el);
            setTimeout(() => $el.remove(), 500);
            _audio.play();
        }
        linesRequired = 5 + level * 2;
        let percentage = lines / linesRequired * 100;
        $progressBar.css('height', percentage + '%');
        console.log(percentage);
        $level.text(level);
    }

    const addLine = function(line) {
        lines += line;
        refresh();
    }
    
    const restart = function() {
        lines = 0;
        level = 1;
        refresh();
    }

    const getLevel = function() {
        return level;
    }

    const init = function() {
        $level = $('#level');
        $progressBar = $('#line-progress .progressbar');
        level = 1;
        lines = 0;
        linesRequired = 10;
        _audio = new Audio('audio/levelup.ogg');
        refresh();
    }

    return {
        init: init,
        add: addLine,
        restart: restart,
        getLevel: getLevel
    }

})();

$(() => Level.init());
