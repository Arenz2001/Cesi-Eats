const Delivery = require('../models/delivery.model');
const CryptoJS = require('crypto-js');
require('dotenv').config();

// Fonction de chiffrement d'une valeur
const encryptValue = (value) => {
    if (!value) return null;
    const secretKey = process.env.RIB_ENCRYPTION_KEY;
    if (!secretKey) {
        throw new Error('RIB_ENCRYPTION_KEY is not defined in .env');
    }
    return CryptoJS.AES.encrypt(value, secretKey).toString();
};

// Fonction de déchiffrement d'une valeur
const decryptValue = (encryptedValue) => {
    if (!encryptedValue) return null;
    try {
        const secretKey = process.env.RIB_ENCRYPTION_KEY;
        if (!secretKey) {
            throw new Error('RIB_ENCRYPTION_KEY is not defined in .env');
        }
        const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        // Si on ne peut pas déchiffrer, c'est probablement que la valeur n'est pas chiffrée
        return encryptedValue;
    }
};

// Fonction pour chiffrer un objet RIB
const encryptRIB = (rib) => {
    if (!rib || typeof rib !== 'object') return null;
    
    return {
        IBAN: rib.IBAN ? encryptValue(rib.IBAN) : null,
        RIB_Key: rib.RIB_Key ? encryptValue(rib.RIB_Key) : null
    };
};

// Fonction pour déchiffrer un objet RIB (non utilisée dans les routes actuelles)
const decryptRIB = (rib) => {
    if (!rib || typeof rib !== 'object') return null;
    
    return {
        IBAN: rib.IBAN ? decryptValue(rib.IBAN) : null,
        RIB_Key: rib.RIB_Key ? decryptValue(rib.RIB_Key) : null
    };
};

// Créer un nouveau livreur
exports.createDelivery = async (req, res) => {
    try {
        const deliveryData = { ...req.body };
        
        // Si un RIB est fourni, on le chiffre
        if (deliveryData.RIB) {
            deliveryData.RIB = encryptRIB(deliveryData.RIB);
        }

        const newDelivery = new Delivery(deliveryData);
        const savedDelivery = await newDelivery.save();
        
        // On ne renvoie pas le RIB chiffré dans la réponse
        const response = savedDelivery.toObject();
        if (response.RIB) {
            delete response.RIB;
        }
        
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer un livreur par ID
exports.getDeliveryById = async (req, res) => {
    try {
        const delivery = await Delivery.findOne({ Id_auth: req.params.id });
        if (!delivery) {
            return res.status(404).json({ message: 'Livreur non trouvé' });
        }

        // On ne renvoie pas le RIB dans la réponse
        const response = delivery.toObject();
        if (response.RIB) {
            delete response.RIB;
        }
        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un livreur
exports.updateDelivery = async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        // Si un nouveau RIB est fourni, on le chiffre
        if (updateData.RIB) {
            updateData.RIB = encryptRIB(updateData.RIB);
        }

        const updatedDelivery = await Delivery.findOneAndUpdate(
            { Id_auth: req.params.id },
            updateData,
            { new: true }
        );
        
        if (!updatedDelivery) {
            return res.status(404).json({ message: 'Livreur non trouvé' });
        }

        // On ne renvoie pas le RIB dans la réponse
        const response = updatedDelivery.toObject();
        if (response.RIB) {
            delete response.RIB;
        }
        
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un livreur
exports.deleteDelivery = async (req, res) => {
    try {
        const deletedDelivery = await Delivery.findOneAndDelete({ Id_auth: req.params.id });
        
        if (!deletedDelivery) {
            return res.status(404).json({ message: 'Livreur non trouvé' });
        }
        
        res.status(200).json({ message: 'Livreur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer le RIB d'un livreur par ID
exports.getDeliveryRibById = async (req, res) => {
    try {
        const delivery = await Delivery.findOne({ Id_auth: req.params.id });
        if (!delivery) {
            return res.status(404).json({ message: 'Livreur non trouvé' });
        }

        if (!delivery.RIB) {
            return res.status(404).json({ message: 'RIB non trouvé pour ce livreur' });
        }

        const decryptedRib = decryptRIB(delivery.RIB);
        res.status(200).json({ RIB: decryptedRib });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 