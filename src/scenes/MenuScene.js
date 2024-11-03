import { Scene } from "phaser";

export class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {
        // Logo
        this.add
            .image(this.scale.width / 2, this.scale.height / 2 + 100, "title")
            .setOrigin(0.5, 0.5)
            .postFX.addShine();

        this.add
            .bitmapText(
                this.scale.width / 2,
                this.scale.height / 2 + 100,
                "pixelfont",
                "BOOSTERS OFFLINE\nINCOMING ASTEROIDS\nACTIVATE DEFENSES",
                30,
                1
            )
            .setOrigin(0.5, 0.5);

        const start_msg = this.add
            .bitmapText(
                this.scale.width / 2,
                this.scale.height / 2 + 200,
                "pixelfont",
                "CLICK TO BEGIN",
                24
            )
            .setOrigin(0.5, 0.5);

        // Tween to blink the text
        this.tweens.add({
            targets: start_msg,
            alpha: 0,
            duration: 800,
            ease: (value) => Math.abs(Math.round(value)),
            yoyo: true,
            repeat: -1,
        });

        // Send start-game event when user clicks
        this.input.on("pointerdown", () => {
            this.game.events.emit("start-game");
        });
    }
}
