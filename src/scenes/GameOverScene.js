import { Scene } from "phaser";

export class GameOverScene extends Scene {
    winner;

    constructor() {
        super("GameOverScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.winner = data.winner === true;
    }

    create() {
        this.add.image(0, 0, "background").setOrigin(0, 0);
        this.add
            .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.8);

        this.add
            .bitmapText(
                this.scale.width / 2,
                this.scale.height / 2 - 130,
                "pixelfont",
                this.winner ? "VICTORY" : "GAME OVER",
                62,
                1
            )
            .setOrigin(0.5, 0.5)
            .setCharacterTint(0, -1, false, 0x00ff00);

        this.add
            .bitmapText(
                this.scale.width / 2,
                this.scale.height / 2,
                "pixelfont",
                this.winner
                    ? "BOOSTERS ONLINE\nESCAPE ACTIVATED"
                    : "HULL BREACHED\nABANDON SHIP",
                30,
                1
            )
            .setOrigin(0.5, 0.5)
            .setCharacterTint(0, -1, true, 0x00ff00);

        this.add
            .bitmapText(
                this.scale.width / 2,
                this.scale.height / 2 + 130,
                "pixelfont",
                `... CLICK TO ${this.winner ? "PLAY AGAIN" : "RESTART"} ...`,
                24
            )
            .setOrigin(0.5, 0.5)
            .setCharacterTint(0, -1, true, 0x00ff00);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.input.on("pointerdown", () => {
                    this.scene.start("MainScene");
                });
            },
        });
    }
}
