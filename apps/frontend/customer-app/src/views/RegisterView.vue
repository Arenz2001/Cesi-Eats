<template>
  <div class="register-page">
    <div class="register-container">
      <h1>Créer un compte</h1>
      <RegisterForm />
      <div class="login-link">
        Déjà un compte ? <router-link to="/" @click="$emit('openLogin')">Se connecter</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from '@/components/RegisterForm.vue'

export default {
  name: 'RegisterView',
  components: {
    RegisterForm
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.register-container {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
}

.login-link a {
  color: #6A994E;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 