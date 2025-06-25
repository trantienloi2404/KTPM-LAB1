import React, { useState, useEffect } from 'react';
import { Todo } from '../types/todo';

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, 'id'>) => Promise<void>;
  initialData?: Todo;
  onCancel: () => void;
  userId: number;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, initialData, onCancel, userId }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      
      // Convert ISO string to local datetime-local format
      const date = new Date(initialData.time);
      const localDatetime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      setTime(localDatetime);
    } else {
      // Default to current date/time
      const now = new Date();
      const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      setTime(localDatetime);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: { title?: string; time?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!time) {
      newErrors.time = 'Date and time are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const todoData: Omit<Todo, 'id'> = {
      title,
      time: new Date(time).toISOString(),
      isDone: initialData ? initialData.isDone : false,
      userId,
    };
    
    await onSubmit(todoData);
    onCancel();
  };

  return (
    <div className="form-container">
      <h2>{initialData ? 'Edit Todo' : 'Add New Todo'}</h2>
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter todo title"
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="time">Date and Time</label>
          <input
            id="time"
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          {errors.time && <div className="error-message">{errors.time}</div>}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {initialData ? 'Update' : 'Add'} Todo
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoForm;