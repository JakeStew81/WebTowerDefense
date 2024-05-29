import { Sprite, Graphics } from './pixi.mjs';

export class Enemy {
    constructor(health, speed, value, path, app) {
        this.value = value;
        this.health = health;
        this.speed = speed;
        this.path = path;
        this.distanceOnPath = 0;

        this.time = 0;

        this.active = true;
        this.killed = false;

        this.sprite = Sprite.from('enemy');

        this.sprite.x = (path[0][0] - 1) * 32;
        this.sprite.y = (path[0][1] - 1) * 32;

        app.stage.addChild(this.sprite);

        this.healthBarColors = [
            '#ff0000',
            '#00ff00',
            '#03ffb3',
            '#03ffff',
            '#03a7ff',
            '#0307ff',
            '#6803ff',
            '#d903ff',
            '#ff03ab',
            '#ff6303',
            '#ffd503',
            '#c4ff03'
        ]

        this.healthBars = [
            new Graphics().rect(
                0, 0, 32, 7
            ).fill('#000000')
        ];
        app.stage.addChild(this.healthBars[0]);

        for (let a = 0; a <= Math.ceil(health/10); a++) {
            let bar = new Graphics().rect(
                0,
                0,
                30,
                5
            ).fill(this.healthBarColors[a]);
            app.stage.addChild(bar);
            this.healthBars.push(bar);
        }
    }

    damage(damage) {
        console.log("Damage!")
        this.health -= damage;
    }

    move(deltaTime) {
        this.time += deltaTime;
        
        if (this.distanceOnPath < this.path.length - 1) {
            this.sprite.x += -(this.path[this.distanceOnPath][0] - this.path[this.distanceOnPath + 1][0]) * (32/this.speed) * deltaTime;
            this.sprite.y += -(this.path[this.distanceOnPath][1] - this.path[this.distanceOnPath + 1][1]) * (32/this.speed) * deltaTime;
        } else {
            this.sprite.destroy();
            for (let a = 0; a < this.healthBars.length; a++) {
                this.healthBars[a].destroy()
            }
            this.active = false;
        }

        if (this.time >= this.speed) {
            this.time = 0;
            this.distanceOnPath++;

            this.sprite.x = (this.path[this.distanceOnPath][0] - 1) * 32
            this.sprite.y = (this.path[this.distanceOnPath][1] - 1) * 32
        }

        if (this.sprite.destroyed) {return}

        this.healthBars[0].x = this.sprite.x;
        this.healthBars[0].y = this.sprite.y - 9;

        for (let a = 1; a < this.healthBars.length; a++) {
            this.healthBars[a].x = this.sprite.x + 1;
            this.healthBars[a].y = this.sprite.y - 8;
        }

        if (this.health <= 0) {
            this.sprite.destroy();
            for (let a = 0; a < this.healthBars.length; a++) {
                this.healthBars[a].destroy()
            }
            this.active = false;
            this.killed = true;
        }
    }
}