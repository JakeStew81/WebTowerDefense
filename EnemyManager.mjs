import {Enemy} from './enemy.mjs';

export class EnemyManager {
    constructor(app, path, json) {
        this.app = app;
        this.path = path;

        this.health = json.health;

        this.roster = json.enemies;

        this.enemies = [];

        this.earnedMoney = 0;
    }

    periodic(gameTime, deltaTime) {
        for (let a = 0; a < this.enemies.length; a++) {
            this.enemies[a].move(deltaTime);
            if (!this.enemies[a].active) {
                this.health -= this.enemies[a].health;
                this.earnedMoney += (this.enemies[a].killed) ? this.enemies[a].value : 0;
                this.enemies.splice(a, 1);
            }
        }
        for (let a = 1; a <= Object.keys(this.roster).length; a++) {
            if (this.roster[a].enterTime <= gameTime && !this.roster[a].hasEntered) {
                this.enemies.push(new Enemy(this.roster[a].health, this.roster[a].speed, this.roster[a].value, this.path, this.app));
                this.roster[a].hasEntered = true;
            }
        }
    }
}