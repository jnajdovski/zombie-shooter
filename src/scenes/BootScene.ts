import {
    Scene
} from 'phaser'


export default class Boot extends Scene {
    create() {
        this.cameras.main.setBackgroundColor('#34c3eb')
        this.startLoader()
    }

    startLoader() {
        this.load.once('start', () => this.loadGameAssets())
        this.load.once('complete', () => this.nextScene())
        this.load.start()
    }

    loadGameAssets() {
        this.load.image('background', 'assets/background.jpg')
        this.load.image('crosshair', 'assets/crosshair.png')
        this.load.image('bullet', 'assets/bullet.png')

        this.load.spritesheet('blood', 'assets/bloodAnimation.png', { frameWidth: 128, frameHeight: 128, endFrame: 15 })
        this.load.spritesheet('player_idle', 'assets/idleAnimation.png', { frameWidth: 313, frameHeight: 207, endFrame: 19 })
        this.load.spritesheet('player_move', 'assets/moveAnimation.png', { frameWidth: 313, frameHeight: 206, endFrame: 19 })
        this.load.spritesheet('player_shoot', 'assets/shootAnimation.png', { frameWidth: 305, frameHeight: 206, endFrame: 2 })

        this.load.spritesheet('zombie_attack', 'assets/zombieAttackAnimation.png', { frameWidth: 318, frameHeight: 294, endFrame: 8 })
        this.load.spritesheet('zombie_move', 'assets/zombieMoveAnimation.png', { frameWidth: 288, frameHeight: 311, endFrame: 16 })
    }

    nextScene() {
        this.scene.start('menu')
    }
}