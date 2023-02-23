import { GameObjects, Scene, Physics } from "phaser";
import Crosshair from "../components/Crosshair";
import Player from "../components/Player";
import UI from "../components/UI";
import Zombie from "../components/Zombie";
import Pool, { PoolObject } from "../helpers/Pool";
import { getRandomZombiePosition } from "../helpers/utils";

export default class GameScene extends Scene {
    private player: Player
    private background: GameObjects.Image
    private crosshair: Crosshair
    private gameW: number
    private gameH: number
    private zombiePool: Pool
    private UI: UI

    create() {
        this.gameW = this.cameras.main.width
        this.gameH = this.cameras.main.height
        this.background = new GameObjects.Image(this, 0, 0, 'background')
        this.background.setOrigin(0, 0)
        this.background.setDisplaySize(this.gameW, this.gameH)
        this.children.add(this.background)

        this.player = new Player(this, this.gameW / 2, this.gameH / 2)
        this.crosshair = new Crosshair(this)
        this.zombiePool = new Pool(() => this.createZombies(), (obj) => this.resetZombies(obj), 1)

        this.UI = new UI(this)
        setInterval(() => {
            this.spawnZombie()
        }, 1200)
    }

    createZombies() {
        const { x, y } = getRandomZombiePosition(this.gameW, this.gameH)
        return new Zombie(this, x, y, this.player.bulletsPool)
    }

    resetZombies(obj: PoolObject) {
        obj.free = true
        obj.data.hide()
    }

    spawnZombie() {
        const { x, y } = getRandomZombiePosition(this.gameW, this.gameH)
        const zombie = this.zombiePool.getFree()
        zombie.data.show(x, y)
        zombie.data.on('kill', () => {
            this.zombiePool.release(zombie)
            this.player.updateKills()
            this.UI.updateKillsCounter(this.player.getKills())
        })

        zombie.data.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'zombie_attack', () => {
            zombie.data.emit('attack')
        })

        zombie.data.on('attack', () => {
            this.player.updateHealth()
            this.UI.updateHealthCounter(this.player.getHealth())
        })

        zombie.free = false
    }

    update(time: number, delta: number): void {
        this.player.update()
        this.zombiePool.pool.forEach((zombie) => {
            if (zombie.data.visible) {
                let collides = false
                this.physics.overlap(this.player, zombie.data, () => collides = true)

                if (collides) {
                    zombie.data.attackPlayer = true
                } else {
                    zombie.data.attackPlayer = false
                }
                zombie.data.update(this.player.getPosition())
            }
        })

    }
}