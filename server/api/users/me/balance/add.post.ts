const allowedAmounts = [320, 640, 1280, 12800]

export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    });
  }

  const body = await readBody(event);
  const amount = body?.amount;

  if (!allowedAmounts.includes(amount)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid amount',
    });
  }

  const { rows } = await db.query(
    `UPDATE users
    SET balance = balance + $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING balance`,
    [amount, userId]
  )

  if (rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    });
  }

  console.log('hi')
  return {
    balance: rows[0].balance,
  };
})
