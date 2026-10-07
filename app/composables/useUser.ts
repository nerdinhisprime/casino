export const useUser = () => {
  const user = useState('user', () => null)

  const fetchUser = async () => {
    const { data } = await useFetch('/api/auth/me', {
      key: 'user-data'
    })
    user.value = data.value
  }

  return {
    user,
    fetchUser,
  }
}
