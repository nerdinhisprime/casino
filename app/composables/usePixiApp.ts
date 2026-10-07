import { Application } from 'pixi.js'

export function usePixiApp() {
  const app = shallowRef<Application | null>(null)

  const init = async (canvasContainer: HTMLElement) => {
    const pixiApp = new Application()

    await pixiApp.init({
      resizeTo: canvasContainer,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })

    canvasContainer.appendChild(pixiApp.canvas)
    app.value = pixiApp
    return pixiApp
  }

  const destroy = () => {
    app.value?.destroy(true, { children: true, texture: true })
    app.value = null
  }

  return { app, init, destroy }
}
