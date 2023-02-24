import { GameObjects, Scene, Time } from "phaser";
import Blood from "../components/Blood";
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
    private bloodPool: Pool
    private UI: UI
    private playerDead: boolean = false
    private zombieTimer: Time.TimerEvent

    create(): void {
        this.gameW = this.cameras.main.width
        this.gameH = this.cameras.main.height
        this.background = new GameObjects.Image(this, 0, 0, 'background')
        this.background.setOrigin(0, 0)
        this.background.setDisplaySize(this.gameW, this.gameH)
        this.children.add(this.background)

        this.player = new Player(this, this.gameW / 2, this.gameH / 2)
        this.crosshair = new Crosshair(this)
        this.bloodPool = new Pool(() => this.createBlood(), (obj) => this.resetBlood(obj))
        this.zombiePool = new Pool(() => this.createZombie(), (obj) => this.resetZombies(obj))

        this.UI = new UI(this)

        this.zombieTimer = this.time.addEvent({
            delay: 1200,
            callback: () => this.spawnZombie(),
            loop: true
        })
    }

    spawnBlood(x: number, y: number) {
        const blood = this.bloodPool.getFree()
        blood.data.show(x, y)
        blood.data.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'blood', () => {
            blood.data.emit('blood')
        })

        blood.data.on('blood', () => {
            this.bloodPool.release(blood)
        })
    }

    createBlood(): Blood {
        return new Blood(this)
    }

    resetBlood(obj: PoolObject) {
        obj.data.hide()
        obj.free = true
    }

    createZombie(): Zombie {
        const { x, y } = getRandomZombiePosition(this.gameW, this.gameH)
        return new Zombie(this, x, y, this.player.bulletsPool)
    }

    resetZombies(obj: PoolObject): void {
        obj.free = true
        obj.data.hide()
    }

    spawnZombie(): void {
        const { x, y } = getRandomZombiePosition(this.gameW, this.gameH)
        const zombie = this.zombiePool.getFree()
        zombie.data.show(x, y)
        zombie.data.on('kill', () => {
            this.spawnBlood(zombie.data.x, zombie.data.y)
            this.zombiePool.release(zombie)
            this.player.updateKills()
            this.UI.updateKillsCounter(this.player.getKills())
        })

        zombie.data.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'zombie_attack', () => {
            zombie.data.emit('attack')
        })

        zombie.data.on('attack', () => {
            if (this.player.getHealth() > 0) {
                this.player.updateHealth()
                this.UI.updateHealthCounter(this.player.getHealth())
            } else {
                this.spawnBlood(this.player.x, this.player.y)
                this.player.hide()
                this.playerDead = true
                this.zombieTimer.destroy()
                setTimeout(() => {
                    this.scene.start('game_over', { kills: this.player.getKills() })
                }, 1);
            }
        })

        zombie.free = false
    }

    update(time: number, delta: number): void {
        if (!this.playerDead) {
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
}