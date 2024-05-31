import { Sprite, Graphics, Assets, AnimatedSprite, Spritesheet, Texture } from './pixi.mjs';

export class Enemy {
    constructor(health, speed, value, texture, path, spritesheet, app) {
        this.value = value;
        this.health = health;
        this.speed = speed;
        this.path = path;
        this.distanceOnPath = 0;

        this.time = 0;

        this.active = true;
        this.killed = false;

        this.spritesheet = new Spritesheet(
            Texture.from(spritesheet[texture].meta.image),
            spritesheet[texture]
        );

        this.spritesheet.parse();
        
        this.sprite = new AnimatedSprite(this.spritesheet.animations[texture]);

        this.sprite.animationSpeed = 1/20;

        this.sprite.x = (path[0][0] - 1) * 32;
        this.sprite.y = (path[0][1] - 1) * 32;

        this.sprite.pivot.set(32, 0);
        this.sprite.angle = 270;

        this.sprite.play();

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

        this.facingMap = new Map();
        this.facingMap.set("10", [90, [0, 32]])
        this.facingMap.set("-10", [270, [32, 0]])
        this.facingMap.set("01", [180, [32, 32]])
        this.facingMap.set("0-1", [0, [0, 0]])
    }

    damage(damage) {
        console.log("Damage!")
        this.health -= damage;

        while (damage > 0) {
            if (this.healthBars[this.healthBars.length - 1].width/3 >= damage) {
                this.healthBars[this.healthBars.length - 1].width -= damage * 3;
                damage = 0;
            } else {
                damage -= this.healthBars[this.healthBars.length - 1];
                this.healthBars[this.healthBars.length - 1].width -= this.healthBars[this.healthBars.length - 1].width;
            }
            if (this.healthBars[this.healthBars.length - 1].width <= 0) {
                this.healthBars.splice(this.healthBars.length - 1, 1);
            }
        }
    }

    move(deltaTime) {
        this.time += deltaTime;
        
        if (this.distanceOnPath < this.path.length - 1) {
            this.sprite.x += -(this.path[this.distanceOnPath][0] - this.path[this.distanceOnPath + 1][0]) * (32/this.speed) * deltaTime;
            this.sprite.y += -(this.path[this.distanceOnPath][1] - this.path[this.distanceOnPath + 1][1]) * (32/this.speed) * deltaTime;

            let headingStuff = this.facingMap.get((this.path[this.distanceOnPath][0] - this.path[this.distanceOnPath + 1][0]).toString() + (this.path[this.distanceOnPath][1] - this.path[this.distanceOnPath + 1][1]).toString())
            if (headingStuff != undefined) {
                this.sprite.pivot.set(headingStuff[1][0], headingStuff[1][1]);
                this.sprite.angle = headingStuff[0];
            }
            
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