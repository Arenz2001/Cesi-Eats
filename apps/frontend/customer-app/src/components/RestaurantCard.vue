<script setup lang="ts">
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

defineProps<{
  restaurant: Restaurant
}>()
</script>

<template>
  <div class="restaurant-card">
    <div class="image-container">
      <img :src="restaurant.image" :alt="restaurant.name" class="restaurant-image">
      <div class="delivery-time">{{ restaurant.deliveryTime }}</div>
    </div>
    
    <div class="content">
      <div class="header">
        <h3 class="name">{{ restaurant.name }}</h3>
        <div class="price">{{ restaurant.priceCategory }}</div>
      </div>
      
      <div class="rating">
        <span class="stars">★</span>
        <span class="rating-value">{{ restaurant.rating }}</span>
        <span class="review-count">({{ restaurant.reviewCount }})</span>
      </div>
      
      <div class="tags">
        <span v-for="tag in restaurant.tags" 
              :key="tag" 
              class="tag">
          {{ tag }}
        </span>
      </div>
      
      <div class="delivery-fee">
        Livraison {{ restaurant.deliveryFee }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.restaurant-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s;
  cursor: pointer;
}

.restaurant-card:hover {
  transform: translateY(-4px);
}

.image-container {
  position: relative;
  width: 100%;
  height: 200px;
}

.restaurant-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delivery-time {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #2F3842;
}

.content {
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.name {
  font-size: 18px;
  font-weight: 700;
  color: #2F3842;
  margin: 0;
}

.price {
  color: #6B7280;
  font-size: 14px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.stars {
  color: #FFB800;
}

.rating-value {
  font-weight: 600;
  color: #2F3842;
}

.review-count {
  color: #6B7280;
  font-size: 14px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  background: #F3F4F6;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  color: #4B5563;
}

.delivery-fee {
  font-size: 14px;
  color: #6B7280;
}
</style> 