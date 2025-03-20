import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: number
  email: string
  name: string
}

interface LoginCredentials {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  async function login(credentials: LoginCredentials) {
    try {
      // Simuler un appel API - À remplacer par votre vrai appel API
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      user.value = data.user
      token.value = data.token
      localStorage.setItem('token', data.token)
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  // Vérifier le token au chargement
  function init() {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      // Ici vous pourriez faire un appel API pour vérifier le token et récupérer les infos utilisateur
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    init
  }
}) 