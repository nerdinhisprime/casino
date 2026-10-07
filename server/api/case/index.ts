const REWARDS = [
  { id: 'trash', name: 'Ширпотреб ($0.1)', multiplier: 0.1, weight: 60 }, // 60% шанс
  { id: 'medium', name: 'Редкое ($1.5)', multiplier: 1.5, weight: 25 },  // 25% шанс
  { id: 'rare', name: 'Засекреченное ($5)', multiplier: 5, weight: 10 },   // 10% шанс
  { id: 'epic', name: 'Тайное ($25)', multiplier: 25, weight: 4.5 },      // 4.5% шанс
  { id: 'jackpot', name: 'НОЖ / ДЖЕКПОТ ($100)', multiplier: 100, weight: 0.5 } // 0.5% шанс
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const bet = Number(body?.bet) || 10

  const totalWeight = REWARDS.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * totalWeight
  let winItem = REWARDS[0]
  for (const item of REWARDS) {
    if (random < item.weight) {
      winItem = item
      break
    }
    random -= item.weight
  }

  const winAmount = bet * winItem.multiplier

  // TODO: Здесь в будущем будет списание ставки и зачисление winAmount в БД (PostgreSQL)

  // 3. Возвращаем результат на фронт.
  // symbolIndex — индекс текстуры символа (0..3), который фронт должен
  // показать в центральной видимой ячейке КАЖДОГО барабана, когда он
  // остановится. Индекс детерминированно завязан на id приза, чтобы
  // одинаковый item.id всегда рисовался одинаковым символом.
  const SYMBOL_INDEX_BY_ITEM: Record<string, number> = {
    trash: 0,
    medium: 1,
    rare: 2,
    epic: 3,
    jackpot: 0,
  }

  return {
    success: true,
    item: winItem,
    winAmount,
    symbolIndex: SYMBOL_INDEX_BY_ITEM[winItem.id] ?? 0,
  }
})
