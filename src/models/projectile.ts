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
    this.damage = 1
    this.free = true
    this.create()
  }

  public start(x: number, y: number) {
    this.x = x - this.width * 0.5
    this.y = y
    this.free = false
    this.create()
  }

  public draw() {
    if (!this.free) this.game.add(this)
  }

  public update() {
    if (!this.free) {
      this.y += this.speed
      if (this.y > this.game.height) this.free = true
      // collision between enemy projectile and player
      if (this.game.checkCollision(this, this.game.player)) {
        this.free = true
        this.game.player.health--
        if (!this.game.player.alive) this.game.isOver = true
      }
      // collision between enemy projectile and player projectile
      this.game.projectiles.forEach((projectile) => {
        if (!projectile.free && this.game.checkCollision(this, projectile)) {
          this.hit(projectile.damage)
          projectile.free = true
          if (!this.alive) this.free = true
        }
      })
    }
  }

  public hit(damage: number) {
    super.hit(damage)
    this.speed *= 0.6
  }

  private create() {
    this.speed = Math.random() * 3 + 2
    this.frameX = Math.floor(Math.random() * 4)
    this.frameY = Math.floor(Math.random() * 2)
    this.health = 5
  }
}
