export default defineEventHandler(async (event) => {
  const userId = getCookie(event, 'user_id')

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated',
    })
  }

  const stream = event.node.res
  let closed = false
  let timer: ReturnType<typeof setInterval> | undefined

  const cleanup = () => {
    closed = true

    if (timer) clearInterval(timer)
  }

  stream.on('close', cleanup)

  const sendBalance = async () => {
    if (closed || stream.destroyed) return

    try {
      const result = await db.query(
        'SELECT balance FROM users WHERE id = $1',
        [userId],
      )

      if (result.rows.length === 0) {
        stream.write('event: error\ndata: {"message":"User not found"}\n\n')
        stream.end()
        cleanup()
        return
      }

      stream.write(
        `event: balance\ndata: ${JSON.stringify({
          balance: result.rows[0].balance,
        })}\n\n`,
      )
    } catch {
      cleanup()
      stream.end()
    }
  }

  stream.write('retry: 3000\n\n')

  await sendBalance()

  if (!closed && !stream.destroyed) {
    timer = setInterval(sendBalance, 2000)
  }
})
