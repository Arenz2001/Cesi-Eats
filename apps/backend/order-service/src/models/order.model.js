const mongoose = require('mongoose');

// Schéma pour les plats dans la commande
const orderItemSchema = new mongoose.Schema({
    dish_id: {
        type: String,  // Changé de ObjectId à String temporairement
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
});

// Schéma principal de la commande
const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    items: [orderItemSchema],
    total_price: {
        type: Number,
        required: true,
        min: 0
    },
    client_id: {
        type: String,  // Changé de ObjectId à String temporairement
        required: true
    },
    restaurant_id: {
        type: String,  // Changé de ObjectId à String temporairement
        required: true
    },
    delivery_person_id: {
        type: String,  // Changé de ObjectId à String temporairement
        default: null
    },
    status: {
        type: String,
        enum: [
            'validated_by_client',
            'accepted_by_restaurant',
            'in_preparation',
            'ready_for_delivery',
            'accepted_by_delivery',
            'on_the_way',
            'delivered',
            'cancelled'
        ],
        default: 'validated_by_client'
    },
    comments: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Middleware pour mettre à jour la date de modification
orderSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

// Méthode pour calculer le prix total
orderSchema.methods.calculateTotal = function() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
