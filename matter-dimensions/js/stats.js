var statistics, $statistics, time;

$(() => {
    $statistics = {
        matterProduced: $('#stat-matter-produced'),
        dimShifts: $('#stat-dimension-shifts'),
        timeFolds: $('#stat-time-folds'),
        blackHoles: $('#stat-black-holes'),
        blackHoleTickspeeds: $('#stat-black-hole-tickspeed-upgrades'),
        infinities: $('#stat-infinities'),
        fastestInfinity: $('#stat-fastest-infinity'),
        infinityTime: $('#stat-infinity-time'),
        totalTime: $('#stat-total-time')
    };

    statistics = {
        matterProduced: 0,
        dimShifts: 0,
        timeFolds: 0,
        blackHoles: 0,
        blackHoleTickspeeds: 0,
        infinities: 0,
        fastestInfinity: 0,
        infinityTime: 0,
        totalTime: 0
    };

    setInterval(() => {

        // Update total matter produced
        $statistics.matterProduced.text(totalMatterProduced.toMixedScientific());

        // Update total time played
        statistics.totalTime += 33 / 1000;
        time = Math.floor(statistics.totalTime);
        $statistics.totalTime.text(`${Math.floor(time / (3600 * 24))} days, ${(Math.floor(time / 3600 % 24).toString())}:${(Math.floor(time / 60) % 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`);

        // Update time in infinity
        statistics.infinityTime += 33 / 1000;
        time = Math.floor(statistics.totalTime);
        $statistics.infinityTime.text(`${Math.floor(time / (3600 * 24))} days, ${(Math.floor(time / 3600 % 24).toString())}:${(Math.floor(time / 60) % 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`);

    }, 33);

});