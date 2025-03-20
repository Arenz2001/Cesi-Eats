<script setup lang="ts">
const categories = [
  {
    name: 'Courses',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop'
  },
  {
    name: 'Fast food',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop'
  },
  {
    name: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop'
  },
  {
    name: 'Asiatique',
    image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&auto=format&fit=crop'
  },
  {
    name: 'Alcool',
    image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&auto=format&fit=crop'
  },
  {
    name: 'Épicerie',
    image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&auto=format&fit=crop'
  },
  {
    name: 'Sushis',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop'
  },
  {
    name: 'Indienne',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356c36?w=600&auto=format&fit=crop'
  }
]
</script>

<template>
  <div class="categories">
    <div v-for="category in categories" 
         :key="category.name" 
         class="category">
      <div class="category-image-container">
        <img :src="category.image" 
             :alt="category.name" 
             class="category-image">
      </div>
      <div class="category-label">{{ category.name }}</div>
    </div>
  </div>
</template>

<style scoped>
.categories {
  display: flex;
  overflow-x: auto;
  padding: 28px 24px;
  background-color: white;
  scrollbar-width: none;
}

.categories::-webkit-scrollbar {
  display: none;
}

.category {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 28px;
  cursor: pointer;
}

.category-image-container {
  width: 85px;
  height: 85px;
  margin-bottom: 10px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-label {
  font-size: 14px;
  text-align: center;
  font-weight: 600;
  color: #2F3842;
}
</style> 