import { Sprite, Spritesheet, Texture, AnimatedSprite, Graphics } from './pixi.mjs';

export class Tower {
    constructor(position, damage, fireRate, range, sprite, spritesheet, app) {
        this.app = app;
        this.damage = damage;
        this.fireRate = fireRate;
        this.range = range;
        this.whichTower = sprite;

        this.fadeLine = null;

        if (sprite == "fastTower") {
            let sheet = new Spritesheet(
                Texture.from(spritesheet[sprite].meta.image),
                spritesheet[sprite]
            );
    
            sheet.parse();

            this.sprite = new AnimatedSprite(sheet.animations[sprite]);

            this.sprite.animationSpeed = 1/20;
            this.sprite.play();
        } else {
            this.sprite = Sprite.from(sprite);
        }

        this.sprite.anchor.set(0.5);

        this.sprite.x = (position[0] * 32) + 16;
        this.sprite.y = (position[1] * 32) + 16;

        this.time = 0;

        app.stage.addChild(this.sprite);
    }

    periodic(enemies, deltaTime) {
        this.time += deltaTime;
        let closestEnemy = null;
        if (this.fadeLine != null) {
            this.fadeLine.alpha -= deltaTime/this.fireRate;
            if (this.fadeLine.alpha <= 0) {
                this.fadeLine.destroy();
                this.fadeLine = null;
            }
        }
        for (let a = 0; a < enemies.length; a++) {
            let distance = Math.sqrt(Math.pow((this.sprite.x) - (enemies[a].sprite.x + 16), 2) + Math.pow((this.sprite.y) - (enemies[a].sprite.y + 16), 2));
            closestEnemy = (closestEnemy == null && distance <= this.range * 32) ? a : closestEnemy;
        }
        if (closestEnemy != null && this.time >= this.fireRate) {
            if (this.whichTower == "fastTower") {
                let line = new Graphics();
                line.position.set(this.sprite.x, this.sprite.y - 12);
                line.lineTo(enemies[closestEnemy].sprite.x + 16 - this.sprite.x, enemies[closestEnemy].sprite.y + 16 - this.sprite.y);
                line.stroke({width: 2, color: "#22dfec"});
                line.circle(0, 0, 5).fill("#22dfec");
                this.app.stage.addChild(line);
                this.fadeLine = line;
            } else {
                this.sprite.rotation = Math.atan2(this.sprite.y - enemies[closestEnemy].sprite.y, this.sprite.x - enemies[closestEnemy].sprite.x) + Math.PI;
            }
            this.time = 0;
            if (this.whichTower == "boxingTower") {
                for (let a = 0; a < enemies.length; a++) {
                    if (Math.abs(enemies[closestEnemy].sprite.x - enemies[a].sprite.x) < 48 && Math.abs(enemies[closestEnemy].sprite.y - enemies[a].sprite.y) < 48) {
                        enemies[a].damageOverTime(this.damage);
                    }
                }
            } else {
                enemies[closestEnemy].damage(this.damage);
            }
        }
    }
}