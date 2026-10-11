export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }

  const body = await readBody(event)
  let { oldPassword, newPassword } = body
  //const username = body?.username?.trim()

  try {
    const userRef = await db.query(
      `SELECT id, username, password_hash FROM users WHERE id = $1`,
      [userId]
    )
    const user = userRef.rows[0]

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found',
      })
    }

    const isPasswordValid = await verifyPassword(oldPassword, user.password_hash)
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid old password',
      })
    }

    const newPasswordHash = await makeHashPassword(newPassword)
    const updateRef = await db.query(
      `UPDATE users
      SET password_hash = $1
      WHERE id = $2
      RETURNING id, username`,
      [newPasswordHash, userId]
    )

    return updateRef.rows[0]
  } catch (err: any) {
    if (err.statusCode) throw err;
    throw err
  }
})
