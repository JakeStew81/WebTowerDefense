import { Application, Assets, Sprite, Text, TextStyle } from './pixi.mjs';
import { EnemyManager } from './EnemyManager.mjs';
import { TowerManager } from './TowerManager.mjs';

const app = new Application();

const appWidth = screen.width < screen.height ? screen.width : screen.height;

let json;
let path;
let gameTime = 0;
let enemyManager;
let towerManager;

let healthTxt;
let moneyTxt;

async function setup() {
    await app.init({ background: '#a8acaa', resizeTo: document.getElementById("hi")});
    console.log(app.screen.width);
    console.log(app.screen.height)
    document.body.insertBefore(app.canvas, document.getElementById("hi"));

    await loadTextures();
    let json = await loadJSON('./level.json');
    await loadPath(json);

    drawSprite('healthSymbol', [1, 1]);
    displayStats(json.health, json.startMoney);
}

async function loadTextures() {
    const assets = [
        { alias: 'enemy', src: './assets/enemy.png' },
        { alias: 'fastTower', src: './assets/fastTower.png' },
        { alias: 'normalTower', src: './assets/normalTower.png' },
        { alias: 'boxingTower', src: './assets/boxingTower.png' },
        { alias: 'path', src: './assets/path.png' },
        { alias: 'bullet', src: './assets/bullet.png' },
        { alias: 'healthSymbol', src: './assets/healthSymbol.png' }
    ]

    await Assets.load(assets)
}

function displayStats(health, money) {
    let style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 'bold',
        fill: '#000000'
    });

    healthTxt = new Text({
        text: health,
        style,
    });

    healthTxt.x = 32;
    healthTxt.y = 4;

    app.stage.addChild(healthTxt);

    console.log(healthTxt.text);

    moneyTxt = new Text({
        text: money,
        style,
    });

    moneyTxt.x = 96;
    moneyTxt.y = 4;

    app.stage.addChild(moneyTxt);
}

function drawSprite(sprite, position) {
    let spriteInst = Sprite.from(sprite);
    
    spriteInst.x = (position[0] - 1) * 32;
    spriteInst.y = (position[1] - 1) * 32;

    app.stage.addChild(spriteInst);
}

async function loadJSON(path) {
    let response = await fetch('./level.json');
    json = await response.json();
    return json;
}

async function loadPath(json) {  
    let rawPath = json.rawPath;
    path = [];
    for (let a = 1; a < Object.keys(rawPath).length; a++) {
        let goingY = rawPath[a].x == rawPath[a + 1].x;
        let distance = goingY ? rawPath[a + 1].y - rawPath[a].y : rawPath[a + 1].x - rawPath[a].x;
        for (let b = 0; b <= Math.abs(distance); b++) {
            path.push([goingY ? rawPath[a].x : rawPath[a].x + (b * Math.sign(distance)), goingY ? rawPath[a].y + (b * Math.sign(distance)) : rawPath[a].y]);
            drawSprite('path', path[path.length - 1]);
        }
    }
}

function periodic(time) {
    enemyManager.periodic(gameTime, time.deltaTime);

    towerManager.periodic(enemyManager.enemies, time.deltaTime);
    
    gameTime += time.deltaTime;

    towerManager.money += enemyManager.earnedMoney;
    enemyManager.earnedMoney = 0;

    healthTxt.text = enemyManager.health;
    moneyTxt.text = towerManager.money;
}

(async () =>
{
    await setup();

    enemyManager = new EnemyManager(app, path, json);
    towerManager = new TowerManager(app, json.startMoney);

    app.ticker.add((time) => periodic(time));
})();