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
      if (!projectile.free && this.game.checkCollision(this, projectile) && this.alive) {
        this.hit(projectile.damage)
        projectile.free = true
      }
    })
    // enemy destroyed
    if (!this.alive) {
      if (this.game.updated) this.frameX++
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true
        if (!this.game.isOver) this.game.score += this.maxHealth
      }
    }
    // collision between enemy and player
    if (this.game.checkCollision(this, this.game.player) && this.alive) {
      this.health = 0
      this.game.player.health--
    }
    // lose condition
    if (this.y + this.height > this.game.height || !this.game.player.alive) {
      this.game.isOver = true
    }
  }

  public hit(damage: number) {
    this.health -= damage
  }
}

export class Beetlemorph extends Enemy {
  constructor(...params: [game: Game, x: number, y: number]) {
    super('beetlemorph', ...params)
    this.health = 1
    this.maxHealth = this.health
    this.maxFrame = 2
  }
}

export class Rhinomorph extends Enemy {
  constructor(...params: [game: Game, x: number, y: number]) {
    super('rhinomorph', ...params)
    this.health = 4
    this.maxHealth = this.health
    this.maxFrame = 5
  }

  public hit(damage: number) {
    super.hit(damage)
    this.frameX = this.maxHealth - Math.floor(this.health)
  }
}

export class Eaglemorph extends Enemy {
  private shoots

  constructor(...params: [game: Game, x: number, y: number]) {
    super('eaglemorph', ...params)
    this.health = 4
    this.maxHealth = this.health
    this.maxFrame = 8
    this.shoots = 0
  }

  public hit(damage: number) {
    super.hit(damage)
    this.frameX = this.maxHealth - Math.floor(this.health)
    this.y += 3
    if (this.shoots < 4) this.shoot()
  }

  public shoot() {
    const projectile = this.game.getEnemyProjectile()
    if (projectile) {
      projectile.start(this.x + this.width * 0.5, this.y + this.height * 0.5)
      this.shoots++
    }
  }
}
