import { Sprite } from './pixi.mjs';

export class Enemy {
    constructor(health, position, app) {
        this.health = health;

        const sprite = Sprite.from('enemy');

        sprite.anchor.set(0.5, 0.5);

        sprite.x = position[0];
        sprite.y = position[1];

        app.stage.addChild(sprite);
    }
}