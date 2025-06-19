import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/todos';
const DEFAULT_USER_ID = 1; // Set default userId to 1

// Add axios interceptor for authentication
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchTodos = createAsyncThunk(
  'todo/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      // Add userId as a query parameter
      const response = await axios.get(`${API_URL}?userId=${DEFAULT_USER_ID}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching todos');
    }
  }
);

export const addTodo = createAsyncThunk(
  'todo/addTodo',
  async (todo, { rejectWithValue }) => {
    try {
      // Add userId and current time to the todo
      const todoWithMetadata = {
        ...todo,
        userId: DEFAULT_USER_ID,
        time: todo.time || '2025-06-18T08:39:56', // Use provided time or current time
        isDone: false // Initialize as not done
      };
      const response = await axios.post(`${API_URL}`, todoWithMetadata);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding todo');
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todo/updateTodo',
  async (todo, { rejectWithValue }) => {
    try {
      // Ensure userId is set
      const todoWithUserId = {
        ...todo,
        userId: todo.userId || DEFAULT_USER_ID
      };
      const response = await axios.put(`${API_URL}/${todo.id}`, todoWithUserId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating todo');
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todo/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting todo');
    }
  }
);

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        // Handle API response format - extract data from response wrapper
        state.todos = action.payload?.data || action.payload || [];
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        const newTodo = action.payload?.data || action.payload;
        if (newTodo) {
          state.todos.push(newTodo);
        }
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTodo = action.payload?.data || action.payload;
        if (updatedTodo) {
          const index = state.todos.findIndex((todo) => todo.id === updatedTodo.id);
          if (index !== -1) {
            state.todos[index] = updatedTodo;
          }
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;