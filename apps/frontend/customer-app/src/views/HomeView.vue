<script setup lang="ts">
import RestaurantCard from '@/components/RestaurantCard.vue'
import CategoryBar from '@/components/CategoryBar.vue'
import FilterBar from '@/components/FilterBar.vue'
import PromoSlider from '@/components/PromoSlider.vue'

interface Restaurant {
  id: number
  name: string
  image: string
  rating: number
  reviewCount: number
  deliveryTime: string
  deliveryFee: string
  tags: string[]
  priceCategory: string
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Le Petit Bistrot",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 524,
    deliveryTime: "20-30 min",
    deliveryFee: "2.99€",
    tags: ["Français", "Traditionnel"],
    priceCategory: "€€"
  },
  {
    id: 2,
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 1205,
    deliveryTime: "25-35 min",
    deliveryFee: "3.99€",
    tags: ["Japonais", "Sushi", "Healthy"],
    priceCategory: "€€€"
  },
  {
    id: 3,
    name: "Burger House",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
    rating: 4.5,
    reviewCount: 2150,
    deliveryTime: "15-25 min",
    deliveryFee: "2.49€",
    tags: ["Burger", "Fast-food", "Américain"],
    priceCategory: "€"
  },
  {
    id: 4,
    name: "Pizza Roma",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 1823,
    deliveryTime: "20-30 min",
    deliveryFee: "2.99€",
    tags: ["Italien", "Pizza", "Pâtes"],
    priceCategory: "€€"
  },
  {
    id: 5,
    name: "Le Taj Mahal",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356c36?w=600&auto=format&fit=crop",
    rating: 4.4,
    reviewCount: 892,
    deliveryTime: "30-40 min",
    deliveryFee: "3.49€",
    tags: ["Indien", "Curry", "Épicé"],
    priceCategory: "€€"
  },
  {
    id: 6,
    name: "Wok & Roll",
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&auto=format&fit=crop",
    rating: 4.3,
    reviewCount: 654,
    deliveryTime: "25-35 min",
    deliveryFee: "2.99€",
    tags: ["Asiatique", "Thaï", "Wok"],
    priceCategory: "€€"
  }
]
</script>

<template>
  <main class="home">
    <CategoryBar />
    <FilterBar />
    <PromoSlider />
    
    <section class="restaurants-section">
      <div class="section-header">
        <h2>Restaurants populaires</h2>
        <button class="view-all">Voir tout</button>
      </div>
      
      <div class="restaurants-grid">
        <RestaurantCard 
          v-for="restaurant in restaurants" 
          :key="restaurant.id"
          :restaurant="restaurant"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  background-color: #F8F9FA;
  min-height: 100vh;
  padding-bottom: 40px;
}

.restaurants-section {
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #2F3842;
}

.view-all {
  font-size: 14px;
  font-weight: 600;
  color: #4A90E2;
  background: none;
  border: none;
  cursor: pointer;
}

.view-all:hover {
  text-decoration: underline;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

@media (max-width: 640px) {
  .restaurants-grid {
    grid-template-columns: 1fr;
  }
}
</style> 