<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const emit = defineEmits(['close'])

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Veuillez remplir tous les champs'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const success = await authStore.login({
      email: email.value,
      password: password.value
    })

    if (success) {
      emit('close')
    } else {
      error.value = 'Email ou mot de passe incorrect'
    }
  } catch (e) {
    error.value = 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h2>Connexion</h2>
        <button class="close-button" @click="emit('close')">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-content">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            id="email"
            v-model="email"
            type="email"
            placeholder="votre@email.com"
            required
          >
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input 
            id="password"
            v-model="password"
            type="password"
            placeholder="Votre mot de passe"
            required
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="loading"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>

        <div class="additional-options">
          <a href="#" class="forgot-password">Mot de passe oublié ?</a>
          <router-link to="/register" @click="$emit('close')" class="create-account">Créer un compte</router-link>
        </div>
      </form>

      <div class="modal-footer">
        <p>Pas encore de compte ?</p>
        <router-link to="/register" @click="$emit('close')" class="register-link">Créer un compte</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  margin: 0;
  color: #2F3842;
  font-size: 24px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #6B7280;
  cursor: pointer;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2F3842;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #324B6D;
  box-shadow: 0 0 0 2px rgba(50, 75, 109, 0.1);
}

.error-message {
  color: #DC2626;
  margin-bottom: 16px;
  font-size: 14px;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #324B6D;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #283c57;
}

.submit-button:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}

.additional-options {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.additional-options a {
  color: #324B6D;
  text-decoration: none;
}

.additional-options a:hover {
  text-decoration: underline;
}

.modal-footer {
  margin-top: 24px;
  text-align: center;
}

.modal-footer p {
  margin: 0;
  color: #2F3842;
  font-size: 14px;
}

.register-link {
  color: #324B6D;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}
</style> 