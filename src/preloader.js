// Class to preload all the assets
// Remember you can load this assets in another scene if you need it
export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        // Load all the assets
        this.load.setPath("assets");
        this.load.image("background", "background.png");
        this.load.image("title", "player/Title-Phaserwithout.png");

        this.load.image("player", "player/turret.png");

        // Bullets
        this.load.image("bullet", "player/bullet.png");
        this.load.image("flares");

        // Enemies
        this.load.image("asteroid", "enemies/asteroid.png");

        // Sounds
        this.load.audio("fire", "sounds/shoot.wav");
        this.load.audio("explode", "sounds/impact.wav");

        // Fonts
        this.load.bitmapFont(
            "pixelfont",
            "fonts/pixelfont.png",
            "fonts/pixelfont.xml"
        );

        this.load.on("progress", (progress) => {
            console.log("Loading: " + Math.round(progress * 100) + "%");
        });
    }

    create() {
        // When all the assets are loaded go to the next scene
        this.scene.start("MainScene");
    }
}
