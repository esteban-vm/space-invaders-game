import type { Game } from '@/types'
import GameObject from '@/game-object'

export default abstract class Laser extends GameObject {
  constructor(game: Game) {
    super(game)
    this.height = this.game.height - 50
  }

  public draw() {
    this.game.fill(this)
  }

  public update() {
    this.x = this.game.player.x + this.game.player.width * 0.5 - this.width * 0.5
  }
}

export class SmallLaser extends Laser {
  constructor(game: Game) {
    super(game)
    this.width = 5
  }

  // public draw() {
  //   super.draw()
  // }

  // public update() {
  //   super.update()
  // }
}

export class BigLaser extends Laser {
  constructor(game: Game) {
    super(game)
  }
}
