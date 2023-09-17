import type { Game } from '@/types'
import GameObject from '@/game-object'

export default abstract class Laser extends GameObject {
  protected damage

  constructor(game: Game) {
    super(game)
    this.height = this.game.height - 50
    this.damage = 0
  }

  public draw() {
    this.game.fill(this)
    this.game.player.energy -= this.damage
    if (this.game.updated) {
      this.game.waves.forEach((wave) => {
        wave.enemies.forEach((enemy) => {
          if (this.game.checkCollision(this, enemy)) {
            enemy.hit(this.damage)
          }
        })
      })
      this.game.bosses.forEach((boss) => {
        if (this.game.checkCollision(this, boss) && boss.y >= 0) {
          boss.hit(this.damage)
        }
      })
    }
  }

  public update() {
    this.x = this.game.player.x + this.game.player.width * 0.5 - this.width * 0.5
  }

  protected get cannotDraw() {
    return !(this.game.player.energy > 1 && !this.game.player.cooldown)
  }
}

export class SmallLaser extends Laser {
  constructor(game: Game) {
    super(game)
    this.width = 5
    this.damage = 0.2
  }

  public draw() {
    if (this.cannotDraw) return
    super.draw()
    this.game.player.frameX = 2
  }
}

export class LargeLaser extends Laser {
  constructor(game: Game) {
    super(game)
    this.width = 25
    this.damage = 0.7
  }

  public draw() {
    if (this.cannotDraw) return
    super.draw()
    this.game.player.frameX = 3
  }
}
