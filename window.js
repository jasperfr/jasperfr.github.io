class Window {
    constructor(name, size, resizable, content, css = {}) {
        this.__id = Date.now().toString();
        this.hWnd = undefined;
        this.name = name;
        this.size = { width: size[0], height: size[1] };
        this.content = content;
        this.enabled = false;
        this.resizable = resizable;
        this.css = css;
    }

    open() {
        if(this.enabled) return;
        this.enabled = true;
        Window.activeWindows.push(this);
        this.hWnd = $(`
        <section class="window" style="width:${this.size.width}px; height:${this.size.height}px"}>
            <div class="draggable-handle">
                <h3>${this.name}</h3>
                <button class="close" onClick=Window.close('${this.__id}')>
            </div>
            <div class="window-content">
                ${this.content}
            </div>
        </section>`);
        $(this.hWnd).find('.window-content').css(this.css);
        $(document.body).append(this.hWnd);
        $(this.hWnd).draggable({'handle': '.draggable-handle', 'stack': '.window', start: function() {
            $('.window').find('.draggable-handle').css({'background': '#888'});
            $(this).find('.draggable-handle').css({'background': '#008'});
        }});
        if(this.resizable) {
            this.hWnd.resizable();
        }

        this.hWnd.hide().slideDown();
        $('.window').find('.draggable-handle').css({'background': '#888'});
        this.hWnd.find('.draggable-handle').css({'background': '#008'});
    }

    close() {
        this.hWnd.slideUp(function() {
            this.remove();
        });
        delete Window.activeWindows[Window.activeWindows.indexOf(this)];
        this.enabled = false;
    }
}

Window.activeWindows = [];

Window.open = function(window) {
    window.open();
}

Window.close = function(id) {
    const window = Window.activeWindows.filter(w => w.__id == id)[0];
    if(window) window.close();
}

$(() => {
    const didYouKnow = new Window('Welcome', [400, 240], false, `
    <h1 style="margin:8px 0;"><span style="font-family: 'Times New Roman', Times, serif;">Welcome to</span> <span style="font-weight: 800;">Jasper</span><span style="color:white;font-weight: 300;">FR</span></h1>
    <div style="display: flex;flex:1 1 auto;">
    <div style="display:flex;flex-direction:row;padding:20px;background:#ffe;width:70%;border:1px solid;border-color:#888 #fff #fff #888;">
        <img src="didyouknow.png" style="image-rendering: pixelated; transform:translate(-10px, -10px)" width=35 height=34>
        <div>
            <h5 style="margin: 0;">Did you know...</h5>
            <p style="font-size: 8pt;">There are a couple of easter eggs on this website. Can you find them all?</p>
        </div>
    </div>
    <div style="width:120px;">
        <button onclick="Window.open(ABOUT)">About <u>M</u>e</button>
        <button onclick="Window.open(CONTACT)"><u>C</u>ontact</button>
        <hr style="margin: 40px 8px 8px 8px; width: 100%;"/>
        <button>Close</button>
    </div>
    `);

    Window.open(didYouKnow);
});
