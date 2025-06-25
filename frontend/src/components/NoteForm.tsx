import React, { useState, useEffect } from 'react';
import { Note } from '../types/todo';

interface NoteFormProps {
  onSubmit: (note: Omit<Note, 'id'>) => Promise<void>;
  initialData?: Note;
  onCancel: () => void;
  userId: number;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, initialData, onCancel, userId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string; date?: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      
      // Convert ISO string to local datetime-local format
      const noteDate = new Date(initialData.date);
      const localDatetime = new Date(noteDate.getTime() - noteDate.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      setDate(localDatetime);
    } else {
      // Default to current date/time
      const now = new Date();
      const localDatetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      
      setDate(localDatetime);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: { title?: string; description?: string; date?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const noteData: Omit<Note, 'id'> = {
      title,
      description,
      date: new Date(date).toISOString(),
      userId,
    };
    
    await onSubmit(noteData);
    onCancel();
  };

  return (
    <div className="form-container">
      <h2>{initialData ? 'Edit Note' : 'Add New Note'}</h2>
      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title"
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter note description"
            rows={4}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && <div className="error-message">{errors.date}</div>}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            {initialData ? 'Update' : 'Add'} Note
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;