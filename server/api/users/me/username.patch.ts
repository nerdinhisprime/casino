export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id');

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }

  const body = await readBody(event)
  const username = body?.username?.trim()

  if (
    typeof username !== 'string' ||
    username.length < 4 ||
    username.length > 24
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username must be 4-24 characters',
    })
  }

  try {
    const { rows } = await db.query(
      `UPDATE users
      SET username = $1
      WHERE id = $2
      RETURNING id, username`,
      [username, userId]
    )
    if (!rows[0]) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found',
      })
    }
    return rows[0]
  } catch (err: any) {
    if (err.statusCode) throw err;

    if (err.code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username is already taken',
      })
    }

    throw err
  }
})
