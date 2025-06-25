import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExpand, faTrash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { imageApi, ImageData } from '../api/imageApi';
import '../styles/ImageGallery.css';

interface ImageGalleryProps {
  images: ImageData[];
  onImageDeleted: (imageId: string) => void;
  disabled?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  onImageDeleted,
  disabled = false
}) => {
  const [expandedImage, setExpandedImage] = useState<ImageData | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const handleImageClick = (image: ImageData) => {
    setExpandedImage(image);
  };

  const closeExpandedImage = () => {
    setExpandedImage(null);
  };

  const handleDeleteImage = async (e: React.MouseEvent, imageId: string) => {
    e.stopPropagation();
    
    if (disabled) return;
    
    setDeletingImageId(imageId);
    
    try {
      const success = await imageApi.deleteImage(imageId);
      if (success) {
        onImageDeleted(imageId);
        
        // If the deleted image is currently expanded, close it
        if (expandedImage && expandedImage.id === imageId) {
          setExpandedImage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setDeletingImageId(null);
    }
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="image-gallery">
      <div className="gallery-grid">
        {images.map(image => (
          <div
            key={image.id}
            className="gallery-item"
            onClick={() => handleImageClick(image)}
          >
            <img src={image.url} alt="Note attachment" />
            
            {!disabled && (
              <button
                className="delete-image-btn"
                onClick={(e) => handleDeleteImage(e, image.id)}
                disabled={deletingImageId === image.id}
                title="Delete image"
              >
                {deletingImageId === image.id ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faTrash} />
                )}
              </button>
            )}
            
            <div className="image-overlay">
              <FontAwesomeIcon icon={faExpand} />
            </div>
          </div>
        ))}
      </div>

      {expandedImage && (
        <div className="expanded-image-overlay" onClick={closeExpandedImage}>
          <div className="expanded-image-container" onClick={e => e.stopPropagation()}>
            <button className="close-expanded-btn" onClick={closeExpandedImage}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <img src={expandedImage.url} alt="Expanded note attachment" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;