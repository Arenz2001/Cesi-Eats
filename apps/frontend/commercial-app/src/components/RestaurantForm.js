"use client";

import { useState } from 'react';

const RestaurantForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    cuisine: initialData?.cuisine || '',
    openingHours: initialData?.openingHours || '',
    active: initialData?.active ?? true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.cuisine.trim()) newErrors.cuisine = 'Le type de cuisine est requis';
    if (!formData.openingHours.trim()) newErrors.openingHours = 'Les horaires d\'ouverture sont requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-card-bg border border-border-color rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6 pb-4 border-b border-border-color">
        {initialData ? 'Modifier le restaurant' : 'Ajouter un nouveau restaurant'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
              Nom du restaurant
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.name ? 'border-red-500 bg-red-50' : 'border-border-color bg-white'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-text-primary mb-1">
              Adresse
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.address ? 'border-red-500 bg-red-50' : 'border-border-color bg-white'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-1">
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.phone ? 'border-red-500 bg-red-50' : 'border-border-color bg-white'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-text-primary mb-1">
              Type de cuisine
            </label>
            <input
              id="cuisine"
              name="cuisine"
              type="text"
              value={formData.cuisine}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.cuisine ? 'border-red-500 bg-red-50' : 'border-border-color bg-white'
              }`}
            />
            {errors.cuisine && (
              <p className="mt-1 text-sm text-red-600">{errors.cuisine}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="openingHours" className="block text-sm font-medium text-text-primary mb-1">
              Horaires d'ouverture
            </label>
            <input
              id="openingHours"
              name="openingHours"
              type="text"
              value={formData.openingHours}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.openingHours ? 'border-red-500 bg-red-50' : 'border-border-color bg-white'
              }`}
              placeholder="ex: 10h-22h du lundi au samedi"
            />
            {errors.openingHours && (
              <p className="mt-1 text-sm text-red-600">{errors.openingHours}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-border-color rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-text-primary">
              Restaurant actif
            </label>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border-color flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border-color text-text-secondary rounded-md hover:bg-secondary transition-colors focus:outline-none"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors focus:outline-none"
          >
            {initialData ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantForm; 