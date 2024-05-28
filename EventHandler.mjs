import {Sprite} from './pixi.mjs';
import {Tower} from './tower.mjs'

export class EventHandler {
    constructor (app) {
        this.app = app;

        this.normalTowerGhost = Sprite.from('normalTower');
        this.normalTowerGhost.tint = 0x333333;
        this.normalTowerGhost.visible = false;
        app.stage.addChild(this.normalTowerGhost);

        this.fastTowerGhost = Sprite.from('fastTower');
        this.fastTowerGhost.tint = 0x333333;
        this.fastTowerGhost.visible = false;
        app.stage.addChild(this.fastTowerGhost);

        this.ghostFunctions = new Map();
        this.ghostFunctions.set("normalTower", (event) => this.displayTowerGhost(this.normalTowerGhost, event));
        this.ghostFunctions.set("fastTower", (event) => this.displayTowerGhost(this.fastTowerGhost, event));

        this.whichTower = 'none';

        this.setupMouse();
    }

    setupMouse() {
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
    
        window.addEventListener('keydown', (event) => this.keydownHandler(event));
    
        this.app.stage.addEventListener('pointerdown', (e) => this.mouseHandler(e));
    }

    displayTowerGhost(ghost, event) {
        ghost.visible = true;
    
        ghost.x = Math.floor(event.global.x / 32) * 32;
        ghost.y = Math.floor(event.global.y / 32) * 32;
    }

    keydownHandler(event) {
        if(event.code == "Digit1") {
            this.whichTower = 'normalTower';
            this.app.stage.addEventListener("pointermove", this.ghostFunctions.get("normalTower"));
        }
        else if (event.code == 'Digit2') {
            this.whichTower = "fastTower"
            this.app.stage.addEventListener("pointermove", this.ghostFunctions.get("fastTower"));
        }
    }
    
    mouseHandler(event) {
        if (this.whichTower == "none") {return}
        console.log('bye')
        this.app.stage.removeEventListener('pointermove', this.ghostFunctions.get(this.whichTower));
        new Tower([Math.floor(event.global.x / 32), Math.floor(event.global.y / 32)], 10, 1, 10, this.whichTower, this.app)
        this.whichTower = 'none';
    }
}