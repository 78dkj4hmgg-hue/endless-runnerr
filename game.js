// game.js
const config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  backgroundColor: "#7ec8ff",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 1200 },
      debug: false
    }
  },
  scene: [MenuScene, GameScene, GameOverScene]
};

new Phaser.Game(config);

// ===== MENU =====
function MenuScene() {
  Phaser.Scene.call(this, { key: "MenuScene" });
}
MenuScene.prototype = Object.create(Phaser.Scene.prototype);

MenuScene.prototype.create = function () {
  this.add.text(180, 200, "OKUL KAÇIŞI", {
    fontSize: "32px",
    color: "#000"
  }).setOrigin(0.5);

  const startBtn = this.add.text(180, 320, "BAŞLA", {
    fontSize: "26px",
    backgroundColor: "#000",
    color: "#fff",
    padding: { x: 20, y: 10 }
  }).setOrigin(0.5).setInteractive();

  startBtn.on("pointerdown", () => {
    this.scene.start("GameScene");
  });
};

// ===== GAME =====
function GameScene() {
  Phaser.Scene.call(this, { key: "GameScene" });
}
GameScene.prototype = Object.create(Phaser.Scene.prototype);

GameScene.prototype.create = function () {
  this.score = 0;

  this.player = this.physics.add.rectangle(180, 500, 40, 40, 0x000000);
  this.player.body.setCollideWorldBounds(true);

  this.obstacles = this.physics.add.group();

  this.scoreText = this.add.text(10, 10, "Skor: 0", {
    fontSize: "18px",
    color: "#000"
  });

  this.input.on("pointerdown", () => {
    if (this.player.body.touching.down) {
      this.player.body.setVelocityY(-500);
    }
  });

  this.time.addEvent({
    delay: 1500,
    loop: true,
    callback: () => {
      const obs = this.physics.add.rectangle(
        Phaser.Math.Between(40, 320),
        -20,
        50,
        30,
        0xff0000
      );
      this.obstacles.add(obs);
      obs.body.setVelocityY(300);
    }
  });

  this.physics.add.overlap(this.player, this.obstacles, () => {
    this.scene.start("GameOverScene", { score: this.score });
  });
};

GameScene.prototype.update = function () {
  this.score++;
  this.scoreText.setText("Skor: " + this.score);
};

// ===== GAME OVER =====
function GameOverScene() {
  Phaser.Scene.call(this, { key: "GameOverScene" });
}
GameOverScene.prototype = Object.create(Phaser.Scene.prototype);

GameOverScene.prototype.init = function (data) {
  this.finalScore = data.score || 0;
};

GameOverScene.prototype.create = function () {
  this.add.text(180, 200, "GAME OVER", {
    fontSize: "32px",
    color: "#000"
  }).setOrigin(0.5);

  this.add.text(180, 250, "Skor: " + this.finalScore, {
    fontSize: "20px",
    color: "#000"
  }).setOrigin(0.5);

  const retry = this.add.text(180, 330, "TEKRAR OYNA", {
    fontSize: "22px",
    backgroundColor: "#000",
    color: "#fff",
    padding: { x: 15, y: 8 }
  }).setOrigin(0.5).setInteractive();

  const menu = this.add.text(180, 390, "MENÜ", {
    fontSize: "22px",
    backgroundColor: "#000",
    color: "#fff",
    padding: { x: 15, y: 8 }
  }).setOrigin(0.5).setInteractive();

  retry.on("pointerdown", () => {
    this.scene.start("GameScene");
  });

  menu.on("pointerdown", () => {
    this.scene.start("MenuScene");
  });
};
