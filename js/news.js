const news = `This could be in the news.
Haha I am all out of ideas.
This idea was stolen..um..inspired from the game Antimatter Dimensions.
Have fun!
This is an early alpha release. Expect more content to happen sooner or later.
Oh god the javascript behind this is afwul.
@everyone
Why am I doing this? I have no idea.
I have no mouth yet I must scream
hey that's a good one put it in the news ticker
i definitely did not steal this idea hahaha`.split('\n');
news_x = 100;
window.setInterval(() => {
    news_x -= 0.03;
    $('.news h4').css('left', `${news_x}%`);
    if(news_x < -100) {
        news_x = 100;
        $('.news h4').text(news[Math.floor(Math.random() * news.length)]);
    }
}, 1);