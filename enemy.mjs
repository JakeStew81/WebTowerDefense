import { Sprite } from './pixi.mjs';

export class Enemy {
    constructor(health, path, app) {
        this.health = health;
        this.path = path;
        this.distanceOnPath = 0;

        this.counter = 0;

        this.sprite = Sprite.from('enemy');

        this.sprite.x = (path[0][0] - 1) * 32;
        this.sprite.y = (path[0][1] - 1) * 32;

        app.stage.addChild(this.sprite);
    }

    move(time) {
        this.counter += time.deltaTime;
        if (this.counter >= 1) {
            this.counter = 0;
            this.distanceOnPath++;

            this.sprite.x = (this.path[this.distanceOnPath][0] - 1) * 32;
            this.sprite.y = (this.path[this.distanceOnPath][1] - 1) * 32;
        }
    }
}