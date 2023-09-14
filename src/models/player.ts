import type { Game } from '@/types'
import GameObject from '@/game-object'

export default class Player extends GameObject {
  public lives

  constructor(game: Game) {
    super(game)
    this.width = 100
    this.height = 100
    this.x = this.game.width * 0.5 - this.width * 0.5
    this.y = this.game.height - this.height
    this.speed = 10
    this.lives = 3
  }

  public draw() {
    this.game.context.fillRect(this.x, this.y, this.width, this.height)
  }

  public update() {
    // horizontal movement
    if (this.game.keys.indexOf('ArrowLeft') > -1) this.x -= this.speed
    if (this.game.keys.indexOf('ArrowRight') > -1) this.x += this.speed
    // horizontal boundaries
    const left = -this.width * 0.5
    const right = this.game.width - this.width * 0.5
    if (this.x < left) this.x = left
    else if (this.x > right) this.x = right
  }

  public shoot() {
    const projectile = this.game.getProjectile()
    if (projectile) {
      projectile.start(this.x + this.width * 0.5, this.y)
    }
  }
}
