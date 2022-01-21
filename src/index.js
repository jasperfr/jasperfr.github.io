$(() => {

    const didYouKnow = new Window('Welcome', [400, 240], false, `
    <h1 style="margin:8px 0;"><span style="font-family: 'Times New Roman', Times, serif;">Welcome to</span> <span style="font-weight: 800;">Jasper</span><span style="color:white;font-weight: 300;">FR</span></h1>
    <div style="display: flex;flex:1 1 auto;">
    <div style="display:flex;flex-direction:row;padding:20px;background:#ffe;width:70%;border:1px solid;border-color:#888 #fff #fff #888;">
        <img src="public/img/didyouknow.png" style="image-rendering: pixelated; transform:translate(-10px, -10px)" width=35 height=34>
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