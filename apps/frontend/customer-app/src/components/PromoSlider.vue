<script setup lang="ts">
const promos = [
  {
    id: 1,
    title: "-50% sur votre première commande",
    description: "Profitez de cette offre exceptionnelle",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop",
    color: "#FF5A60"
  },
  {
    id: 2,
    title: "Livraison gratuite",
    description: "Pour toute commande supérieure à 20€",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop",
    color: "#4A90E2"
  },
  {
    id: 3,
    title: "2 menus achetés = 1 offert",
    description: "Dans une sélection de restaurants",
    image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&auto=format&fit=crop",
    color: "#50E3C2"
  }
]
</script>

<template>
  <div class="promo-slider">
    <div class="promo-container">
      <div v-for="promo in promos" 
           :key="promo.id" 
           class="promo-card"
           :style="{ backgroundColor: promo.color }">
        <div class="promo-content">
          <h3>{{ promo.title }}</h3>
          <p>{{ promo.description }}</p>
        </div>
        <div class="promo-image-container">
          <img :src="promo.image" 
               :alt="promo.title" 
               class="promo-image">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.promo-slider {
  padding: 24px;
  background-color: white;
}

.promo-container {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.promo-container::-webkit-scrollbar {
  display: none;
}

.promo-card {
  min-width: 280px;
  height: 160px;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  color: white;
  cursor: pointer;
  transition: transform 0.2s;
}

.promo-card:hover {
  transform: scale(1.02);
}

.promo-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.promo-content h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.promo-content p {
  font-size: 14px;
  opacity: 0.9;
}

.promo-image-container {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.promo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style> 