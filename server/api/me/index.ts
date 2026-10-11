export default defineEventHandler(async (event) => {
  const userId = await getCookie(event, 'user_id');

  if (userId) {
    const { rows } = await db.query(
      `SELECT id, username, spins, created_at, is_guest FROM users WHERE id = $1;`,
      [userId]
    );
    return rows[0]
  } else {
    return {
      id: '777',
      username: 'Guest',
      spins: 0,
      is_guest: true
    }
  }
});
