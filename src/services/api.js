
import axios from 'axios';

const API_URL = 'http://192.168.100.135:8080/api'; // Promeni na svoj URL kada deployas


const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});w


export const getAllPlaces = async () => {
  try {
    const response = await apiClient.get('/places');
    return response.data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
};

// Dohvatanje jednog mesta po ID
export const getPlaceById = async (id) => {
  try {
    const response = await apiClient.get(`/places/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching place by ID:', error);
    throw error;
  }
};

// Kreiranje novog mesta
export const createPlace = async (placeData) => {
  try {
    const response = await apiClient.post('/places', placeData);
    return response.data;
  } catch (error) {
    console.error('Error creating place:', error);
    throw error;
  }
};

// Ažuriranje mesta
export const updatePlace = async (id, placeData) => {
  try {
    const response = await apiClient.put(`/places/${id}`, placeData);
    return response.data;
  } catch (error) {
    console.error('Error updating place:', error);
    throw error;
  }
};

// Brisanje mesta
export const deletePlace = async (id) => {
  try {
    const response = await apiClient.delete(`/places/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting place:', error);
    throw error;
  }
};

// Dohvatanje mesta po kategoriji
export const getPlacesByCategory = async (category) => {
  try {
    const response = await apiClient.get('/places', {
      params: { category }  // axios automatski pravi ?category=Hotels
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching places by category:', error);
    throw error;
  }
};

// ============= AUTH API (ako imaš) =============
// Možeš dodati i ostale API pozive ovde...

export default apiClient;