const messages = [
    "oh look a news ticker this is real original",
    "this could be in the news.",
    "I'm out of ideas for the news ticker.",
    "Also try out the original game.",
    "You can't just blow a black hole into the surface of Infinty",
    "help how do git push commit",
    "Arrays start at 0."
]
var newsPosition = 110;

$(() => {
    setInterval(function() {
        newsPosition -= 0.05;
        $('.news-ticker > p').css('left', newsPosition + '%');
        if(newsPosition < - 100) {
            newsPosition = 110;
            $('.news-ticker > p').text(messages[Math.floor(Math.random() * messages.length)]);
        }
    }, 10);
})