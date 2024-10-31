import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { BlueEnemy } from "../gameobjects/BlueEnemy";
import { Asteroid } from "../gameobjects/Asteroid";

const GAME_LENGTH = 30;

export class MainScene extends Scene {
    player = null;
    enemy_blue = null;
    asteroids = null;
    cursors = null;

    points = 0;
    game_over_timeout = GAME_LENGTH;

    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Reset
        this.lives = 3;
        this.game_over_timeout = GAME_LENGTH;
    }

    create() {
        this.add.image(0, 0, "background").setOrigin(0, 0);

        // Player
        this.player = new Player({ scene: this });

        // Asteroids
        this.asteroids = this.physics.add.group({
            classType: Asteroid,
            maxSize: 10,
            active: false,
            runChildUpdate: true,
        });
        this.physics.add.existing(this.asteroids);

        // Enemy
        this.enemy_blue = new BlueEnemy(this);

        // Cursor keys
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space.on("down", () => {
            this.player.fire();
        });

        // Overlap asteroids with bullets
        this.physics.add.overlap(
            this.player.bullets,
            this.asteroids,
            (bullet, asteroid) => {
                bullet.destroyBullet();
                asteroid.destroyAsteroid();
            }
        );

        // This event comes from MenuScene
        this.game.events.on("asteroid-collision", () => {
            this.cameras.main.shake(100, 0.01);
            // Flash the color white for 300ms
            this.cameras.main.flash(300, 255, 10, 10, false);
            this.lives -= 1;
            this.scene.get("HudScene").update_lives(this.lives);
        });

        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", {
                remaining_time: this.game_over_timeout,
            });
            this.player.start();

            // Game Over timeout
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {
                    if (this.game_over_timeout === 0 || this.lives <= 0) {
                        // You need remove the event listener to avoid duplicate events.
                        this.game.events.removeListener("start-game");
                        this.game.events.removeListener("asteroid-collisions");
                        // It is necessary to stop the scenes launched in parallel.
                        this.scene.stop("HudScene");
                        this.scene.start("GameOverScene", {
                            points: this.points,
                        });
                    } else {
                        this.game_over_timeout--;
                        this.scene
                            .get("HudScene")
                            .update_timeout(this.game_over_timeout);

                        const asteroid = this.asteroids.get();
                        if (asteroid) {
                            this.asteroids.setActive(true);
                            asteroid.launch();
                        }
                    }
                },
            });
        });
    }

    update() {
        this.player.update();

        if (this.cursors.up.isDown) {
            this.player.move("up");
        }
        if (this.cursors.down.isDown) {
            this.player.move("down");
        }
    }
}
