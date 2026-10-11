export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id');

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    });
  }

  const body = await readBody(event);

  const username = body?.username;
  const confirmation = body?.confirmation;

  if (
    typeof username !== 'string' ||
    typeof confirmation !== 'string' ||
    confirmation !== 'delete my account'
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid confirmation',
    });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT username
       FROM users
       WHERE id = $1
       FOR UPDATE`,
      [userId],
    );

    const user = result.rows[0];

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found',
      });
    }

    if (user.username !== username.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username does not match',
      });
    }

    await client.query(
      `DELETE FROM spins WHERE user_id = $1`,
      [userId],
    );

    await client.query(
      `DELETE FROM users WHERE id = $1`,
      [userId],
    );
    await client.query('COMMIT');
    deleteCookie(event, 'user_id');

    return {
      success: true,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

