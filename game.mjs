import {Application, Assets, Sprite} from './pixi.mjs';
import {EnemyManager} from './EnemyManager.mjs';

const app = new Application();

const appWidth = screen.width < screen.height ? screen.width : screen.height;

let path;
let gameTime = 0;
let enemyManager;

async function setup() {
    await app.init({ background: '#1099bb', resizeTo: document.getElementById("hi")});
    console.log(app.screen.width);
    console.log(app.screen.height)
    document.body.insertBefore(app.canvas, document.getElementById("hi"));
}

async function loadTextures() {
    const assets = [
        { alias: 'enemy', src: './assets/enemy.png' },
        { alias: 'tower', src: './assets/tower.png' },
        { alias: 'path', src: './assets/path.png' },
        { alias: 'bullet', src: './assets/bullet.png' }
    ]

    await Assets.load(assets)
}

function drawSprite(sprite, position) {
    const spriteInst = Sprite.from(sprite);
    
    spriteInst.x = (position[0] - 1) * 32;
    spriteInst.y = (position[1] - 1) * 32;

    app.stage.addChild(spriteInst);
}

async function loadJSON(path) {
    let response = await fetch('./level.json');
    let json = await response.json();
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
    
    gameTime += time.deltaTime;
}

(async () =>
{
    await setup();
    await loadTextures();
    let json = await loadJSON('./level.json');
    await loadPath(json);

    enemyManager = new EnemyManager(app, path, json);

    app.ticker.add((time) => periodic(time));
})();