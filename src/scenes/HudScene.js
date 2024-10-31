import { Scene } from "phaser";

// The HUD scene is the scene that shows the lives and the remaining time.
export class HudScene extends Scene {
    remaining_time = 0;

    remaining_time_text;
    lives_text;

    constructor() {
        super("HudScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.remaining_time = data.remaining_time;
    }

    create() {
        this.lives_text = this.add.bitmapText(
            10,
            10,
            "pixelfont",
            "LIVES:3",
            24
        );
        this.remaining_time_text = this.add
            .bitmapText(
                this.scale.width - 10,
                10,
                "pixelfont",
                `REMAINING:${this.remaining_time}s`,
                24
            )
            .setOrigin(1, 0);
    }

    update_lives(lives) {
        this.lives_text.setText(`LIVES:${lives.toString()}`);
    }

    update_timeout(timeout) {
        this.remaining_time_text.setText(
            `REMAINING:${timeout.toString().padStart(2, "0")}s`
        );
    }
}
