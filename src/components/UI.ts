import { GameObjects, Scene } from "phaser";

export default class UI {
    private scene: Scene
    private healthCounter: GameObjects.Text
    private killsCounter: GameObjects.Text
    private style: {
        fontFamily: string,
        fontSize: string,
        color: string
    } = {
            fontFamily: 'Quicksand',
            fontSize: '32px',
            color: '#fff'
        }

    constructor(scene) {
        this.scene = scene
        this.createHealtCounter()
        this.createKillsCounter()
    }

    public updateKillsCounter(kills): void {
        this.killsCounter.setText(`KILLS: ${kills}`)
    }

    public updateHealthCounter(health): void {
        this.healthCounter.setText(`HEALTH: ${health}`)
    }

    private createHealtCounter(): void {
        this.healthCounter = this.scene.add.text(150, 20, 'HEALTH: 200', this.style)
        this.healthCounter.setOrigin(0.5)
        this.healthCounter.setDepth(1000)
        this.scene.children.add(this.healthCounter)
    }

    private createKillsCounter(): void {
        this.killsCounter = this.scene.add.text(this.scene.cameras.main.width / 2, 20, 'KILLS: 0', this.style)
        this.killsCounter.setOrigin(0.5)
        this.killsCounter.setDepth(1000)
        this.scene.children.add(this.killsCounter)
    }
}