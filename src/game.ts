import type { GameObject, GraphicGameObject, ControlKey } from '@/types'
import { Player, Boss, PlayerProjectile, EnemyProjectile, Wave } from '@/models'

export default class Game {
  private canvas
  private context
  private debug!: boolean
  public width!: number
  public height!: number
  public enemySize!: number
  public playerSize!: { width: number; height: number }
  public player!: Player
  public updated!: boolean
  public fired!: boolean
  public keys!: string[]
  public projectiles!: PlayerProjectile[]
  public maxProjectiles!: number
  public enemyProjectiles!: EnemyProjectile[]
  public maxEnemyProjectiles!: number
  public timer!: number
  public interval!: number
  public columns!: number
  public rows!: number
  public score!: number
  public isOver!: boolean
  public bosses!: Boss[]
  public waves!: Wave[]
  public waveCount!: number

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')!
    this.init()
  }

  private init() {
    this.debug = import.meta.env.DEV
    this.width = 600
    this.height = 800
    this.enemySize = 80
    this.playerSize = { width: 140, height: 120 }
    this.player = new Player(this)
    this.updated = false
    this.fired = false
    this.keys = []
    this.projectiles = []
    this.maxProjectiles = 10
    this.enemyProjectiles = []
    this.maxEnemyProjectiles = 10
    this.timer = 0
    this.interval = 120
    this.start()
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.createProjectiles()
    this.createEnemyProjectiles()
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleKeyup = this.handleKeyup.bind(this)
    window.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('keyup', this.handleKeyup)
  }

  private start() {
    this.columns = 2
    this.rows = 2
    this.score = 0
    this.isOver = false
    this.bosses = []
    // this.bosses.push(new Boss(this))
    this.waves = []
    this.waves.push(new Wave(this))
    this.waveCount = 1
  }

  private restart() {
    this.start()
    this.player.start()
  }

  private createProjectiles() {
    for (let projectile = 1; projectile <= this.maxProjectiles; projectile++) {
      this.projectiles.push(new PlayerProjectile(this))
    }
  }

  private createEnemyProjectiles() {
    for (let projectile = 1; projectile <= this.maxEnemyProjectiles; projectile++) {
      this.enemyProjectiles.push(new EnemyProjectile(this))
    }
  }

  private showStatus() {
    this.context.save()
    this.context.font = '30px Impact'
    this.context.fillStyle = 'aliceblue'
    this.context.strokeStyle = 'aliceblue'
    this.context.shadowOffsetX = 2
    this.context.shadowOffsetY = 2
    this.context.shadowColor = 'black'
    this.context.fillText(`Score: ${this.score}`, 20, 40)
    this.context.fillText(`Wave: ${this.waveCount}`, 20, 80)
    for (let unit = 0; unit < this.player.maxHealth; unit++) {
      this.context.strokeRect(20 + 20 * unit, 100, 10, 15)
    }
    for (let unit = 0; unit < this.player.health; unit++) {
      this.context.fillRect(20 + 20 * unit, 100, 10, 15)
    }
    this.context.save()
    this.context.fillStyle = this.player.cooldown ? 'red' : 'gold'
    for (let unit = 0; unit < this.player.energy; unit++) {
      this.context.fillRect(20 + 2 * unit, 130, 2, 15)
    }
    this.context.restore()
    if (this.isOver) {
      this.context.textAlign = 'center'
      this.context.font = '100px Impact'
      this.context.fillText('GAME OVER!', this.width * 0.5, this.height * 0.5)
      this.context.font = '20px Impact'
      this.context.fillText('Press "R" to restart!', this.width * 0.5, this.height * 0.5 + 30)
    }
    this.context.restore()
  }

  private toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen()
    else document.exitFullscreen()
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === '1' && !this.fired) this.player.shoot()
    if (event.key === 'r' && this.isOver) this.restart()
    if (event.key === 'd') this.debug = !this.debug
    if (event.key === 'f') this.toggleFullscreen()
    if (this.keys.indexOf(event.key) === -1) this.keys.push(event.key)
    this.fired = true
  }

  private handleKeyup(event: KeyboardEvent) {
    const index = this.keys.indexOf(event.key)
    if (index > -1) this.keys.splice(index, 1)
    this.fired = false
  }

  public newWave() {
    this.waveCount++
    if (this.player.health < this.player.maxHealth) this.player.health++
    if (this.waveCount % 2 === 0) {
      this.bosses.push(new Boss(this))
    } else {
      if (Math.random() < 0.5 && this.columns * this.enemySize < this.width * 0.8) {
        this.columns++
      } else if (this.rows * this.enemySize < this.height * 0.6) {
        this.rows++
      }
      this.waves.push(new Wave(this))
    }
    this.waves = this.waves.filter((wave) => !wave.markedForDeletion)
    this.bosses = this.bosses.filter((boss) => !boss.markedForDeletion)
  }

  public getProjectile() {
    for (const projectile of this.projectiles) {
      if (projectile.free) return projectile
    }
  }

  public getEnemyProjectile() {
    for (const projectile of this.enemyProjectiles) {
      if (projectile.free) return projectile
    }
  }

  public isPressed(key: ControlKey) {
    return this.keys.indexOf(key) > -1
  }

  public add(obj: GraphicGameObject) {
    const { image, x, y, frameX, frameY, width, height } = obj
    this.context.drawImage(image, frameX * width, frameY * height, width, height, x, y, width, height)
  }

  public fill(obj: GameObject) {
    const { x, y, width, height } = obj
    this.context.save()
    this.context.fillStyle = 'gold'
    this.context.fillRect(x, y, width, height)
    this.context.fillStyle = 'white'
    this.context.fillRect(x + width * 0.2, y, width * 0.6, height)
    this.context.restore()
  }

  public stroke(obj: GraphicGameObject) {
    const { x, y, width, height, health } = obj
    if (this.debug && health > 0) {
      this.context.save()
      this.context.strokeRect(x, y, width, height)
      this.context.font = '25px Impact'
      this.context.fillStyle = 'aliceblue'
      this.context.textAlign = 'center'
      this.context.shadowOffsetX = 3
      this.context.shadowOffsetY = 3
      this.context.shadowColor = 'black'
      this.context.fillText(health.toFixed(1).replace(/\.0$/, ''), x + width, y + 10)
      this.context.restore()
    }
  }

  public checkCollision(a: GameObject, b: GameObject) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
  }

  public render(delta: number) {
    if (this.timer > this.interval) {
      this.updated = true
      this.timer = 0
    } else {
      this.updated = false
      this.timer += delta
    }
    this.context.clearRect(0, 0, this.width, this.height)
    this.showStatus()
    this.projectiles.forEach((projectile) => {
      projectile.draw()
      projectile.update()
    })
    this.enemyProjectiles.forEach((projectile) => {
      projectile.draw()
      projectile.update()
    })
    this.bosses.forEach((boss) => {
      boss.draw()
      boss.update()
    })
    this.waves.forEach((wave) => {
      wave.draw()
      wave.update()
      if (wave.enemies.length < 1 && !wave.nextTrigger && !this.isOver) {
        this.newWave()
        wave.nextTrigger = true
      }
    })
    this.player.draw()
    this.player.update()
  }
}
