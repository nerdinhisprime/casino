export async function requireUser(event) {
  const userId = await getCookie(event, 'user_id');

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    });
  };

  const { rows } = await db.query(
    `SELECT spins FROM users WHERE id = $1`,
    [userId],
  );
  const user = rows[0]

  if (user.spins <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No spins available',
    });
  };

  return userId
}
