import type { Game } from '@/types'
import { GraphicGameObject } from '@/game-object'

export default class Jets extends GraphicGameObject {
  constructor(game: Game) {
    super(game, 'jets')
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
