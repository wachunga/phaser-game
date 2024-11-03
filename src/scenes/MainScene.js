import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { Asteroid } from "../gameobjects/Asteroid";

const GAME_LENGTH_SECONDS = 30;

export class MainScene extends Scene {
    player = null;
    asteroids = null;
    cursors = null;
    game_over_timeout = GAME_LENGTH_SECONDS;

    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Reset
        this.lives = 3;
        this.game_over_timeout = GAME_LENGTH_SECONDS;
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

        // This event comes from Asteroid
        this.game.events.on("asteroid-collision", () => {
            this.cameras.main.shake(100, 0.01);
            // Flash the color red for 300ms
            this.cameras.main.flash(300, 255, 10, 10, false);
            this.lives -= 1;
            this.scene.get("HudScene").update_lives(this.lives);

            if (this.lives <= 0) {
                this.gameOver(false);
            }
        });

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", {
                remaining_time: this.game_over_timeout,
            });
            this.player.start();

            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {
                    if (this.game_over_timeout === 0) {
                        this.gameOver(true);
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

    gameOver(winner) {
        // remove the event listener to avoid duplicate events
        this.game.events.removeListener("start-game");
        this.game.events.removeListener("asteroid-collision");
        // It is necessary to stop the scenes launched in parallel
        this.scene.stop("HudScene");
        this.scene.start("GameOverScene", { winner });
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
