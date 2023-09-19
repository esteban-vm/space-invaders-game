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

/**
 * @see {@link https://blog.e-mundo.de/post/typescript-tuple-trickery-utility-types-for-tuples/ |TypeScript Tuple Trickery - Utility Types for Tuples - eMundo Blog}
 */
export type ShiftTuple<T extends unknown[]> = T extends [T[0], ...infer R] ? R : never
