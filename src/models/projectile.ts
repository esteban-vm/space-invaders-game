import type { Game, Projectile } from '@/types'
import GameObject, { GraphicGameObject } from '@/game-object'

export class PlayerProjectile extends GameObject implements Projectile {
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

export class EnemyProjectile extends GraphicGameObject implements Projectile {
  public damage
  public free

  constructor(game: Game) {
    super(game, 'projectile')
    this.width = 50
    this.height = 35
    this.speed = Math.random() * 3 + 2
    this.frameX = Math.floor(Math.random() * 4)
    this.frameY = Math.floor(Math.random() * 2)
    this.damage = 1
    this.free = true
  }

  public draw() {
    if (!this.free) this.game.add(this)
  }

  public update() {
    if (!this.free) {
      this.y += this.speed
      if (this.y > this.game.height) this.free = true
    }
  }

  public start(x: number, y: number) {
    this.x = x - this.width * 0.5
    this.y = y
    this.free = false
  }
}
