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
  if (password.length < 6 || username.length < 4) {
    throw createError({
      statusCode: 400,
      statusMessage: 'The password or username is too short'
    })
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO users (id, username, password_hash) VALUES (gen_random_uuid(), $1, $2) RETURNING id, username`,
      [username, await makeHashPassword(password)]
    );
    const user = rows[0];

    setResponseStatus(event, 201);

    return {
      id: user.id,
      username: user.username,
    }
  } catch (err: any) {
    if (err.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username is already taken',
      });
    }

    throw err;
  }
});
