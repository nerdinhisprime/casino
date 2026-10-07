export const authenticate = async (mode: 'login' | 'signup', name: string, password: string) => {
  try {
    const res = await $fetch(`/api/auth/${mode}`, {
      method: 'POST',
      body: {
        username: name,
        password: password
      }
    })
    await navigateTo('/')
  } catch (err) {
    return err
  }
}
