const news = [
    'I need to add news messages.',
    'You\'re almost there!',
    'Also try out Antimatter Dimensions!',
    'Hello there.',
    'new phone who dis',
    'AAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'Please do not disable the news.',
    'help i\'m stuck making news tickers in a factory',
    'Infinity is a long way to go.',
    '"Okay, give me news ideas." - Jaspertje1',
    'help me',
    'Antimatter? What is that? We only have points here.',
    'can I have antimatter? "is points okay"',
    'No, the devloper is not Finnish.',
    'Click this to unlock a secret achievement.'
];

let newsX = 100;
function updateNews() {
    $('div.news-ticker span').css('transform', `translateX(${newsX}vw)`);
    newsX -= 0.05;
    if(newsX < -100) {
        newsX = 100;
        $('div.news-ticker span').text(news[Math.floor(Math.random() * news.length)]);
    }
    requestAnimationFrame(updateNews);
}

$(() => {
    $('div.news-ticker span').text(news[Math.floor(Math.random() * news.length)]);

    $('div.news-ticker span').click(function() {
        const newsText = $('div.news-ticker span').text();
        if(newsText == 'Click this to unlock a secret achievement.') {
            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank').focus();
        }
    });

    requestAnimationFrame(updateNews);
});
