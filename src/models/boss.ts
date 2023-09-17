import type { Game } from '@/types'
import GameObject from '@/game-object'

export default class Boss extends GameObject {
  constructor(game: Game) {
    super(game)
    this.resource = 'boss'
    this.width = 200
    this.height = 200
    this.x = this.game.width * 0.5 - this.width * 0.5
    this.y = -this.height
    this.speedX = Math.random() < 0.5 ? -1 : 1
    this.frameY = Math.floor(Math.random() * 4)
    this.maxFrame = 11
    this.lives = 10
    this.maxLives = this.lives
  }

  public draw() {
    this.game.stroke(this)
    this.game.add(this)
  }

  public update() {
    this.speedY = 0
    if (this.game.updated && this.lives > 0) this.frameX = 0
    if (this.y < 0) this.y += 4
    if (this.x < 0 || this.x > this.game.width - this.width) {
      this.speedX *= -1
      this.speedY = this.height * 0.5
    }
    this.x += this.speedX
    this.y += this.speedY
    // collision between boss and projectiles
    this.game.projectiles.forEach((projectile) => {
      if (!projectile.free && this.game.checkCollision(this, projectile) && this.lives > 0) {
        this.hit(1)
        projectile.free = true
      }
    })
    // boss destroyed
    if (this.lives < 1 && this.game.updated) {
      this.frameX++
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true
        this.game.score += this.maxLives
      }
    }
  }

  private hit(damage: number) {
    this.lives -= damage
    if (this.lives > 0) this.frameX = 1
  }
}
