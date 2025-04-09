const Order = require('../models/order.model');

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
            total_price: req.body.items.reduce((total, item) => total + (item.price * item.quantity), 0)
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer toutes les commandes
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('client_id')
            .populate('restaurant_id')
            .populate('delivery_person_id')
            .populate('items.dish_id');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une commande par son ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('client_id')
            .populate('restaurant_id')
            .populate('delivery_person_id')
            .populate('items.dish_id');
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une commande
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        .populate('client_id')
        .populate('restaurant_id')
        .populate('delivery_person_id')
        .populate('items.dish_id');

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une commande
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.json({ message: 'Commande supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour le statut d'une commande
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
        .populate('client_id')
        .populate('restaurant_id')
        .populate('delivery_person_id')
        .populate('items.dish_id');

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer les commandes d'un client avec filtres
exports.getClientOrders = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        const query = { client_id: req.params.clientId };

        // Ajout des filtres optionnels
        if (status) {
            query.status = status;
        }
        if (startDate && endDate) {
            query.created_at = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.find(query)
            .populate('restaurant_id')
            .populate('delivery_person_id')
            .populate('items.dish_id')
            .sort({ created_at: -1 }); // Tri par date de création décroissante

        res.json(orders);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des commandes du client',
            error: error.message 
        });
    }
};

// Récupérer les commandes d'un restaurant avec filtres
exports.getRestaurantOrders = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        const query = { restaurant_id: req.params.restaurantId };

        // Ajout des filtres optionnels
        if (status) {
            query.status = status;
        }
        if (startDate && endDate) {
            query.created_at = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.find(query)
            .populate('client_id')
            .populate('delivery_person_id')
            .populate('items.dish_id')
            .sort({ created_at: -1 }); // Tri par date de création décroissante

        res.json(orders);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des commandes du restaurant',
            error: error.message 
        });
    }
};

// Récupérer les commandes d'un livreur avec filtres
exports.getDeliveryPersonOrders = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        const query = { delivery_person_id: req.params.deliveryPersonId };

        // Ajout des filtres optionnels
        if (status) {
            query.status = status;
        }
        if (startDate && endDate) {
            query.created_at = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.find(query)
            .populate('client_id')
            .populate('restaurant_id')
            .populate('items.dish_id')
            .sort({ created_at: -1 }); // Tri par date de création décroissante

        res.json(orders);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des commandes du livreur',
            error: error.message 
        });
    }
};
