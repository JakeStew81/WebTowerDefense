import {Enemy} from './enemy.mjs';

export class EnemyManager {
    constructor(app, path, json, spritesheet) {
        this.app = app;
        this.path = path;
        this.spritesheet = spritesheet;

        this.health = json.health;

        this.json = json.enemies;

        this.roster = json.enemies[1];

        this.wave = 1;
        this.resetTime = false;

        this.enemies = [];

        this.earnedMoney = 0;

        this.levelComplete = false;
    }

    periodic(gameTime, deltaTime) {
        for (let a = 0; a < this.enemies.length; a++) {
            this.enemies[a].move(deltaTime);
            if (!this.enemies[a].active) {
                this.health -= (this.enemies[a].health < 0) ? 0 : this.enemies[a].health;
                this.earnedMoney += (this.enemies[a].killed) ? this.enemies[a].value : 0;
                this.enemies.splice(a, 1);
            }
        }
        let allHaveEntered = true;
        for (let a = 1; a <= Object.keys(this.roster).length; a++) {
            allHaveEntered = this.roster[a].hasEntered;
            if (this.roster[a].enterTime <= gameTime && !this.roster[a].hasEntered) {
                this.enemies.push(
                    new Enemy(
                        this.roster[a].health,
                        this.roster[a].speed,
                        this.roster[a].value,
                        this.roster[a].texture,
                        this.path, 
                        this.spritesheet,
                        this.app
                    ));
                this.roster[a].hasEntered = true;
            }
        }
        if (allHaveEntered && this.enemies.length == 0) {
            this.wave++;
            if (this.wave >= this.json.length) {
                this.levelComplete = true;
                return
            } 
            this.roster = this.json[this.wave];
            this.resetTime = true;
        }
    }
}