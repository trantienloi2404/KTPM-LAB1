import React from 'react';
import { Note } from '../types/todo';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => Promise<void>;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="note-item">
      <div className="note-content">
        <h3>{note.title}</h3>
        <p className="note-description">{note.description}</p>
        <p className="note-date">{formatDate(note.date)}</p>
      </div>
      <div className="note-actions">
        <button onClick={() => onEdit(note)} className="edit-button">
          Edit
        </button>
        <button onClick={() => onDelete(note.id!)} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteItem;