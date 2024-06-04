import { Application, Assets, Sprite, Text, TextStyle } from "./pixi.mjs";
import { startLevel } from "./game.mjs"

const app = new Application();

let title;
let startTxt;
let howToTxt;

let howToTitle;
let howTo;

(async () =>
{
    await app.init({ background: '#a8acaa', resizeTo: document.getElementById("hi")});
    document.body.insertBefore(app.canvas, document.getElementById("hi"));

    Assets.addBundle('fonts', [
        { alias: 'titleFont', src: './assets/titleFont.ttf' },
        { alias: 'textFont', src: './assets/textFont.ttf' }
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

    howToTxt = new Text({
        text: "How to Play",
        style: startStyle,
    })
    
    howToTxt.anchor.set(0.5);
    howToTxt.x = 320;
    howToTxt.y = 500;

    howToTxt.eventMode = 'static';
    howToTxt.cursor = 'pointer';
    howToTxt.on('pointerdown', howToPlay);

    app.stage.addChild(howToTxt);

    let textStyle = new TextStyle({
        fontFamily: 'titleFont',
        fontSize: 36,
        lineHeight: 30,
        leading: -1
    });

    howToTitle = new Text({
        text: "How to Play",
        style: titleStyle,
    })

    howToTitle.anchor.set(0.5);
    howToTitle.x = 320;
    howToTitle.y = 50;

    app.stage.addChild(howToTitle);

    howToTitle.visible = false;

    howTo = new Text({
        text: 
        `Use number keys to place towers: \n
        Press 1 to place an average speed, \n  damage, and range balista tower for $100 \n
        Press 2 to place a quick-attacking, \n  lower damage crystal for $145 \n
        Press 3 to place a low-range, damage \n  over time lava thrower with splash for $140 \n
        Press 4 to place an extreme long-range, \n  high damage, low attack speed cannon for $150 \n
        Reload page to go back`,
        style: textStyle,
    })

    howTo.anchor.set(0.5);
    howTo.x = 320;
    howTo.y = 360;

    app.stage.addChild(howTo);

    howTo.visible = false;
})();

function start() {
    title.visible = false;
    startTxt.visible = false;
    howToTxt.visible = false;
    startLevel("./level1.json", app);
}

function howToPlay() {
    title.visible = false;
    startTxt.visible = false;
    howToTxt.visible = false;

    howToTitle.visible = true;
    howTo.visible = true;
}