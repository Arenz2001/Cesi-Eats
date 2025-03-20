<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoginModal from './LoginModal.vue'

const authStore = useAuthStore()
const isMenuOpen = ref(false)
const isCartOpen = ref(false)
const showLoginModal = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) isCartOpen.value = false
}

const toggleCart = () => {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    return
  }
  isCartOpen.value = !isCartOpen.value
  if (isCartOpen.value) isMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  isMenuOpen.value = false
}

const cartItems = ref([
  {
    id: 1,
    name: "Burger Classic",
    price: "12.99€",
    quantity: 1,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150"
  }
])

const removeFromCart = (id: number) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id)
}
</script>

<template>
  <div class="navbar-container">
    <!-- Menu latéral -->
    <div class="side-menu" :class="{ 'open': isMenuOpen }">
      <div class="menu-header">
        <div class="close-button" @click="toggleMenu">✕</div>
        <div class="menu-title">Menu</div>
      </div>
      <div class="menu-items">
        <template v-if="authStore.isAuthenticated">
          <div class="menu-item">
            <span class="icon">👤</span>
            Mon compte
          </div>
          <div class="menu-item">
            <span class="icon">📋</span>
            Mes commandes
          </div>
          <div class="menu-item">
            <span class="icon">❤️</span>
            Favoris
          </div>
          <div class="menu-item">
            <span class="icon">🎁</span>
            Codes promo
          </div>
          <div class="menu-item">
            <span class="icon">⚙️</span>
            Paramètres
          </div>
          <div class="menu-item" @click="handleLogout">
            <span class="icon">🚪</span>
            Se déconnecter
          </div>
        </template>
        <template v-else>
          <div class="menu-item" @click="showLoginModal = true">
            <span class="icon">🔑</span>
            Se connecter
          </div>
          <div class="menu-item">
            <span class="icon">✨</span>
            Créer un compte
          </div>
        </template>
      </div>
    </div>

    <!-- Overlay pour le menu -->
    <div v-if="isMenuOpen || isCartOpen" 
         class="overlay" 
         @click="isMenuOpen = isCartOpen = false"></div>

    <!-- Navbar -->
    <div class="navbar">
      <div class="menu-icon" @click="toggleMenu">☰</div>
      <div class="logo">Ces'eats</div>
      <div class="delivery-options">
        <div class="option">Livraison</div>
      </div>
      <div class="location">
        <span>64 Rue du Faubourg de B...</span>
      </div>
      <div class="time-select">
        <span>Maintenant</span>
        <span>▼</span>
      </div>
      <div class="search-container">
        <div class="search-icon">🔍</div>
        <input type="text" class="search-bar" placeholder="Rechercher dans Ces'eats">
      </div>
      <div class="cart-icon" @click="toggleCart">
        🛒
        <div v-if="authStore.isAuthenticated" class="cart-count">
          {{ cartItems.length }}
        </div>
      </div>
    </div>

    <!-- Dropdown panier -->
    <div class="cart-dropdown" :class="{ 'open': isCartOpen }">
      <div class="cart-header">
        <h3>Mon panier ({{ cartItems.length }})</h3>
        <div class="close-button" @click="toggleCart">✕</div>
      </div>
      
      <div v-if="cartItems.length > 0" class="cart-items">
        <div v-for="item in cartItems" 
             :key="item.id" 
             class="cart-item">
          <img :src="item.image" :alt="item.name" class="item-image">
          <div class="item-details">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-price">{{ item.price }}</div>
          </div>
          <div class="item-quantity">
            <button class="quantity-btn">-</button>
            <span>{{ item.quantity }}</span>
            <button class="quantity-btn">+</button>
          </div>
          <button class="remove-btn" @click="removeFromCart(item.id)">✕</button>
        </div>
      </div>
      
      <div v-else class="empty-cart">
        Votre panier est vide
      </div>

      <div v-if="cartItems.length > 0" class="cart-footer">
        <button class="checkout-btn">
          Commander maintenant
        </button>
      </div>
    </div>

    <!-- Modal de connexion -->
    <LoginModal 
      v-if="showLoginModal"
      @close="showLoginModal = false"
    />
  </div>
</template>

<style scoped>
.navbar-container {
  position: relative;
}

.navbar {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background-color: #324B6D;
  position: sticky;
  top: 0;
  z-index: 100;
}

.menu-icon {
  margin-right: 16px;
  cursor: pointer;
  color: white;
}

.logo {
  font-weight: 800;
  font-size: 26px;
  margin-right: 24px;
  color: white;
  letter-spacing: -0.5px;
}

.delivery-options {
  display: flex;
  margin-right: 24px;
}

.option {
  padding: 10px 20px;
  border-radius: 50px;
  background-color: #6A994E;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  color: white;
}

.location, .time-select {
  display: flex;
  align-items: center;
  margin-right: 16px;
  font-size: 14px;
  cursor: pointer;
  color: white;
  font-weight: 500;
}

.search-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  position: relative;
  margin: 0 16px;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #7D8792;
}

.search-bar {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border-radius: 50px;
  border: none;
  background-color: white;
  font-size: 14px;
}

.search-bar:focus {
  outline: none;
}

.cart-icon {
  position: relative;
  cursor: pointer;
  color: white;
  font-size: 22px;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #D66853;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
}

/* Menu latéral */
.side-menu {
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100vh;
  background-color: white;
  z-index: 99;
  transition: left 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.side-menu.open {
  left: 0;
}

.menu-header {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.menu-title {
  flex-grow: 1;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  color: #2F3842;
}

.menu-items {
  padding: 20px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #2F3842;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item .icon {
  margin-right: 12px;
  font-size: 20px;
}

/* Dropdown panier */
.cart-dropdown {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background-color: white;
  z-index: 99;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

.cart-dropdown.open {
  right: 0;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.cart-header h3 {
  margin: 0;
  font-size: 18px;
  color: #2F3842;
}

.close-button {
  cursor: pointer;
  padding: 8px;
  font-size: 20px;
  color: #2F3842;
}

.cart-items {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 12px;
}

.item-details {
  flex-grow: 1;
}

.item-name {
  font-weight: 600;
  margin-bottom: 4px;
  color: #2F3842;
}

.item-price {
  color: #6B7280;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 12px;
  color: #2F3842;
}

.quantity-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  color: #2F3842;
}

.remove-btn {
  border: none;
  background: none;
  color: #6B7280;
  cursor: pointer;
  padding: 4px;
}

.empty-cart {
  text-align: center;
  padding: 40px;
  color: #6B7280;
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid #eee;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background-color: #6A994E;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkout-btn:hover {
  background-color: #5a8441;
}
</style> 