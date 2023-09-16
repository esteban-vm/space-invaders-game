import type { Game } from '@/types'
import GameObject from '@/game-object'

export default abstract class Enemy extends GameObject {
  constructor(game: Game, x: number, y: number) {
    super(game)
    this.width = this.game.enemySize
    this.height = this.game.enemySize
    this.originX = x
    this.originY = y
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
    if (this.lives < 1) {
      if (this.game.updated) this.frameX++
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true
        if (!this.game.isOver) this.game.score += this.maxLives
      }
    }
    // collision between enemy and player
    if (this.game.checkCollision(this, this.game.player) && this.lives > 0) {
      // this.markedForDeletion = true
      // if (!this.game.isOver && this.game.score > 0) this.game.score--
      this.lives = 0
      this.game.player.lives--
      // if (this.game.player.lives < 1) this.game.isOver = true
    }
    // lose condition
    if (this.y + this.height > this.game.height || this.game.player.lives < 1) {
      this.game.isOver = true
      // this.markedForDeletion = true
    }
  }

  protected hit(damage: number) {
    this.lives -= damage
  }
}

export class Beetlemorph extends Enemy {
  constructor(...params: ConstructorParameters<typeof Enemy>) {
    super(...params)
    this.resource = 'beetlemorph'
    this.frameY = Math.floor(Math.random() * 4)
    this.maxFrame = 2
    this.lives = 1
    this.maxLives = this.lives
  }
}

export class Rhinomorph extends Enemy {
  constructor(...params: ConstructorParameters<typeof Enemy>) {
    super(...params)
    this.resource = 'rhinomorph'
    this.frameY = Math.floor(Math.random() * 4)
    this.maxFrame = 5
    this.lives = 4
    this.maxLives = this.lives
  }

  protected hit(damage: number) {
    super.hit(damage)
    this.frameX = this.maxLives - Math.floor(this.lives)
  }
}
