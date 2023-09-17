import type { Game } from '@/types'
import { GraphicGameObject } from '@/game-object'

export default class Boss extends GraphicGameObject {
  constructor(game: Game) {
    super(game, 'boss')
    this.width = 200
    this.height = 200
    this.x = this.game.width * 0.5 - this.width * 0.5
    this.y = -this.height
    this.speedX = Math.random() < 0.5 ? -1 : 1
    this.frameY = Math.floor(Math.random() * 4)
    this.maxFrame = 11
    this.health = 10
    this.maxHealth = this.health
  }

  public draw() {
    this.game.stroke(this)
    this.game.add(this)
  }

  public update() {
    this.speedY = 0
    if (this.game.updated && this.alive) this.frameX = 0
    if (this.y < 0) this.y += 4
    if (this.x < 0 || (this.x > this.game.width - this.width && this.alive)) {
      this.speedX *= -1
      this.speedY = this.height * 0.5
    }
    this.x += this.speedX
    this.y += this.speedY
    // collision between boss and projectiles
    this.game.projectiles.forEach((projectile) => {
      if (!projectile.free && this.game.checkCollision(this, projectile) && this.alive && this.y >= 0) {
        this.hit(projectile.damage)
        projectile.free = true
      }
    })
    // boss destroyed
    if (!this.alive && this.game.updated) {
      this.frameX++
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true
        if (!this.game.isOver) {
          this.game.score += this.maxHealth
          this.game.newWave()
        }
      }
    }
    // collision between boss and player
    if (this.game.checkCollision(this, this.game.player) && this.alive) {
      this.game.isOver = true
      this.health = 0
    }
    // lose condition
    if (this.y + this.height > this.game.height) this.game.isOver = true
  }

  public hit(damage: number) {
    this.health -= damage
    if (this.alive) this.frameX = 1
  }
}
