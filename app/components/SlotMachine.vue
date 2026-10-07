<script setup lang="ts">
import { Application, Sprite, Container, Texture, Graphics, Text } from 'pixi.js'

interface Reel {
  container: Container
  symbols: Sprite[]
  position: number
  targetPosition: number
  startPosition: number
  spinStartTime: number
  duration: number
  isSpinning: boolean
  strip: number[]
}
interface SpinResult {
  symbols: number[]
  winAmount: number
}

const containerRef = ref<HTMLElement | null>(null)
let app: Application | null = null

const spinning = ref(false)
const winAmount = ref<number | null>(null)
const lastWinSymbol = ref<string | null>(null)

const SYMBOL_SIZE = 120
const REEL_COUNT = 3
const VISIBLE_SYMBOLS = 3

const SYMBOL_LABELS = ['7', 'BAR', '🍒', '🍋']
const SYMBOL_COLORS = [0xe74c3c, 0xf1c40f, 0x2ecc71, 0x3498db]

let reels: Reel[] = []
let textures: Texture[] = []
let lastResult: { symbolIndex: number; winAmount: number } | null = null
let reelsStarted = false

function createPlaceholderTextures(pixiApp: Application): Texture[] {
  return SYMBOL_COLORS.map((color, i) => {
    const g = new Graphics()
    g.roundRect(0, 0, SYMBOL_SIZE, SYMBOL_SIZE, 12)
    g.fill(color)

    const text = new Text({
      text: SYMBOL_LABELS[i],
      style: { fontSize: 36, fill: 0xffffff, fontWeight: 'bold' },
    })
    text.anchor.set(0.5)
    text.x = SYMBOL_SIZE / 2
    text.y = SYMBOL_SIZE / 2
    g.addChild(text)

    const texture = pixiApp.renderer.generateTexture(g)
    g.destroy(true)
    return texture
  })
}

function createPaylineOverlay(pixiApp: Application) {
  const g = new Graphics()
  const centerY = SYMBOL_SIZE * 1.5

  g.roundRect(2, SYMBOL_SIZE + 2, SYMBOL_SIZE * REEL_COUNT - 4, SYMBOL_SIZE - 4, 8)
  g.stroke({ width: 3, color: 0xffd700, alpha: 0.6 })

  pixiApp.stage.addChild(g)
}

function createReel(x: number): Reel {
  const container = new Container()
  container.x = x
  app!.stage.addChild(container)

  const strip: number[] = []
  const symbols: Sprite[] = []
  const totalSprites = VISIBLE_SYMBOLS + 2

  for (let i = 0; i < totalSprites; i++) {
    const symbolIndex = Math.floor(Math.random() * textures.length)
    strip.push(symbolIndex)
    const sprite = new Sprite(textures[symbolIndex])
    sprite.anchor.set(0.5)
    sprite.x = SYMBOL_SIZE / 2
    container.addChild(sprite)
    symbols.push(sprite)
  }

  return {
    container,
    symbols,
    position: 0,
    targetPosition: 0,
    startPosition: 0,
    spinStartTime: 0,
    duration: 0,
    isSpinning: false,
    strip,
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function getStripSymbol(reel: Reel, index: number): number {
  const idx = Math.floor(index)
  if (idx < 0) return reel.strip[0] ?? 0
  
  while (reel.strip.length <= idx) {
    reel.strip.push(Math.floor(Math.random() * textures.length))
  }
  return reel.strip[idx]
}


function tickReels() {
  const now = performance.now()

  for (const reel of reels) {
    if (reel.isSpinning) {
      const elapsed = now - reel.spinStartTime
      const t = Math.min(elapsed / reel.duration, 1)
      reel.position = reel.startPosition + (reel.targetPosition - reel.startPosition) * easeOutCubic(t)

      if (t >= 1) {
        reel.position = reel.targetPosition
        reel.isSpinning = false
      }
    }

    const floorPos = Math.floor(reel.position)
    const offset = reel.position % 1

    for (let i = 0; i < reel.symbols.length; i++) {
      const sprite = reel.symbols[i]
      sprite.y = (i - offset - 1) * SYMBOL_SIZE + SYMBOL_SIZE / 2

      const symbolIndexFromStrip = floorPos + i
      sprite.texture = textures[getStripSymbol(reel, symbolIndexFromStrip)]
      if (reel.isSpinning) {
        sprite.scale.set(1)
      }
    }
  }

  if (reelsStarted && reels.every(r => !r.isSpinning)) {
    reelsStarted = false
    spinning.value = false
    onSpinComplete()
  }

  if (!spinning.value && winAmount.value && winAmount.value > 0) {
    const pulse = 1 + Math.sin(now / 150) * 0.08
    for (const reel of reels) {
      const centerSprite = reel.symbols[2]
      if (centerSprite) {
        centerSprite.scale.set(pulse)
      }
    }
  }
}

async function spin() {
  if (spinning.value) return
  
  spinning.value = true
  reelsStarted = false
  winAmount.value = null
  lastWinSymbol.value = null

  reels.forEach(r => r.symbols.forEach(s => s.scale.set(1)))

  try {
    const result = await $fetch<SpinResult>('/api/slots', {
      method: 'POST',
      body: { bet: 10 },
    })

    lastResult = result
    const now = performance.now()

    reels.forEach((reel, i) => {
      const extraSpins = 15 + i * 5
      const targetPos = Math.round(reel.position) + extraSpins
      const winCellIndex = targetPos + 2

      for (let idx = reel.strip.length; idx <= winCellIndex; idx++) {
        reel.strip[idx] = Math.floor(Math.random() * textures.length)
      }

      const targetSymbol = result.symbols?.[i] ?? 0
      reel.strip[winCellIndex] = targetSymbol

      reel.startPosition = reel.position
      reel.targetPosition = targetPos
      reel.spinStartTime = now
      reel.duration = 2000 + i * 400
      reel.isSpinning = true
    })

    reelsStarted = true

  } catch (err) {
    console.error('Error fetch to /api/play', err)
    spinning.value = false
  }
}

function onSpinComplete() {
  if (!lastResult) return

  winAmount.value = lastResult.winAmount

  const [s1, s2, s3] = lastResult.symbols || []
  if (s1 !== undefined && s1 === s2 && s2 === s3) {
    lastWinSymbol.value = SYMBOL_LABELS[s1] ?? null
  } else {
    lastWinSymbol.value = null
  }
}

onMounted(async () => {
  if (!containerRef.value) return

  app = new Application()
  await app.init({
    width: SYMBOL_SIZE * REEL_COUNT,
    height: SYMBOL_SIZE * VISIBLE_SYMBOLS,
    backgroundColor: 0x1a1a2e,
    antialias: true,
  })
  containerRef.value.appendChild(app.canvas)

  const mask = new Graphics()
    .rect(0, 0, SYMBOL_SIZE * REEL_COUNT, SYMBOL_SIZE * VISIBLE_SYMBOLS)
    .fill(0xffffff)
  app.stage.addChild(mask)
  app.stage.mask = mask

  textures = createPlaceholderTextures(app)

  for (let i = 0; i < REEL_COUNT; i++) {
    reels.push(createReel(i * SYMBOL_SIZE))
  }

  createPaylineOverlay(app)

  app.ticker.add(tickReels)
})

onUnmounted(() => {
  textures.forEach(t => t.destroy(true))
  textures = []
  reels = []
  app?.destroy(true, { children: true })
})
</script>

<template>
  <div class="slot-machine">
    <div class="win-banner" :class="{ visible: winAmount !== null }">
      <template v-if="winAmount && winAmount > 0">
        <span class="win-label">ВЫИГРЫШ!</span>
        <span class="win-value">+{{ winAmount }} 🪙</span>
        <span class="win-symbol">Комбинация: {{ lastWinSymbol }}</span>
      </template>
      <template v-else-if="winAmount === 0">
        <span class="lose-label">Повезёт в следующий раз!</span>
      </template>
      <template v-else>
        <span class="placeholder-label">Крути барабан!</span>
      </template>
    </div>

    <div ref="containerRef" class="slot-canvas-container" />

    <button :disabled="spinning" class="spin-button" @click="spin">
      {{ spinning ? 'Вращение...' : 'SPIN' }}
    </button>
  </div>
</template>

<style scoped>
.slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.win-banner {
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.win-label {
  color: #f1c40f;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 1px;
}

.win-value {
  color: #2ecc71;
  font-size: 1.3rem;
  font-weight: bold;
}

.win-symbol {
  font-size: 0.8rem;
  color: #aaa;
}

.lose-label, .placeholder-label {
  color: #888;
  font-size: 1rem;
}

.slot-canvas-container {
  border: 4px solid #333;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

.spin-button {
  padding: 12px 36px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.1s, opacity 0.2s;
}

.spin-button:hover:not(:disabled) {
  transform: scale(1.05);
}

.spin-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
