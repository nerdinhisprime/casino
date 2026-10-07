const REWARDS = [
  { id: 'trash', name: 'Ширпотреб ($0.1)', multiplier: 0, weight: 60 },
  { id: 'medium', name: 'Редкое ($1.5)', multiplier: 1.5, weight: 25 },
  { id: 'rare', name: 'Засекреченное ($5)', multiplier: 5, weight: 10 },
  { id: 'epic', name: 'Тайное ($25)', multiplier: 25, weight: 4.5 },
  { id: 'jackpot', name: 'НОЖ / ДЖЕКПОТ ($100)', multiplier: 100, weight: 0.5 }
]

const WIN_SYMBOL_BY_ITEM: Record<string, number> = {
  medium: 3,  // 🍋 🍋 🍋
  rare: 2,    // 🍒 🍒 🍒
  epic: 1,    // BAR BAR BAR
  jackpot: 0, // 7 7 7
}

export default defineEventHandler(async (event) => {
  const userId = await requireUser(event)
  await restoreSpins(userId)

  await db.query(
    `UPDATE users SET spins = spins - 1, updated_at = NOW() WHERE id = $1`,
    [userId]
  );

  const body = await readBody(event);
  const bet = Number(body?.bet) || 10;

  const totalWeight = REWARDS.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  let winItem = REWARDS[0];

  for (const item of REWARDS) {
    if (random < item.weight) {
      winItem = item
      break
    }
    random -= item.weight
  }

  const winAmount = bet * winItem.multiplier

  let symbols: number[] = []

  if (winItem.id === 'trash') {
    do {
      symbols = [
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 4)
      ]
    } while (symbols[0] === symbols[1] && symbols[1] === symbols[2])
  } else {
    const winSymbol = WIN_SYMBOL_BY_ITEM[winItem.id] ?? 0
    symbols = [winSymbol, winSymbol, winSymbol]
  }

  await db.query(
    `INSERT INTO spins (
      user_id,
      bet,
      reward_id,
      win_amount
    ) VALUES ($1, $2, $3, $4)`,
    [
      userId,
      bet,
      winItem.id,
      winAmount
    ]
  );

  return {
    success: true,
    item: winItem,
    winAmount,
    symbols,
  }
})
