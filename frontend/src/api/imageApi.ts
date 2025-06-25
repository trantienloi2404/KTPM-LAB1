import axios from 'axios';

// Create axios instance with credentials
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export interface ImageData {
  id: string;
  url: string;
  publicId: string;
  noteId: string;
  userId: string;
  format: string;
  width: number;
  height: number;
  size: number;
  createdAt: string;
}

export const imageApi = {
  // Upload image to a note
  uploadImage: async (file: File, noteId: string, userId: string): Promise<ImageData> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('noteId', noteId);
      formData.append('userId', userId);
      
      // Set proper content type header - let the browser set the boundary
      const response = await api.post('/images', formData, {
        headers: {
          // Remove content-type here to let the browser set it with the correct boundary
          // 'Content-Type': 'multipart/form-data' is automatically set by the browser
        },
        // Add timeout to ensure request doesn't hang
        timeout: 30000,
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      // Add more detailed error logging
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },
  
  // Other methods remain the same...
  getImagesByNoteId: async (noteId: string): Promise<ImageData[]> => {
    try {
      const response = await api.get(`/images/note/${noteId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching images for note:', error);
      return [];
    }
  },
  
  getImageById: async (imageId: string): Promise<ImageData | null> => {
    try {
      const response = await api.get(`/images/${imageId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  },
  
  deleteImage: async (imageId: string): Promise<boolean> => {
    try {
      await api.delete(`/images/${imageId}`);
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  },
  
  deleteImagesByNoteId: async (noteId: string): Promise<boolean> => {
    try {
      await api.delete(`/images/note/${noteId}`);
      return true;
    } catch (error) {
      console.error('Error deleting images for note:', error);
      return false;
    }
  }
};