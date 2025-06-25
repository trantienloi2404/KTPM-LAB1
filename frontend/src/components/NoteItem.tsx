import React, { useState, useEffect } from 'react';
import { Note } from '../types/todo';
import { formatDate } from '../utils/dateUtils';
import { imageApi, ImageData } from '../api/imageApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faImage } from '@fortawesome/free-solid-svg-icons';
import ImageGallery from './ImageGallery';

interface NoteItemProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => Promise<void>;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit, onDelete }) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [showImages, setShowImages] = useState(false);

  useEffect(() => {
    if (note.id) {
      checkForImages(note.id.toString());
    }
  }, [note.id]);

  const checkForImages = async (noteId: string) => {
    setLoadingImages(true);
    try {
      const noteImages = await imageApi.getImagesByNoteId(noteId);
      setImages(noteImages);
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleImageDeleted = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const toggleImages = () => {
    setShowImages(prev => !prev);
  };

  return (
    <div className="note-item">
      <div className="note-content">
        <h3>{note.title}</h3>
        <p className="note-description">{note.description}</p>
        <div className="note-footer">
          {/* <p className="note-date">{formatDate(note.date)}</p> */}
          {images.length > 0 && (
            <button 
              className="toggle-images-btn" 
              onClick={toggleImages}
              title={showImages ? "Hide images" : `Show ${images.length} images`}
            >
              <FontAwesomeIcon icon={faImage} />
              <span>{images.length}</span>
            </button>
          )}
        </div>
        
        {showImages && images.length > 0 && (
          <div className="note-images">
            <ImageGallery 
              images={images} 
              onImageDeleted={handleImageDeleted} 
            />
          </div>
        )}
      </div>
      <div className="note-actions">
        <button onClick={() => onEdit(note)} className="edit-button">
          <FontAwesomeIcon icon={faEdit} />
          Edit
        </button>
        <button onClick={() => onDelete(note.id!)} className="delete-button">
          <FontAwesomeIcon icon={faTrash} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteItem;