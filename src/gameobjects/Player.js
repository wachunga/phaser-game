import { GameObjects, Physics } from "phaser";
import { Bullet } from "./Bullet";

export class Player extends Physics.Arcade.Image {
    // Player states: waiting, can_move
    state = "waiting";
    scene = null;
    bullets = null;

    constructor({ scene }) {
        super(scene, 60, scene.scale.height / 2, "player");
        this.scale = 2;
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Bullets group to create pool
        this.bullets = this.scene.physics.add.group({
            classType: Bullet,
            maxSize: 100,
            runChildUpdate: true,
        });
    }

    start() {
        this.state = "can_move";
    }

    move(direction) {
        if (this.state === "can_move") {
            if (direction === "up" && this.y - 10 > 0) {
                this.y -= 5;
            } else if (
                direction === "down" &&
                this.y + 15 < this.scene.scale.height
            ) {
                this.y += 5;
            }
        }
    }

    fire(x, y) {
        if (this.state === "can_move") {
            // Create bullet
            const bullet = this.bullets.get();
            if (bullet) {
                bullet.fire(this.x + 48, this.y + 2, x, y);
            }
        }
    }

    update() {
        // Sinusoidal movement up and down up and down 2px
        this.y += Math.sin(this.scene.time.now / 200) * 0.1;
    }
}
