<template>
  <div class="register-form">
    <h2>Créer un compte</h2>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="firstName">Prénom</label>
        <input 
          type="text" 
          id="firstName" 
          v-model="form.firstName" 
          required
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="lastName">Nom</label>
        <input 
          type="text" 
          id="lastName" 
          v-model="form.lastName" 
          required
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email" 
          required
          class="form-control"
        >
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password" 
          required
          minlength="6"
          class="form-control"
        >
      </div>

      <button type="submit" class="btn btn-primary">S'inscrire</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'client'
      },
      error: null
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.error = null;
        const response = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erreur lors de l\'inscription');
        }

        // Stocker le token dans le localStorage
        localStorage.setItem('token', data.token);
        
        // Rediriger vers la page d'accueil
        this.$router.push('/');
      } catch (err) {
        this.error = err.message;
      }
    }
  }
}
</script>

<style scoped>
.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-control {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn:hover {
  background-color: #45a049;
}

.error {
  color: red;
  margin-top: 10px;
}
</style> 