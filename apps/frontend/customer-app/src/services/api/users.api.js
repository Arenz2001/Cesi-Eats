import { API_ENDPOINTS, getAuthHeaders } from '@/config/api.config';

class UsersAPI {
    async getUserById(token, userId) {
        try {
            console.log('Fetching user data for ID:', userId);
            console.log('API URL:', `${API_ENDPOINTS.USERS}/${userId}`);
            console.log('Token présent:', !!token);
            console.log('Headers:', JSON.stringify(getAuthHeaders(token)));

            const response = await fetch(`${API_ENDPOINTS.USERS}/${userId}`, {
                method: 'GET',
                headers: getAuthHeaders(token),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la récupération des données utilisateur');
            }

            const data = await response.json();
            console.log('User data received:', data);
            return data;
        } catch (error) {
            console.error('Erreur API getUserById:', error);
            throw error;
        }
    }

    async updateUserProfile(token, userData) {
        try {
            const response = await fetch(`${API_ENDPOINTS.USERS}/${userData.Id_auth}`, {
                method: 'PUT',
                headers: getAuthHeaders(token),
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API updateUserProfile:', error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            const response = await fetch(API_ENDPOINTS.USERS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la création de l\'utilisateur');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur API createUser:', error);
            throw error;
        }
    }
}

export const usersAPI = new UsersAPI(); 