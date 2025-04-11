"use strict";

const Order = require('../models/order.model');

// Récupérer les commandes disponibles pour livraison
exports.getAvailableOrders = async (req, res) => {
    try {
        // Recherche des commandes avec le statut "ready_for_delivery" (prêtes à être livrées)
        const availableOrders = await Order.find({ 
            status: { $in: ['accepted_by_restaurant', 'ready_for_delivery', 'in_preparation'] },
            delivery_person_id: null // Aucun livreur assigné
        })
        .populate('client_id', 'name email phone_number address') // Inclure les informations du client
        .populate('restaurant_id', 'name address') // Inclure les informations du restaurant
        .sort({ created_at: 1 }); // Tri par date (les plus anciennes en premier)

        console.log('Commandes disponibles (avant formatage):', availableOrders);

        // Transformer les données pour correspondre au format attendu par le frontend
        const formattedOrders = availableOrders.map(order => {
            return {
                id: order._id,
                orderId: order.order_id,
                customer: {
                    id: order.client_id?._id || "",
                    name: order.client_id?.name || "Client inconnu",
                    email: order.client_id?.email || "",
                    phone: order.client_id?.phone_number || ""
                },
                restaurant: {
                    id: order.restaurant_id?._id || "",
                    name: order.restaurant_id?.name || "Restaurant inconnu",
                    address: order.restaurant_id?.address || ""
                },
                deliveryAddress: order.delivery_address || "Adresse non spécifiée",
                items: order.items || [],
                totalPrice: order.total_price || 0,
                status: order.status,
                createdAt: order.created_at
            };
        });

        console.log('Commandes disponibles (après formatage):', formattedOrders);

        res.json(formattedOrders);
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes disponibles:', error);
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des commandes disponibles',
            error: error.message 
        });
    }
};

// Accepter une commande par un livreur
exports.acceptOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryPersonId } = req.body;

        // Vérifier si l'ID du livreur est fourni
        if (!deliveryPersonId) {
            return res.status(400).json({ message: 'ID du livreur requis' });
        }

        // Trouver la commande et vérifier qu'elle est disponible
        const order = await Order.findById(id);
        
        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }
        
        if (order.status !== 'accepted_by_restaurant' && order.status !== 'in_preparation' && order.status !== 'ready_for_delivery') {
            return res.status(400).json({ 
                message: `La commande n'est pas disponible pour livraison (statut actuel: ${order.status})` 
            });
        }
        
        if (order.delivery_person_id) {
            return res.status(400).json({ 
                message: 'Cette commande a déjà été assignée à un livreur' 
            });
        }

        // Mettre à jour la commande
        order.delivery_person_id = deliveryPersonId;
        order.status = 'accepted_by_delivery';
        order.pickup_time = new Date();
        
        await order.save();

        // Répondre avec la commande mise à jour
        const updatedOrder = await Order.findById(id)
            .populate('client_id')
            .populate('restaurant_id')
            .populate('delivery_person_id');

        res.json({
            message: 'Commande acceptée avec succès',
            order: updatedOrder
        });
        
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la commande:', error);
        res.status(500).json({ 
            message: 'Erreur lors de l\'acceptation de la commande',
            error: error.message 
        });
    }
};

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
