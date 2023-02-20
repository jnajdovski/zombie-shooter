import {
    Scene
} from 'phaser'

export default class Menu extends Scene {
    create() {
        console.log('menu Created');
    }

    nextScene() {
        // this.scene.start('menu')
    }
}