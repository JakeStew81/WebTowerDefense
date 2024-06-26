import {Sprite, Graphics} from './pixi.mjs';
import {Tower} from './tower.mjs'

export class TowerManager {
    constructor (app, startingMoney, spritesheet, path) {
        this.app = app;
        this.path = path;
        this.spritesheet = spritesheet;

        this.money = startingMoney;

        this.towers = []

        this.rangeCirlce = null;

        this.normalTowerGhost = Sprite.from('normalTower');
        this.normalTowerGhost.tint = 0x333333;
        this.normalTowerGhost.visible = false;
        app.stage.addChild(this.normalTowerGhost);

        this.fastTowerGhost = Sprite.from('fastTowerGhost');
        this.fastTowerGhost.setSize(32, 32)
        this.fastTowerGhost.tint = 0x333333;
        this.fastTowerGhost.visible = false;
        app.stage.addChild(this.fastTowerGhost);

        this.boxingTowerGhost = Sprite.from('boxingTower');
        this.boxingTowerGhost.tint = 0x333333;
        this.boxingTowerGhost.visible = false;
        app.stage.addChild(this.boxingTowerGhost);

        this.longRangeTowerGhost = Sprite.from('longRangeTower');
        this.longRangeTowerGhost.tint = 0x333333;
        this.longRangeTowerGhost.visible = false;
        app.stage.addChild(this.longRangeTowerGhost);

        this.ghostFunctions = new Map();
        this.ghostFunctions.set("normalTower", (event) => this.displayTowerGhost(this.normalTowerGhost, event));
        this.ghostFunctions.set("fastTower", (event) => this.displayTowerGhost(this.fastTowerGhost, event));
        this.ghostFunctions.set("boxingTower", (event) => this.displayTowerGhost(this.boxingTowerGhost, event));
        this.ghostFunctions.set("longRangeTower", (event) => this.displayTowerGhost(this.longRangeTowerGhost, event));

        this.towerStats = new Map();
        this.towerStats.set("normalTower", [5, 67, 4.75, 100]);
        this.towerStats.set("fastTower", [2.5, 22.5, 3.5, 145]);
        this.towerStats.set("boxingTower", [5, 50, 2, 135]);
        this.towerStats.set("longRangeTower", [15, 95, 999, 150]);

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
        else if (event.code == 'Digit4') {
            this.whichTower = "longRangeTower"
            if (this.rangeCirlce == null) {
                this.rangeCirlce = new Graphics().circle(0, 0, this.towerStats.get(this.whichTower)[2] * 32).fill("red");
                this.rangeCirlce.visible = false;
                this.rangeCirlce.alpha = 0.2;
                this.app.stage.addChild(this.rangeCirlce);
            }
            this.app.stage.addEventListener("pointermove", this.ghostFunctions.get("longRangeTower"));
        }
    }
    
    mouseHandler(event) {
        if (this.whichTower == "none") {return}
        this.rangeCirlce.destroy();
        this.rangeCirlce = null;
        this.app.stage.removeEventListener('pointermove', this.ghostFunctions.get(this.whichTower));
        this.normalTowerGhost.visible = false;
        this.fastTowerGhost.visible = false;
        this.boxingTowerGhost.visible = false;
        this.longRangeTowerGhost.visible = false;
        let obstructed = false;
        for (let a = 0; a < this.path.length; a++) {
            if (obstructed) {break}
            obstructed = 
                Math.floor(event.global.x / 32) + 1 == this.path[a][0] &&
                Math.floor(event.global.y / 32) + 1 == this.path[a][1]
        }
        for (let a = 0; a < this.towers.length; a++) {
            if (obstructed) {break}
            obstructed = 
                Math.floor(event.global.x / 32) + 1 == Math.floor(this.towers[a].sprite.x / 32) + 1 &&
                Math.floor(event.global.y / 32) + 1 == Math.floor(this.towers[a].sprite.y / 32) + 1
        }
        if (obstructed) {return;}
        if (this.money < this.towerStats.get(this.whichTower)[3]) {return;}
        this.money -= this.towerStats.get(this.whichTower)[3];
        this.towers.push(new Tower(
            [Math.floor(event.global.x / 32), Math.floor(event.global.y / 32)], 
            this.towerStats.get(this.whichTower)[0], 
            this.towerStats.get(this.whichTower)[1], 
            this.towerStats.get(this.whichTower)[2], 
            this.whichTower, 
            this.spritesheet,
            this.app
        ));
        this.whichTower = 'none';
    }
}