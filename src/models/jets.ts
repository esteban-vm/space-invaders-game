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

  public update() {
    if (this.game.isPressed('ArrowLeft')) this.frameX = 0
    else if (this.game.isPressed('ArrowRight')) this.frameX = 2
    else this.frameX = 1
    this.x = this.game.player.x
    this.y = this.game.player.y
  }
}
