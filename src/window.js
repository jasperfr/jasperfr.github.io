class Window {
    constructor(name, size, resizable, content, css = {}, maximizeable = false) {
        this.__id = Date.now().toString();
        this.hWnd = undefined;
        this.name = name;
        this.size = { width: size[0], height: size[1] };
        this.content = content;
        this.enabled = false;
        this.resizable = resizable;
        this.css = css;
        this.maximizeable = maximizeable;
        this.maximized = false;
    }

    maximize() {
        if(!this.maximizeable) return;
        this.maximized ^= true;
        this.hWnd.css('width', this.maximized ? '100vw' : this.size.width + 'px');
        this.hWnd.css('height', this.maximized ? '100vh' : this.size.height + 'px');
        this.hWnd.css('left', this.maximized ? '0' : '10px');
        this.hWnd.css('top', this.maximized ? '0' : '10px');
        if(this.maximized) this.hWnd.find('button.maximize').addClass('maximized');
        else this.hWnd.find('button.maximize').removeClass('maximized');
    }

    open() {
        if(this.enabled) return;
        this.enabled = true;
        this.__id = Date.now().toString();
        this.hWnd = $(`
        <section class="window" id="${this.__id}" style="width:${this.size.width}px; height:${this.size.height}px"}>
            <div class="draggable-handle">
                <h3>${this.name}</h3>
                ${this.maximizeable ? `<button class="maximize" onclick=Window.maximize('${this.__id}')>` : ''}
                <button class="close" onclick=Window.close('${this.__id}')>
            </div>
            <div class="window-content">
                ${this.content}
            </div>
        </section>`);
        $(this.hWnd).find('.window-content').css(this.css);
        $(document.body).append(this.hWnd);
        $(this.hWnd).draggable({'handle': '.draggable-handle', 'stack': '.window', 'containment': 'body', start: function() {
            $('.window').find('.draggable-handle').css({'background': 'linear-gradient(to right, dimgray, darkgray)'});
            $(this).find('.draggable-handle').css({'background': 'linear-gradient(to right, darkblue, cornflowerblue)'});
        }});
        if(this.resizable) {
            this.hWnd.resizable();
        }

        this.hWnd.hide().slideDown();
        $('.window').find('.draggable-handle').css({'background': 'linear-gradient(to right, dimgray, darkgray)'});
        this.hWnd.find('.draggable-handle').css({'background': 'linear-gradient(to right, darkblue, cornflowerblue)'});
        Window.activeWindows.push(this);
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

Window.maximize = function(id) {
    const window = Window.activeWindows.filter(w => w.__id == id)[0];
    if(window) window.maximize();
}