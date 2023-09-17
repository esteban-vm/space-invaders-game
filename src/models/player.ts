import type { Game } from '@/types'
import { GraphicGameObject } from '@/game-object'
import Jets from '@/jets'
import { LargeLaser, SmallLaser } from '@/laser'

export default class Player extends GraphicGameObject {
  private jets
  private smLaser
  private lgLaser

  constructor(game: Game) {
    super(game, 'player')
    this.width = this.game.playerSize.width
    this.height = this.game.playerSize.height
    this.speed = 5
    this.jets = new Jets(this.game)
    this.smLaser = new SmallLaser(this.game)
    this.lgLaser = new LargeLaser(this.game)
    this.start()
  }

  public start() {
    this.x = this.game.width * 0.5 - this.width * 0.5
    this.y = this.game.height - this.height
    this.lives = 3
    this.maxLives = 10
  }

  public draw() {
    if (this.game.isPressed('1')) {
      this.frameX = 1
    } else if (this.game.isPressed('2')) {
      this.frameX = 2
      this.smLaser.draw()
    } else if (this.game.isPressed('3')) {
      this.frameX = 3
      this.lgLaser.draw()
    } else {
      this.frameX = 0
    }
    this.jets.draw()
    this.game.stroke(this)
    this.game.add(this)
  }

  public update() {
    // horizontal movement
    if (this.game.isPressed('ArrowLeft')) this.x -= this.speed
    else if (this.game.isPressed('ArrowRight')) this.x += this.speed
    // horizontal boundaries
    const left = -this.width * 0.5
    const right = this.game.width - this.width * 0.5
    if (this.x < left) this.x = left
    else if (this.x > right) this.x = right
    this.jets.update()
    this.smLaser.update()
    this.lgLaser.update()
  }

  public shoot() {
    const projectile = this.game.getProjectile()
    if (projectile) {
      projectile.start(this.x + this.width * 0.5, this.y)
    }
  }
}
