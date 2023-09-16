import type { Game, ResourceFilename } from '@/types'

export default abstract class GameObject {
  protected game
  public width
  public height
  public originX
  public originY
  public x
  public y
  public frameX
  public frameY
  public maxFrame
  public speedX
  public speedY
  public speed
  public lives
  public maxLives
  public markedForDeletion
  private spritesheet

  constructor(game: Game) {
    this.game = game
    this.width = 0
    this.height = 0
    this.originX = 0
    this.originY = 0
    this.x = 0
    this.y = 0
    this.frameX = 0
    this.frameY = 0
    this.maxFrame = 0
    this.speedX = 0
    this.speedY = 0
    this.speed = 0
    this.lives = 0
    this.maxLives = 0
    this.markedForDeletion = false
    this.spritesheet = new Image()
  }

  public abstract draw(): void
  public abstract update(x: number, y: number): void

  protected set resource(filename: ResourceFilename) {
    this.spritesheet.src = `assets/${filename}.png`
  }

  public get image() {
    return this.spritesheet
  }
}
