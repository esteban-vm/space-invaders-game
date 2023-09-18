export type * from '@/models'
export type { default as Game } from '@/game'
export type ControlKey = '1' | '2' | '3' | `Arrow${'Right' | 'Left'}`

export type ResourceFilename =
  | 'player'
  | 'jets'
  | 'boss'
  | 'projectile'
  | `${'beetle' | 'eagle' | 'rhino' | 'squid'}morph`

export interface Projectile {
  damage: number
  free: boolean
  start(x: number, y: number): void
}
