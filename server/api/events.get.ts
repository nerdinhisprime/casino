export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')
  if (!userId) throw createError({ statusCode: 401 })

  const stream = createEventStream(event)
  let last: number | null = null

  const timer = setInterval(async () => {
    try {
      const { rows } = await db.query(
        'SELECT balance FROM users WHERE id = $1',
        [userId],
      )
      const balance = rows[0]?.balance

      if (balance !== undefined && balance !== last) {
        last = balance
        await stream.push(JSON.stringify({ balance }))
      }
    } catch (e) {
      console.error(e)
    }
  }, 1000)

  stream.onClosed(async () => {
    clearInterval(timer)
    await stream.close()
  })

  return stream.send()
})
