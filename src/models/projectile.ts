import type { Game } from '@/types'
import GameObject from '@/game-object'

export default class Projectile extends GameObject {
  public damage
  public free

  constructor(game: Game) {
    super(game)
    this.width = 3
    this.height = 40
    this.speed = 20
    this.damage = 1
    this.free = true
  }

  public draw() {
    if (!this.free) this.game.fill(this)
  }

  public update() {
    if (!this.free) {
      this.y -= this.speed
      if (this.y < -this.height) this.free = true
    }
  }

  public start(x: number, y: number) {
    this.x = x - this.width * 0.5
    this.y = y
    this.free = false
  }
}
