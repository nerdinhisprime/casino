export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  let { username, password } = body;
  username = username?.trim();

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required',
    });
  };

  const { rows } = await db.query(
    `SELECT id, username, password_hash FROM users WHERE username = $1`,
    [username]
  );
  const user = rows[0]

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  setCookie(event, 'user_id', user.id);

  return {
    id: user.id,
    username: user.username,
  };
});
