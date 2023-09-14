import '@/main.css'
import Game from '@/game'

window.addEventListener('load', function () {
  const canvas = this.document.querySelector('canvas')!
  const game = new Game(canvas)

  const animate = () => {
    game.render()
    this.requestAnimationFrame(animate)
  }

  animate()
})
