import React, { useState, useEffect, useRef } from "react";
import { Note } from "../types/todo";
import { toDateTimeLocalFormat, toISOString } from "../utils/dateUtils";
import ImageUploader from "./ImageUploader";
import ImageGallery from "./ImageGallery";
import { imageApi, ImageData } from "../api/imageApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faImage,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

interface NoteFormProps {
  onSubmit: (note: Omit<Note, "id">, imagesToUpload?: File[]) => Promise<void>;
  initialData?: Note;
  onCancel: () => void;
  userId: number;
}

const NoteForm: React.FC<NoteFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
  userId,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState<ImageData[]>([]);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [pendingImagePreviews, setPendingImagePreviews] = useState<string[]>(
    []
  );
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    date?: string;
    images?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setDate(toDateTimeLocalFormat(initialData.date));

      // Load images if editing an existing note
      if (initialData.id) {
        loadImages(initialData.id.toString());
      }
    } else {
      // Set current date/time as default
      setDate(toDateTimeLocalFormat(new Date()));
      // Clear any images if creating a new note
      setImages([]);
      setPendingImages([]);
      setPendingImagePreviews([]);
    }
  }, [initialData]);

  const loadImages = async (noteId: string) => {
    setLoadingImages(true);
    try {
      const noteImages = await imageApi.getImagesByNoteId(noteId);
      setImages(noteImages);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoadingImages(false);
    }
  };

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      date?: string;
      images?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const noteData: Omit<Note, "id"> = {
        title,
        description,
        date: toISOString(date),
        userId,
      };

      // When creating a new note, pass the pending images to be uploaded after note creation
      if (!initialData || !initialData.id) {
        await onSubmit(noteData, pendingImages);
      } else {
        await onSubmit(noteData);
      }

      onCancel();
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors((prev) => ({ ...prev, date: "Error processing data" }));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUploaded = (imageData: ImageData) => {
    setImages((prev) => [...prev, imageData]);
  };

  const handleImageDeleted = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Clear any previous errors
    setErrors((prev) => ({ ...prev, images: undefined }));

    // Validate file types and sizes
    const newFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      console.log(
        `Validating file: ${file.name} (${file.type}, ${file.size} bytes)`
      );

      if (!file.type.startsWith("image/")) {
        invalidFiles.push(`${file.name} is not an image file`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} exceeds 5MB size limit`);
        return;
      }

      newFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: invalidFiles.join(", "),
      }));
      return;
    }

    // Add new files to pending images
    setPendingImages((prev) => [...prev, ...newFiles]);

    // Create preview URLs for the pending images
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPendingImagePreviews((prev) => [...prev, ...newPreviews]);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePendingImage = (index: number) => {
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(pendingImagePreviews[index]);

    setPendingImages((prev) => prev.filter((_, i) => i !== index));
    setPendingImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="form-container">
      <h2>{initialData ? "Edit Note" : "Add New Note"}</h2>
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
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
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

        {/* Image Gallery for existing note */}
        {initialData && initialData.id && !loadingImages && (
          <ImageGallery
            images={images}
            onImageDeleted={handleImageDeleted}
            disabled={loading}
          />
        )}

        {/* Pending Image Previews for new note */}
        {pendingImagePreviews.length > 0 && (
          <div className="pending-images">
            <h3>Images to Upload</h3>
            <div className="pending-images-grid">
              {pendingImagePreviews.map((preview, index) => (
                <div key={index} className="pending-image-item">
                  <img src={preview} alt={`Pending upload ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-pending-btn"
                    onClick={() => removePendingImage(index)}
                    disabled={loading}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image uploader for existing note */}
        {initialData && initialData.id && (
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faImage} /> Attach Images
            </label>
            <ImageUploader
              noteId={initialData.id.toString()}
              userId={userId.toString()}
              onImageUploaded={handleImageUploaded}
              disabled={loading}
            />
          </div>
        )}

        {/* Image uploader for new note */}
        {(!initialData || !initialData.id) && (
          <div className="form-group">
            <label>
              <FontAwesomeIcon icon={faImage} /> Attach Images
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="file-input"
              disabled={loading}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="upload-button"
              onClick={handleFileSelect}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Select Images</span>
            </button>
            {errors.images && (
              <div className="error-message">{errors.images}</div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faTimes} /> Cancel
          </button>
          <button type="submit" className="submit-button" disabled={loading}>
            <FontAwesomeIcon icon={faSave} />{" "}
            {loading ? "Saving..." : initialData ? "Update" : "Add"} Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
