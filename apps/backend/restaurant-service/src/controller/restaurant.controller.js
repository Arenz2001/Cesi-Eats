const { validationResult } = require('express-validator');
const Restaurant = require('../models/restaurant.model');

// Récupérer tous les restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    const restaurants = await Restaurant.find({})
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un restaurant par son ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID de restaurant invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un restaurant par son nom
exports.getRestaurantByName = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ 
      name: { $regex: new RegExp(req.params.name, 'i') } 
    });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les plats et menus d'un restaurant
exports.getMenu = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    res.json({
      dishes: restaurant.dishes,
      menus: restaurant.menus
    });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID de restaurant invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les menus d'un restaurant
exports.getMenus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    res.json(restaurant.menus);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID de restaurant invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouveau restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Vérifier si le restaurant existe déjà
    const existingRestaurant = await Restaurant.findOne({ name: req.body.name });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'Un restaurant avec ce nom existe déjà' });
    }
    
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    
    res.status(201).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter un plat à un restaurant
exports.addDish = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    restaurant.dishes.push(req.body);
    await restaurant.save();
    
    res.status(201).json(restaurant);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID de restaurant invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un plat
exports.updateDish = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    const dish = restaurant.dishes.id(req.params.dishId);
    
    if (!dish) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    
    Object.keys(req.body).forEach(key => {
      dish[key] = req.body[key];
    });
    
    await restaurant.save();
    
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un plat
exports.removeDish = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    const dish = restaurant.dishes.id(req.params.dishId);
    
    if (!dish) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }
    
    dish.remove();
    await restaurant.save();
    
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Vérifier si le nom est déjà pris par un autre restaurant
    if (req.body.name) {
      const existingRestaurant = await Restaurant.findOne({ 
        name: req.body.name,
        _id: { $ne: req.params.id }
      });
      
      if (existingRestaurant) {
        return res.status(400).json({ message: 'Un restaurant avec ce nom existe déjà' });
      }
    }
    
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID de restaurant invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    res.json({ message: 'Restaurant supprimé avec succès' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID de restaurant invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Rechercher des restaurants par ville
exports.searchByCity = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      'address.city': { $regex: new RegExp(req.params.city, 'i') }
    });
    
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter un menu
exports.addMenu = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    restaurant.menus.push(req.body);
    await restaurant.save();
    
    res.status(201).json(restaurant);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID de restaurant invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un menu
exports.updateMenu = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    const menu = restaurant.menus.id(req.params.menuId);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu non trouvé' });
    }
    
    Object.keys(req.body).forEach(key => {
      menu[key] = req.body[key];
    });
    
    await restaurant.save();
    
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un menu
exports.removeMenu = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant non trouvé' });
    }
    
    const menu = restaurant.menus.id(req.params.menuId);
    
    if (!menu) {
      return res.status(404).json({ message: 'Menu non trouvé' });
    }
    
    menu.remove();
    await restaurant.save();
    
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID invalide' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les restaurants par catégorie
exports.getRestaurantsByCategory = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      'dishes.category': req.params.category
    });
    
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
