export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
    USERS: `https://api-cesieats.arenz-proxmox.fr/customers/users`,
};

export const getAuthHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
}); 