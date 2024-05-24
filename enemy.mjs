import { Sprite } from './pixi.mjs';

export class Enemy {
    constructor(health, path, app) {
        this.health = health;
        this.path = path;
        this.distanceOnPath = 0;

        this.previousTime = 0;
        this.counter = 0;

        this.active = true;

        this.sprite = Sprite.from('enemy');

        this.sprite.x = (path[0][0] - 1) * 32;
        this.sprite.y = (path[0][1] - 1) * 32;

        app.stage.addChild(this.sprite);
    }

    move(gameTime) {
        this.counter += gameTime - this.previousTime;
        this.previousTime = gameTime;
        if (this.counter >= 1) {
            this.counter = 0;
            this.distanceOnPath++;

            if (this.distanceOnPath < this.path.length) {
                this.sprite.x = (this.path[this.distanceOnPath][0] - 1) * 32;
                this.sprite.y = (this.path[this.distanceOnPath][1] - 1) * 32;
            } else {
                this.sprite.destroy();
                this.active = false;
            }
        }
    }
}