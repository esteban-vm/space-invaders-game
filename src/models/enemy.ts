import type { Game, ResourceFilename } from '@/types'
import { GraphicGameObject } from '@/game-object'

export default abstract class Enemy extends GraphicGameObject {
  constructor(filename: ResourceFilename, game: Game, x: number, y: number) {
    super(game, filename)
    this.width = this.game.enemySize
    this.height = this.game.enemySize
    this.originX = x
    this.originY = y
    this.frameY = Math.floor(Math.random() * 4)
  }

  public draw() {
    this.game.stroke(this)
    this.game.add(this)
  }

  public update(x: number, y: number) {
    this.x = x + this.originX
    this.y = y + this.originY
    // collision between enemy and projectiles
    this.game.projectiles.forEach((projectile) => {
      if (!projectile.free && this.game.checkCollision(this, projectile) && this.lives > 0) {
        this.hit(1)
        projectile.free = true
      }
    })
    // enemy destroyed
    if (this.lives < 1) {
      if (this.game.updated) this.frameX++
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true
        if (!this.game.isOver) this.game.score += this.maxLives
      }
    }
    // collision between enemy and player
    if (this.game.checkCollision(this, this.game.player) && this.lives > 0) {
      this.lives = 0
      this.game.player.lives--
    }
    // lose condition
    if (this.y + this.height > this.game.height || this.game.player.lives < 1) {
      this.game.isOver = true
    }
  }

  protected hit(damage: number) {
    this.lives -= damage
  }
}

export class Beetlemorph extends Enemy {
  constructor(...params: [game: Game, x: number, y: number]) {
    super('beetlemorph', ...params)
    this.lives = 1
    this.maxLives = this.lives
    this.maxFrame = 2
  }
}

export class Rhinomorph extends Enemy {
  constructor(...params: [game: Game, x: number, y: number]) {
    super('rhinomorph', ...params)
    this.lives = 4
    this.maxLives = this.lives
    this.maxFrame = 5
  }

  protected hit(damage: number) {
    super.hit(damage)
    this.frameX = this.maxLives - Math.floor(this.lives)
  }
}
