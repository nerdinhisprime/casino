import { db } from './db'

export async function restoreSpins(userId) {
  const { rows } = await db.query(
    `SELECT spins, last_spin_at
     FROM users
     WHERE id = $1`,
    [userId]
  )

  const user = rows[0]

  const elapsedMs =
    Date.now() - new Date(user.last_spin_at).getTime()

  const restorePeriodMs = Number(process.env.RESTORE_TIMING) * 60 * 1000

  const restoredSpins =
    Math.floor(elapsedMs / restorePeriodMs)

  console.log('Restored spins:', restoredSpins)
  if (restoredSpins > 0) {
    const newSpins = Math.min(
      user.spins + restoredSpins,
      process.env.MAX_SPINS
    )

    await db.query(
      `UPDATE users
       SET
         spins = $1,
         last_spin_at = NOW(),
         updated_at = NOW()
       WHERE id = $2`,
      [newSpins, userId]
    )
  }
}
