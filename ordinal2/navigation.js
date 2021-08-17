$(() => {
    $('.navigation button').click(e => {
        let nav = $(e.target)[0].classList[0].split('-')[1];
        $('section').hide();
        $(`section.${nav}`).show();
    });
    $('section').hide();
    $('section.ordinal').show();
});
