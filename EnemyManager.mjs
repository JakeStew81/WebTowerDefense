import {Enemy} from './enemy.mjs';

export class EnemyManager {
    constructor(app, path, json) {
        this.app = app;
        this.path = path;

        this.health = 100;

        this.roster = json.enemies;

        this.enemies = [];
    }

    periodic(gameTime, deltaTime) {
        for (let a = 0; a < this.enemies.length; a++) {
            this.enemies[a].move(deltaTime);
            if (!this.enemies[a].active) {
                this.health -= this.enemies[a].health;
                this.enemies.splice(a, 1);
            }
        }
        for (let a = 1; a <= Object.keys(this.roster).length; a++) {
            if (this.roster[a].enterTime <= gameTime && !this.roster[a].hasEntered) {
                this.enemies.push(new Enemy(this.roster[a].health, this.roster[a].speed, this.path, this.app));
                this.roster[a].hasEntered = true;
            }
        }
    }

    getHealth() {
        return this.health;
    }
}