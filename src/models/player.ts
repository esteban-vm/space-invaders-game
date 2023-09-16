import type { Game } from '@/types'
import GameObject from '@/game-object'
import Jets from '@/jets'

export default class Player extends GameObject {
  private jets

  constructor(game: Game) {
    super(game)
    this.resource = 'player'
    this.width = this.game.playerSize.width
    this.height = this.game.playerSize.height
    this.speed = 5
    this.jets = new Jets(this.game)
    this.start()
  }

  public start() {
    this.x = this.game.width * 0.5 - this.width * 0.5
    this.y = this.game.height - this.height
    this.lives = 3
    this.maxLives = 10
  }

  public draw() {
    if (this.game.isPressed('Enter')) this.frameX = 1
    else this.frameX = 0
    if (this.game.debug) this.game.fill(this)
    this.jets.draw()
    this.game.add(this)
  }

  public update() {
    // horizontal movement
    if (this.game.isPressed('ArrowLeft')) {
      this.x -= this.speed
      this.jets.frameX = 0
    } else if (this.game.isPressed('ArrowRight')) {
      this.x += this.speed
      this.jets.frameX = 2
    } else {
      this.jets.frameX = 1
    }
    // horizontal boundaries
    const left = -this.width * 0.5
    const right = this.game.width - this.width * 0.5
    if (this.x < left) this.x = left
    else if (this.x > right) this.x = right
    this.jets.update(this.x, this.y)
  }

  public shoot() {
    const projectile = this.game.getProjectile()
    if (projectile) {
      projectile.start(this.x + this.width * 0.5, this.y)
    }
  }
}
