import {
    Scale,
    WEBGL
} from 'phaser'

/** @type {import('phaser').Types.Core.GameConfig} */
const config = {
    type: WEBGL,
    parent: 'root',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
    },
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    width: 1280,
    height: 720
}

export default config