<template>
  <div class="filters">
    <div class="filter active">
      <span class="filter-icon">🏷️</span>
      <span>Offres</span>
    </div>
    <div class="filter">
      <span>Prix</span>
      <span>▼</span>
    </div>
    <div class="filter">
      <span>Frais de livraison</span>
      <span>▼</span>
    </div>
    <div class="filter">
      <span class="filter-icon">🏆</span>
      <span>Les mieux notés</span>
    </div>
    <div class="filter">
      <span>Diététique</span>
      <span>▼</span>
    </div>
    <div class="filter">
      <span>Trier</span>
      <span>▼</span>
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  padding: 18px 24px;
  overflow-x: auto;
  background-color: var(--background-white);
  scrollbar-width: none;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.filters::-webkit-scrollbar {
  display: none;
}

.filter {
  padding: 10px 18px;
  border-radius: 50px;
  background-color: var(--background-light);
  margin-right: 14px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-dark);
  white-space: nowrap;
}

.filter:hover {
  background-color: var(--complementary-peach);
  color: var(--text-dark);
}

.filter.active {
  background-color: var(--secondary-color);
  color: var(--background-white);
}

.filter-icon {
  margin-right: 8px;
}

.filter span:last-child {
  margin-left: 6px;
}
</style> 