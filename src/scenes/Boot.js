import {
    Scene
} from 'phaser'


class Boot extends Scene {
    create() {
        this.cameras.main.setBackgroundColor('#34c3eb')
        this.startLoader()
    }

    startLoader() {
        this.load.once('start', this.loadGameAssets, this)
        this.load.once('complete', () => this.nextScene())
        this.load.start()
    }

    loadGameAssets() {
        console.log('Loading assets');
    }

    nextScene() {
        this.scene.start('menu')
    }
}

export default Boot