import type { Game, Enemy } from '@/types'
import GameObject from '@/game-object'
import { Beetlemorph } from '@/enemy'

export default class Wave extends GameObject {
  private speedX
  private speedY
  public nextTrigger
  public enemies: Enemy[]

  constructor(game: Game) {
    super(game)
    this.width = this.game.columns * this.game.enemySize
    this.height = this.game.rows * this.game.enemySize
    this.y = -this.height
    this.speedX = 3
    this.speedY = 0
    this.nextTrigger = false
    this.enemies = []
    this.create()
  }

  public draw() {
    this.enemies.forEach((enemy) => enemy.draw())
  }

  public update() {
    if (this.y < 0) this.y += 5
    this.speedY = 0
    if (this.x < 0 || this.x > this.game.width - this.width) {
      this.speedX *= -1
      this.speedY = this.game.enemySize
    }
    this.x += this.speedX
    this.y += this.speedY
    this.enemies.forEach((enemy) => enemy.update(this.x, this.y))
    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion)
  }

  private create() {
    for (let y = 0; y < this.game.rows; y++) {
      for (let x = 0; x < this.game.columns; x++) {
        const enemyX = x * this.game.enemySize
        const enemyY = y * this.game.enemySize
        this.enemies.push(new Beetlemorph(this.game, enemyX, enemyY))
      }
    }
  }
}
