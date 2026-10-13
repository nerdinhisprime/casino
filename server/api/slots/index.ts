const REWARDS = [
  { id: 'trash', name: 'Ширпотреб ($0.1)', multiplier: 0, weight: 60 },
  { id: 'medium', name: 'Редкое ($1.5)', multiplier: 1.5, weight: 25 },
  { id: 'rare', name: 'Засекреченное ($5)', multiplier: 5, weight: 10 },
  { id: 'epic', name: 'Тайное ($25)', multiplier: 25, weight: 4.5 },
  { id: 'jackpot', name: 'НОЖ / ДЖЕКПОТ ($100)', multiplier: 100, weight: 0.5 },
];

const WIN_SYMBOL_BY_ITEM: Record<string, number> = {
  medium: 3,
  rare: 2,
  epic: 1,
  jackpot: 0,
};

export default defineEventHandler(async (event) => {
  const userId = await requireUser(event);
  const body = await readBody(event);

  const bet = body?.bet;

  if (!Number.isSafeInteger(bet) || bet <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bet must be a positive integer',
    });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `SELECT balance
       FROM users
       WHERE id = $1
       FOR UPDATE`,
      [userId],
    );

    if (userResult.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found',
      });
    }

    const balance = Number(userResult.rows[0].balance);

    if (balance < bet) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Not enough gems',
      });
    }

    const totalWeight = REWARDS.reduce(
      (sum, item) => sum + item.weight,
      0,
    );

    let random = Math.random() * totalWeight;
    let winItem = REWARDS[0];

    for (const item of REWARDS) {
      if (random < item.weight) {
        winItem = item;
        break;
      }

      random -= item.weight;
    }

    const winAmount = Math.floor(bet * winItem.multiplier);

    let symbols: number[];

    if (winItem.id === 'trash') {
      do {
        symbols = [
          Math.floor(Math.random() * 4),
          Math.floor(Math.random() * 4),
          Math.floor(Math.random() * 4),
        ];
      } while (
        symbols[0] === symbols[1] &&
        symbols[1] === symbols[2]
      );
    } else {
      const winSymbol = WIN_SYMBOL_BY_ITEM[winItem.id] ?? 0;
      symbols = [winSymbol, winSymbol, winSymbol];
    }

    const updatedUser = await client.query(
      `UPDATE users
       SET balance = balance - $1 + $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING balance`,
      [bet, winAmount, userId],
    );

    await client.query(
      `INSERT INTO spins (
        user_id,
        bet,
        reward_id,
        win_amount
      )
      VALUES ($1, $2, $3, $4)`,
      [userId, bet, winItem.id, winAmount],
    );

    await client.query('COMMIT');

    return {
      success: true,
      item: winItem,
      bet,
      winAmount,
      balance: Number(updatedUser.rows[0].balance),
      symbols,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

