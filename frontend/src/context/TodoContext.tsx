import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { todoApi } from '../api/todoApi';
import { Todo, Note, ApiResponse } from '../types/todo';
import { useAuth } from './AuthContext';

interface TodoContextType {
  todos: Todo[];
  notes: Note[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  fetchNotes: () => Promise<void>;
  addTodo: (todo: Omit<Todo, 'id'>) => Promise<void>;
  updateTodo: (id: number, todo: Todo) => Promise<void>;
  toggleTodoStatus: (id: number, isDone: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  addNote: (note: Omit<Note, 'id'>) => Promise<void>;
  updateNote: (id: number, note: Note) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
}

const TodoContext = createContext<TodoContextType>({
  todos: [],
  notes: [],
  loading: false,
  error: null,
  fetchTodos: async () => {},
  fetchNotes: async () => {},
  addTodo: async () => {},
  updateTodo: async () => {},
  toggleTodoStatus: async () => {},
  deleteTodo: async () => {},
  addNote: async () => {},
  updateNote: async () => {},
  deleteNote: async () => {},
});

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  // Fetch todos for the authenticated user
  const fetchTodos = async () => {
    if (!user) return;

    console.log("User: ", user);
    
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Todo[]> = await todoApi.getTodos(user.id);
      if (response.status === 200 && response.data) {
        setTodos(response.data);
      } else {
        setError(response.message || 'Failed to fetch todos');
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to fetch todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes for the authenticated user
  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Note[]> = await todoApi.getNotes(user.id);
      if (response.status === 200 && response.data) {
        setNotes(response.data);
      } else {
        setError(response.message || 'Failed to fetch notes');
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (todo: Omit<Todo, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Todo> = await todoApi.createTodo(todo as Todo);
      if (response.status === 201 && response.data) {
        setTodos(prevTodos => [...prevTodos, response.data]);
      } else {
        setError(response.message || 'Failed to create todo');
      }
    } catch (err) {
      console.error('Error creating todo:', err);
      setError('Failed to create todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing todo
  const updateTodo = async (id: number, todo: Todo) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Todo> = await todoApi.updateTodo(id, todo);
      if (response.status === 200 && response.data) {
        setTodos(prevTodos => 
          prevTodos.map(t => t.id === id ? response.data : t)
        );
      } else {
        setError(response.message || 'Failed to update todo');
      }
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo status (done/undone)
  const toggleTodoStatus = async (id: number, isDone: boolean) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Todo> = await todoApi.markTodo(id, isDone);
      if (response.status === 200 && response.data) {
        setTodos(prevTodos => 
          prevTodos.map(t => t.id === id ? response.data : t)
        );
      } else {
        setError(response.message || 'Failed to update todo status');
      }
    } catch (err) {
      console.error('Error updating todo status:', err);
      setError('Failed to update todo status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<void> = await todoApi.deleteTodo(id);
      if (response.status === 200) {
        setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
      } else {
        setError(response.message || 'Failed to delete todo');
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new note
  const addNote = async (note: Omit<Note, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Note> = await todoApi.createNote(note as Note);
      if (response.status === 201 && response.data) {
        setNotes(prevNotes => [...prevNotes, response.data]);
      } else {
        setError(response.message || 'Failed to create note');
      }
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing note
  const updateNote = async (id: number, note: Note) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<Note> = await todoApi.updateNote(id, note);
      if (response.status === 200 && response.data) {
        setNotes(prevNotes => 
          prevNotes.map(n => n.id === id ? response.data : n)
        );
      } else {
        setError(response.message || 'Failed to update note');
      }
    } catch (err) {
      console.error('Error updating note:', err);
      setError('Failed to update note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a note
  const deleteNote = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: ApiResponse<void> = await todoApi.deleteNote(id);
      if (response.status === 200) {
        setNotes(prevNotes => prevNotes.filter(n => n.id !== id));
      } else {
        setError(response.message || 'Failed to delete note');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load todos and notes when user is authenticated
  useEffect(() => {
    if (user) {
      fetchTodos();
      fetchNotes();
    }
  }, [user]);

  return (
    <TodoContext.Provider
      value={{
        todos,
        notes,
        loading,
        error,
        fetchTodos,
        fetchNotes,
        addTodo,
        updateTodo,
        toggleTodoStatus,
        deleteTodo,
        addNote,
        updateNote,
        deleteNote
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);