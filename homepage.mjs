import { Application, Assets, Sprite, Text, TextStyle } from "./pixi.mjs";
import { startLevel } from "./game.mjs"

const app = new Application();

let title;
let startTxt;

(async () =>
{
    await app.init({ background: '#a8acaa', resizeTo: document.getElementById("hi")});
    document.body.insertBefore(app.canvas, document.getElementById("hi"));

    Assets.addBundle('fonts', [
        { alias: 'titleFont', src: './assets/titleFont.ttf' }
    ]);

    await Assets.loadBundle('fonts');

    let titleStyle = new TextStyle({
        fontFamily: 'titleFont',
        fontSize: 96,
        fontWeight: 'bold',
        fill: '#000000'
    });

    title = new Text({
        text: "Monster Rush",
        style: titleStyle,
    });
    
    title.anchor.set(0.5);
    title.x = 320;
    title.y = 60;

    app.stage.addChild(title);

    let startStyle = new TextStyle({
        fontFamily: 'titleFont',
        fontSize: 84,
        fontWeight: 'bold',
        fill: '#000000'
    });

    startTxt = new Text({
        text: "Start Game",
        style: startStyle,
    })
    
    startTxt.anchor.set(0.5);
    startTxt.x = 320;
    startTxt.y = 360;

    startTxt.eventMode = 'static';
    startTxt.cursor = 'pointer';
    startTxt.on('pointerdown', start);

    app.stage.addChild(startTxt);
})();

function start() {
    title.visible = false;
    startTxt.visible = false;
    startLevel("./level1.json", app);
}