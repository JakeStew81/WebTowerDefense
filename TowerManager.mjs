import {Sprite, Graphics} from './pixi.mjs';
import {Tower} from './tower.mjs'

export class TowerManager {
    constructor (app, startingMoney) {
        this.app = app;

        this.money = startingMoney;

        this.towers = []

        this.rangeCirlce = null;

        this.normalTowerGhost = Sprite.from('normalTower');
        this.normalTowerGhost.tint = 0x333333;
        this.normalTowerGhost.visible = false;
        app.stage.addChild(this.normalTowerGhost);

        this.fastTowerGhost = Sprite.from('fastTower');
        this.fastTowerGhost.tint = 0x333333;
        this.fastTowerGhost.visible = false;
        app.stage.addChild(this.fastTowerGhost);

        this.boxingTowerGhost = Sprite.from('boxingTower');
        this.boxingTowerGhost.tint = 0x333333;
        this.boxingTowerGhost.visible = false;
        app.stage.addChild(this.boxingTowerGhost);

        this.ghostFunctions = new Map();
        this.ghostFunctions.set("normalTower", (event) => this.displayTowerGhost(this.normalTowerGhost, event));
        this.ghostFunctions.set("fastTower", (event) => this.displayTowerGhost(this.fastTowerGhost, event));
        this.ghostFunctions.set("boxingTower", (event) => this.displayTowerGhost(this.boxingTowerGhost, event));

        this.towerStats = new Map();
        this.towerStats.set("normalTower", [5, 70, 5, 100]);
        this.towerStats.set("fastTower", [2, 25, 4, 125]);
        this.towerStats.set("boxingTower", [10, 100, 1.5, 150]);

        this.whichTower = 'none';

        this.setupMouse();
    }

    periodic(enemies, deltaTime) {
        for (let a = 0; a < this.towers.length; a++) {
            this.towers[a].periodic(enemies, deltaTime);
        }
    }

    setupMouse() {
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
    
        window.addEventListener('keydown', (event) => this.keydownHandler(event));
    
        this.app.stage.addEventListener('pointerdown', (e) => this.mouseHandler(e));
    }

    displayTowerGhost(ghost, event) {
        this.rangeCirlce.visible = true;
        ghost.visible = true;
    
        this.rangeCirlce.x = (Math.floor(event.global.x / 32) * 32) + 16;
        this.rangeCirlce.y = (Math.floor(event.global.y / 32) * 32) + 16;
        ghost.x = Math.floor(event.global.x / 32) * 32;
        ghost.y = Math.floor(event.global.y / 32) * 32;
    }

    keydownHandler(event) {
        if(event.code == "Digit1") {
            this.whichTower = 'normalTower';
            if (this.rangeCirlce == null) {
                this.rangeCirlce = new Graphics().circle(0, 0, this.towerStats.get(this.whichTower)[2] * 32).fill("red");
                this.rangeCirlce.visible = false;
                this.rangeCirlce.alpha = 0.2;
                this.app.stage.addChild(this.rangeCirlce);
            }
            this.app.stage.addEventListener("pointermove", this.ghostFunctions.get("normalTower"));
        }
        else if (event.code == 'Digit2') {
            this.whichTower = "fastTower"
            if (this.rangeCirlce == null) {
                this.rangeCirlce = new Graphics().circle(0, 0, this.towerStats.get(this.whichTower)[2] * 32).fill("red");
                this.rangeCirlce.visible = false;
                this.rangeCirlce.alpha = 0.2;
                this.app.stage.addChild(this.rangeCirlce);
            }
            this.app.stage.addEventListener("pointermove", this.ghostFunctions.get("fastTower"));
        }
        else if (event.code == 'Digit3') {
            this.whichTower = "boxingTower"
            if (this.rangeCirlce == null) {
                this.rangeCirlce = new Graphics().circle(0, 0, this.towerStats.get(this.whichTower)[2] * 32).fill("red");
                this.rangeCirlce.visible = false;
                this.rangeCirlce.alpha = 0.2;
                this.app.stage.addChild(this.rangeCirlce);
            }
            this.app.stage.addEventListener("pointermove", this.ghostFunctions.get("boxingTower"));
        }
    }
    
    mouseHandler(event) {
        if (this.whichTower == "none") {return}
        this.rangeCirlce.destroy();
        this.rangeCirlce = null;
        this.app.stage.removeEventListener('pointermove', this.ghostFunctions.get(this.whichTower));
        if (this.money < this.towerStats.get(this.whichTower)[3]) {
            this.normalTowerGhost.visible = false;
            this.fastTowerGhost.visible = false;
            this.boxingTowerGhost.visible = false;
            return;
        }
        this.money -= this.towerStats.get(this.whichTower)[3];
        this.towers.push(new Tower(
            [Math.floor(event.global.x / 32), Math.floor(event.global.y / 32)], 
            this.towerStats.get(this.whichTower)[0], 
            this.towerStats.get(this.whichTower)[1], 
            this.towerStats.get(this.whichTower)[2], 
            this.whichTower, 
            this.app
        ));
        this.whichTower = 'none';
    }
}