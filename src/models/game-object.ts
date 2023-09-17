import type { Game, ResourceFilename } from '@/types'

export default abstract class GameObject {
  protected game
  public width
  public height
  public originX
  public originY
  public x
  public y
  public speedX
  public speedY
  public speed
  public markedForDeletion

  constructor(game: Game) {
    this.game = game
    this.width = 0
    this.height = 0
    this.originX = 0
    this.originY = 0
    this.x = 0
    this.y = 0
    this.speedX = 0
    this.speedY = 0
    this.speed = 0
    this.markedForDeletion = false
  }

  public abstract draw(): void
  public abstract update(x: number, y: number): void
}

export abstract class GraphicGameObject extends GameObject {
  public frameX
  public frameY
  public maxFrame
  public lives
  public maxLives
  public image

  constructor(game: Game, filename: ResourceFilename) {
    super(game)
    this.frameX = 0
    this.frameY = 0
    this.maxFrame = 0
    this.lives = 0
    this.maxLives = 0
    this.image = new Image()
    this.image.src = `assets/${filename}.png`
  }
}
