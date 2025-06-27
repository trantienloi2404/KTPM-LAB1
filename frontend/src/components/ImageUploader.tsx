import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { imageApi } from "../api/imageApi";
import "../styles/ImageUploader.css";

interface ImageUploaderProps {
  noteId: string;
  userId: string;
  onImageUploaded: (imageData: any) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  noteId,
  userId,
  onImageUploaded,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should not exceed 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const imageData = await imageApi.uploadImage(file, noteId, userId);
      onImageUploaded(imageData);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="file-input"
        disabled={uploading || disabled}
      />

      <button
        className="upload-button"
        type="button"
        onClick={triggerFileInput}
        disabled={uploading || disabled}
        title="Upload an image"
      >
        {uploading ? (
          <FontAwesomeIcon icon={faSpinner} spin />
        ) : (
          <FontAwesomeIcon icon={faUpload} />
        )}
        <span>{uploading ? "Uploading..." : "Add Image"}</span>
      </button>

      {error && (
        <div className="upload-error">
          <FontAwesomeIcon icon={faExclamationCircle} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
