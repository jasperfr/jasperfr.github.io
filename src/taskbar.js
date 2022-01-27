class Taskbar {
    constructor(id, name) {
        this.__id = id;
        this.name = name;
        this.hWnd = $(`<button class="taskbar-button" onclick="Taskbar.toggle(${this.__id})">${this.name}</button>`);
        Taskbar.activeButtons.push(this);
        $('#taskbar').append(this.hWnd);
    }

    remove() {

    }
}

Taskbar.activeButtons = [];
