const mongoose = require('mongoose');

// Define the dish schema (as a subdocument)
const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  }
});

// Define the menu schema (anciennement orderItemSchema)
const MenuSchema = new mongoose.Schema({
  dishes: [{
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  }],
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

// Define the restaurant schema
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'France'
    }
  },
  imageUrl: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  cuisineType: {
    type: String,
    trim: true
  },
  dishes: [dishSchema],    // Collection de tous les plats
  menus: [MenuSchema],     // Collection de tous les menus
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt field
restaurantSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
