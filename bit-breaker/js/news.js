const news = `This could be in the news.
Haha I am all out of ideas.
Have fun!
This is an early alpha release. Expect more content to happen sooner or later.
Oh god the javascript behind this is afwul.
@everyone
Why am I doing this? I have no idea.
I have no mouth yet I must scream
hey that's a good one put it in the news ticker
Also try Antimatter Dimensions!
According to all known laws of aviation, there is no way that a bee should be able to fly.
Keep on generating.
Where did I put all of my useless paperclips?
It is said that there exists an Antimatter Generator, which generates Antimatter from bytes.
yeah but what about 1.79e308 bytes
{exponent, mantissa}? lmao just divide the result by 1.79e308 and add it to another variable
e
help i'm supposed to be in the antimatter dimensions news ticker i have no idea how i ended up here aaaaaa
Click here for a free bit. Wait, sorry. It's gone now.
How many bits does it take to get to the center of a tootsie pop? A few bytes.`.split('\n');
news_x = 100;
window.setInterval(() => {
    news_x -= 0.03;
    $('.news h4').css('left', `${news_x}%`);
    if(news_x < -100) {
        news_x = 100;
        $('.news h4').text(news[Math.floor(Math.random() * news.length)]);
    }
}, 1);