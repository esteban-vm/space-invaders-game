import type { Game } from '@/types'
import GameObject from '@/game-object'

export default abstract class Enemy extends GameObject {
  private positionX
  private positionY
  protected image
  public markedForDeletion

  constructor(game: Game, x: number, y: number) {
    super(game)
    this.width = this.game.enemySize
    this.height = this.game.enemySize
    this.positionX = x
    this.positionY = y
    this.markedForDeletion = false
    this.image = new Image()
  }

  public draw() {
    this.game.context.strokeRect(this.x, this.y, this.width, this.height)
    this.game.context.drawImage(this.image, this.x, this.y)
  }

  public update(x: number, y: number) {
    this.x = x + this.positionX
    this.y = y + this.positionY
    // collision between enemy and projectiles
    this.game.projectiles.forEach((projectile) => {
      if (!projectile.free && this.game.checkCollision(this, projectile)) {
        projectile.free = true
        this.markedForDeletion = true
        if (!this.game.isOver) this.game.score++
      }
    })
    // collision between enemy and player
    if (this.game.checkCollision(this, this.game.player)) {
      this.markedForDeletion = true
      if (!this.game.isOver && this.game.score > 0) this.game.score--
      this.game.player.lives--
      if (this.game.player.lives < 1) this.game.isOver = true
    }
    // lose condition
    if (this.y + this.height > this.game.height) {
      this.game.isOver = true
      this.markedForDeletion = true
    }
  }
}

export class Beetlemorph extends Enemy {
  constructor(...params: ConstructorParameters<typeof Enemy>) {
    super(...params)
    this.image.src = 'assets/beetlemorph.png'
  }
}
