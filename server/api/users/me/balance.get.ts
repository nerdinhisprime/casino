export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id');

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    });
  }

  const { rows } = await db.query(
    `SELECT balance
     FROM users
     WHERE id = $1`,
    [userId],
  );

  if (rows.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    });
  }

  return {
    balance: rows[0].balance,
  };
});

