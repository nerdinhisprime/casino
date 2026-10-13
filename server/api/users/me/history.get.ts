export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id');

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    });
  }

  const query = getQuery(event);

  const limitValue = Number(query.limit);
  const offsetValue = Number(query.offset);

  const limit = Number.isInteger(limitValue) && limitValue > 0
    ? Math.min(limitValue, 100)
    : 20;

  const offset = Number.isInteger(offsetValue) && offsetValue >= 0
    ? offsetValue
    : 0;

  const { rows } = await db.query(
    `SELECT id, reward_id, win_amount, created_at, bet
     FROM spins
     WHERE user_id = $1
     ORDER BY created_at DESC, id DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );

  return {
    items: rows,
    hasMore: rows.length === limit,
    nextOffset: offset + rows.length,
  };
});

