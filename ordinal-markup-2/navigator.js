$(() => {
    $('[class^=section-]').hide();
});

function navigate(to) {
    $('[class^=section-]').hide();
    $(`.section-${to}`).show();
}
