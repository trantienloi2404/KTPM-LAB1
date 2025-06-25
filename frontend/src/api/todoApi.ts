import axios from 'axios';
import { Todo, Note } from '../types/todo';

// Create axios instance with credentials
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoApi = {
  // Get all todos for a user
  getTodos: async (userId: number) => {
    try {
      const response = await api.get(`/todos?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Get todo by id
  getTodoById: async (id: number) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw error;
    }
  },

  // Create a new todo
  createTodo: async (todo: Todo) => {
    try {
      const response = await api.post('/todos', todo);
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update a todo
  updateTodo: async (id: number, todo: Todo) => {
    try {
      const response = await api.put(`/todos/${id}`, todo);
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Mark todo as done/undone
  markTodo: async (id: number, isDone: boolean) => {
    try {
      const response = await api.patch(`/todos/${id}`, isDone);
      return response.data;
    } catch (error) {
      console.error('Error marking todo:', error);
      throw error;
    }
  },

  // Delete a todo
  deleteTodo: async (id: number) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // Get all notes for a user
  getNotes: async (userId: number) => {
    try {
      const response = await api.get(`/notes?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  // Get note by id
  getNoteById: async (id: number) => {
    try {
      const response = await api.get(`/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching note:', error);
      throw error;
    }
  },

  // Create a new note
  createNote: async (note: Note) => {
    try {
      const response = await api.post('/notes', note);
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  // Update a note
  updateNote: async (id: number, note: Note) => {
    try {
      const response = await api.put(`/notes/${id}`, note);
      return response.data;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  // Delete a note
  deleteNote: async (id: number) => {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
};