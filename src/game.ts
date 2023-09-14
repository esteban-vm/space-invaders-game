import type { GameObject } from '@/types'
import { Player, Projectile, Wave } from '@/models'

export default class Game {
  private canvas
  public width
  public height
  public context
  public keys: string[]
  public columns
  public rows
  public enemySize
  public score
  public isOver
  public player
  public projectiles: Projectile[]
  private waves: Wave[]
  private numberOfProjectiles
  private numberOfWaves

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.width = 600
    this.height = 800
    this.context = this.canvas.getContext('2d')!
    this.stylize()
    this.keys = []
    this.columns = 2
    this.rows = 2
    this.enemySize = 60
    this.score = 0
    this.isOver = false
    this.player = new Player(this)
    this.projectiles = []
    this.waves = []
    this.waves.push(new Wave(this))
    this.numberOfProjectiles = 10
    this.numberOfWaves = 1
    this.createProjectiles()
    window.addEventListener('keydown', this.handleKeydown)
    window.addEventListener('keyup', this.handleKeyup)
  }

  public render() {
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
        this.numberOfWaves++
        this.player.lives++
        wave.nextTrigger = true
      }
    })
  }

  private stylize() {
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.context.fillStyle = 'aliceblue'
    this.context.strokeStyle = 'aliceblue'
    this.context.lineWidth = 5
    this.context.font = '30px Impact'
  }

  private createProjectiles() {
    for (let projectile = 1; projectile <= this.numberOfProjectiles; projectile++) {
      this.projectiles.push(new Projectile(this))
    }
  }

  private showStatus() {
    this.context.save()
    this.context.shadowOffsetX = 2
    this.context.shadowOffsetY = 2
    this.context.shadowColor = 'black'
    this.context.fillText(`Score: ${this.score}`, 20, 40)
    this.context.fillText(`Wave: ${this.numberOfWaves}`, 20, 80)
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

  public getProjectile() {
    for (const projectile of this.projectiles) {
      if (projectile.free) return projectile
    }
  }

  public checkCollision(a: GameObject, b: GameObject) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
  }

  private newWave() {
    if (Math.random() < 0.5 && this.columns * this.enemySize < this.width * 0.8) {
      this.columns++
    } else if (this.rows * this.enemySize < this.height * 0.6) {
      this.rows++
    }
    this.waves.push(new Wave(this))
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (this.keys.indexOf(event.key) === -1) this.keys.push(event.key)
    if (event.key === 'Enter') this.player.shoot()
  }

  private handleKeyup = (event: KeyboardEvent) => {
    const index = this.keys.indexOf(event.key)
    if (index > -1) this.keys.splice(index, 1)
  }
}
