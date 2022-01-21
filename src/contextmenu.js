$(() => {
    $.contextMenu({
        selector: '.desktop-icon',
        callback: function (key, options) {
            console.log(key);
        },
        items: {
            'open': { name: 'Open' },
            'newtab': { name: 'Open in New Tab' },
            'newwindow': { name: 'Open in New Window' },
            'sep1': '--------',
            'copy': { name: 'Copy Link' },
            'sep2': '--------',
            'git': { name: 'Source Code (git)' },
            'about': { name: 'About...' }
        }
    })
});

function openTab(url) {
    window.open(url, '_blank').focus();
}