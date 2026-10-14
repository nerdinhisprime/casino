export const useAuth = () => {
  const userId = useCookie('user_id')

  const logout = async () => {
    userId.value = null
    await navigateTo('/')
    window.location.reload()
  }

  return { logout }
}
