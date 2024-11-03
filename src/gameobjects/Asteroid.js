import { GameObjects, Math } from "phaser";

export class Asteroid extends GameObjects.Image {
    speed;
    flame;
    end_direction = new Math.Vector2(0, 0);

    constructor(scene, x, y) {
        super(scene, x, y, "asteroid");
        this.setActive(false);
        this.setVisible(false);

        this.scale = 2;
        this.speed = Phaser.Math.GetSpeed(350, 1);
        this.name = "asteroid";
    }

    launch() {
        const x = this.scene.scale.width - 20;
        const y = Math.Between(10, this.scene.scale.height - 10);
        this.setPosition(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.end_direction.setTo(-1, 0);
    }

    destroyAsteroid() {
        this.scene.sound.play("explode");
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
    }

    // Update position and destroy if it goes off screen
    update(time, delta) {
        // if (!this.active) return;

        // console.log("moving asteroids", this.active);
        this.x += this.end_direction.x * this.speed * delta;
        this.y += this.end_direction.y * this.speed * delta;

        // check if asteroid crashed into player's base
        if (this.x <= 30) {
            this.scene.game.events.emit("asteroid-collision");
            this.scene.sound.play("explode");
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
            return;
        }

        // check if the asteroid has left the screen
        if (
            this.x > this.scene.sys.canvas.width ||
            this.x < 0 ||
            this.y > this.scene.sys.canvas.height ||
            this.y < 0
        ) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }
}
