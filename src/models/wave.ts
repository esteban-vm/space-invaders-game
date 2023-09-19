import type { Game, Enemy, DefinedEnemyParams } from '@/types'
import GameObject from '@/game-object'
import { Beetlemorph, Eaglemorph, Rhinomorph, Squidmorph } from '@/enemy'

export default class Wave extends GameObject {
  public nextTrigger
  public enemies

  constructor(game: Game) {
    super(game)
    this.width = this.game.columns * this.game.enemySize
    this.height = this.game.rows * this.game.enemySize
    this.x = this.game.width * 0.5 - this.width * 0.5
    this.y = -this.height
    this.speedX = Math.random() < 0.5 ? -1 : 1
    this.speedY = 0
    this.nextTrigger = false
    this.enemies = <Enemy[]>[]
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
    if (this.enemies.length <= 0) this.markedForDeletion = true
  }

  private create() {
    for (let y = 0; y < this.game.rows; y++) {
      for (let x = 0; x < this.game.columns; x++) {
        const enemyParams: DefinedEnemyParams = [this.game, x * this.game.enemySize, y * this.game.enemySize]
        const randomize = Math.random()
        if (randomize < 0.25) this.enemies.push(new Squidmorph(...enemyParams))
        else if (randomize < 0.5) this.enemies.push(new Eaglemorph(...enemyParams))
        else if (randomize < 0.7) this.enemies.push(new Rhinomorph(...enemyParams))
        else this.enemies.push(new Beetlemorph(...enemyParams))
      }
    }
  }
}
