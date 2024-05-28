import { Sprite } from './pixi.mjs';

export class Enemy {
    constructor(health, speed, path, app) {
        this.health = health;
        this.speed = speed;
        this.path = path;
        this.distanceOnPath = 0;

        this.time = 0;

        this.active = true;

        this.sprite = Sprite.from('enemy');

        this.sprite.x = (path[0][0] - 1) * 32;
        this.sprite.y = (path[0][1] - 1) * 32;

        app.stage.addChild(this.sprite);
    }

    move(deltaTime) {
        this.time += deltaTime;
        
        if (this.distanceOnPath < this.path.length - 1) {
            this.sprite.x += -(this.path[this.distanceOnPath][0] - this.path[this.distanceOnPath + 1][0]) * (32/this.speed) * deltaTime;
            this.sprite.y += -(this.path[this.distanceOnPath][1] - this.path[this.distanceOnPath + 1][1]) * (32/this.speed) * deltaTime;
        } else {
            this.sprite.destroy();
            this.active = false;
        }

        if (this.time >= this.speed) {
            this.time = 0;
            this.distanceOnPath++;

            this.sprite.x = (this.path[this.distanceOnPath][0] - 1) * 32
            this.sprite.y = (this.path[this.distanceOnPath][1] - 1) * 32
        }
    }
}