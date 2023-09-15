import type { GameObject } from '@/types'
import { Player, Projectile, Wave } from '@/models'

export default class Game {
  private canvas
  public width
  public height
  public context
  public keys: string[]
  public enemySize
  public player
  public projectiles: Projectile[]
  public columns!: number
  public rows!: number
  public score!: number
  public isOver!: boolean
  private waves!: Wave[]
  private fired
  private maxProjectiles
  private waveCount!: number
  public updated
  private timer
  private interval

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.width = 600
    this.height = 800
    this.context = this.canvas.getContext('2d')!
    this.stylize()
    this.keys = []
    this.enemySize = 80
    this.player = new Player(this)
    this.fired = false
    this.projectiles = []
    this.maxProjectiles = 10
    this.updated = false
    this.timer = 0
    this.interval = 120
    this.start()
    this.createProjectiles()
    window.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('keyup', this.handleKeyup)
  }

  private stylize() {
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.context.fillStyle = 'aliceblue'
    this.context.strokeStyle = 'aliceblue'
    this.context.lineWidth = 5
    this.context.font = '30px Impact'
  }

  private start() {
    this.columns = 2
    this.rows = 2
    this.score = 0
    this.isOver = false
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
      this.projectiles.push(new Projectile(this))
    }
  }

  private showStatus() {
    this.context.save()
    this.context.shadowOffsetX = 2
    this.context.shadowOffsetY = 2
    this.context.shadowColor = 'black'
    this.context.fillText(`Score: ${this.score}`, 20, 40)
    this.context.fillText(`Wave: ${this.waveCount}`, 20, 80)
    for (let live = 0; live < this.player.lives; live++) {
      this.context.fillRect(20 + 10 * live, 100, 5, 20)
    }
    if (this.isOver) {
      this.context.textAlign = 'center'
      this.context.font = '100px Impact'
      this.context.fillText('GAME OVER!', this.width * 0.5, this.height * 0.5)
      this.context.font = '20px Impact'
      this.context.fillText('Press "R" to restart!', this.width * 0.5, this.height * 0.5 + 30)
    }
    this.context.restore()
  }

  private newWave() {
    if (Math.random() < 0.5 && this.columns * this.enemySize < this.width * 0.8) {
      this.columns++
    } else if (this.rows * this.enemySize < this.height * 0.6) {
      this.rows++
    }
    this.waves.push(new Wave(this))
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
    this.player.draw()
    this.player.update()
    this.projectiles.forEach((projectile) => {
      projectile.draw()
      projectile.update()
    })
    this.waves.forEach((wave) => {
      wave.draw()
      wave.update()
      if (wave.enemies.length < 1 && !wave.nextTrigger && !this.isOver) {
        this.newWave()
        this.waveCount++
        this.player.lives++
        wave.nextTrigger = true
      }
    })
  }

  public getProjectile() {
    for (const projectile of this.projectiles) {
      if (projectile.free) return projectile
    }
  }

  public checkCollision(a: GameObject, b: GameObject) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !this.fired) this.player.shoot()
    this.fired = true
    if (this.keys.indexOf(event.key) === -1) this.keys.push(event.key)
    if (event.key === 'r' && this.isOver) this.restart()
  }

  private handleKeyup = (event: KeyboardEvent) => {
    this.fired = false
    const index = this.keys.indexOf(event.key)
    if (index > -1) this.keys.splice(index, 1)
  }
}
