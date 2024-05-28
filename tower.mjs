import { Sprite } from './pixi.mjs';

export class Tower {
    constructor(position, damage, fireRate, range, app) {
        this.damage = damage;
        this.fireRate = fireRate;

        this.sprite = Sprite.from('tower');

        this.sprite.x = position[0] * 32;
        this.sprite.y = position[1] * 32;

        app.stage.addChild(this.sprite);
    }
}