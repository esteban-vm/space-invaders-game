import type { Game } from '@/types'
import GameObject from '@/game-object'

export default class Jets extends GameObject {
  constructor(game: Game) {
    super(game)
    this.resource = 'jets'
    this.width = this.game.playerSize.width
    this.height = this.game.playerSize.height
    this.frameX = 1
  }

  public draw() {
    this.game.add(this)
  }

  public update(x: number, y: number) {
    this.x = x
    this.y = y
  }
}
