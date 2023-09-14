import type { Game } from '@/types'

export default abstract class GameObject {
  protected game
  public width
  public height
  public x
  public y
  protected speed

  constructor(game: Game) {
    this.game = game
    this.width = 0
    this.height = 0
    this.x = 0
    this.y = 0
    this.speed = 0
  }

  public abstract draw(): void
  public abstract update(x: number, y: number): void
}
