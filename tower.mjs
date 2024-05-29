import { Sprite } from './pixi.mjs';

export class Tower {
    constructor(position, damage, fireRate, range, sprite, app) {
        this.damage = damage;
        this.fireRate = fireRate;
        this.range = range;

        this.sprite = Sprite.from(sprite);

        this.sprite.x = position[0] * 32;
        this.sprite.y = position[1] * 32;

        this.time = 0;

        app.stage.addChild(this.sprite);
    }

    periodic(enemies, deltaTime) {
        this.time += deltaTime;
        let closestEnemy = null;
        for (let a = 0; a < enemies.length; a++) {
            let distance = Math.sqrt(Math.pow((this.sprite.x + 16) - (enemies[a].sprite.x + 16), 2) + Math.pow((this.sprite.y + 16) - (enemies[a].sprite.y + 16), 2));
            closestEnemy = (closestEnemy == null && distance <= this.range * 32) ? a : closestEnemy;
        }
        if (closestEnemy != null && this.time >= this.fireRate) {
            console.log("Damaging!")
            this.time = 0;
            enemies[closestEnemy].damage(this.damage);
        }
    }
}