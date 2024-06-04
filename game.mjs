import { Application, Assets, Sprite, Text, TextStyle } from './pixi.mjs';
import { EnemyManager } from './EnemyManager.mjs';
import { TowerManager } from './TowerManager.mjs';

let app;

let json;
let spritesheet;
let path;
let gameTime = 0;
let enemyManager;
let towerManager;

let healthTxt;
let moneyTxt;
let lvlTxt;

async function setup(jsonPath) {
    await loadTextures();
    json = await loadJSON(jsonPath);
    await loadPath(json);

    spritesheet = await loadJSON("./animations.json")

    drawSprite('healthSymbol', [1, 1]);
    displayStats(json.health, json.startMoney, "1/" + Object.keys(json.enemies).length);
}

async function loadTextures() {
    const assets = [
        { alias: 'enemy1', src: './assets/enemy1.png' },
        { alias: 'tankyEnemy', src: './assets/tankyEnemy.png' },
        { alias: 'fastTower', src: './assets/fastTower.png' },
        { alias: 'animations', src: './animations.json' },
        { alias: 'fastTowerGhost', src: './assets/fastTowerGhost.png' },
        { alias: 'normalTower', src: './assets/normalTower.png' },
        { alias: 'boxingTower', src: './assets/boxingTower.png' },
        { alias: 'longRangeTower', src: './assets/longRangeTower.png' },
        { alias: 'path', src: './assets/path.png' },
        { alias: 'bullet', src: './assets/bullet.png' },
        { alias: 'healthSymbol', src: './assets/healthSymbol.png' }
    ]

    await Assets.load(assets)
}

function displayStats(health, money, level) {
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

    moneyTxt = new Text({
        text: money,
        style,
    });

    moneyTxt.x = 96;
    moneyTxt.y = 4;

    app.stage.addChild(moneyTxt);

    lvlTxt = new Text({
        text: level,
        style,
    });

    lvlTxt.x = 200;
    lvlTxt.y = 4;

    app.stage.addChild(lvlTxt);
}

function drawSprite(sprite, position) {
    let spriteInst = Sprite.from(sprite);
    
    spriteInst.x = (position[0] - 1) * 32;
    spriteInst.y = (position[1] - 1) * 32;

    app.stage.addChild(spriteInst);
}

async function loadJSON(path) {
    let response = await fetch(path);
    let thing = await response.json();
    return thing;
}

async function loadPath(json) {  
    let rawPath = json.rawPath;
    path = [];
    for (let a = 1; a < Object.keys(rawPath).length; a++) {
        let goingY = rawPath[a].x == rawPath[a + 1].x;
        let distance = goingY ? rawPath[a + 1].y - rawPath[a].y : rawPath[a + 1].x - rawPath[a].x;
        for (let b = 0; b <= Math.abs(distance); b++) {
            let pathCoords = [goingY ? rawPath[a].x : rawPath[a].x + (b * Math.sign(distance)), goingY ? rawPath[a].y + (b * Math.sign(distance)) : rawPath[a].y];
            if (path.length > 0) {
                if (pathCoords[0] != path[path.length - 1][0] || pathCoords[1] != path[path.length - 1][1]) {
                    path.push(pathCoords);
                    drawSprite('path', path[path.length - 1]);
                }
            } else {
                path.push(pathCoords);
                drawSprite('path', path[path.length - 1]);
            }
        }
    }
    console.log(path)
}

function periodic(time) {
    if (enemyManager.levelComplete || enemyManager.health <= 0) {
        app.stage.removeChildren(0);

        let winStyle = new TextStyle({
            fontFamily: 'titleFont',
            fontSize: 96,
            fontWeight: 'bold',
            fill: '#000000'
        });

        let winText = new Text({
            text: (enemyManager.levelComplete) ? "You Win!" : "You Loose...",
            style: winStyle,
        });
        
        winText.anchor.set(0.5);
        winText.x = 320;
        winText.y = 320;
    
        app.stage.addChild(winText);
    } else {
        enemyManager.periodic(gameTime, time.deltaTime);

        towerManager.periodic(enemyManager.enemies, time.deltaTime);
        
        gameTime += time.deltaTime;

        towerManager.money += enemyManager.earnedMoney;
        enemyManager.earnedMoney = 0;

        healthTxt.text = enemyManager.health;
        lvlTxt.text = enemyManager.wave + "/" + Object.keys(json.enemies).length;
        moneyTxt.text = towerManager.money;
        if (enemyManager.resetTime) {
            gameTime = 0;
            enemyManager.resetTime = false;
        }
    }
}

export async function startLevel(jsonPath, application) {
    app = application;

    await setup(jsonPath);

    enemyManager = new EnemyManager(app, path, json, spritesheet);
    towerManager = new TowerManager(app, json.startMoney, spritesheet, path);

    app.ticker.add((time) => periodic(time));
};