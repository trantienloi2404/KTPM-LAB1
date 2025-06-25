import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { notificationApi, CreateNotificationDto } from "../api/notificationApi";
import { useNotifications } from "../context/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faTimes,
  faInfoCircle,
  faHeading,
  faCommentAlt,
  faFlagCheckered,
  faCodeBranch,
  faArrowDown,
  faArrowUp,
  faEquals,
} from "@fortawesome/free-solid-svg-icons";

interface NotificationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuth();
  const { fetchNotifications } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateNotificationDto>({
    title: "",
    message: "",
    priority: "normal",
    userId: user?.id.toString() || "",
  });
  const [jsonData, setJsonData] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriorityChange = (value: "low" | "normal" | "high") => {
    setFormData((prev) => ({
      ...prev,
      priority: value,
    }));
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value);

    if (!e.target.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        data: undefined,
      }));
      return;
    }

    try {
      const parsedData = JSON.parse(e.target.value);
      setFormData((prev) => ({
        ...prev,
        data: parsedData,
      }));
      setError(null);
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      setError("Title and message are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await notificationApi.createNotification({
        ...formData,
        userId: user?.id.toString() || "",
      });

      // Reset form
      setFormData({
        title: "",
        message: "",
        priority: "normal",
        userId: user?.id.toString() || "",
      });
      setJsonData("");

      // Fetch updated notifications
      fetchNotifications();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error creating notification:", err);
      setError("Failed to create notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="notification-form-container">
      <h3>Create New Notification</h3>

      {error && (
        <div className="notification-error">
          <FontAwesomeIcon icon={faInfoCircle} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="notification-form">
        <div className="form-group">
          <label htmlFor="title">
            <FontAwesomeIcon icon={faHeading} />
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter notification title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">
            <FontAwesomeIcon icon={faCommentAlt} />
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter notification message"
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">
            <FontAwesomeIcon icon={faFlagCheckered} />
            Priority
          </label>

          <div className="priority-options">
            <div className="priority-option">
              <input
                type="radio"
                id="priority-low"
                name="priority"
                checked={formData.priority === "low"}
                onChange={() => handlePriorityChange("low")}
              />
              <label htmlFor="priority-low">
                <FontAwesomeIcon icon={faArrowDown} className="priority-icon" />
                Low
              </label>
            </div>

            <div className="priority-option">
              <input
                type="radio"
                id="priority-normal"
                name="priority"
                checked={formData.priority === "normal"}
                onChange={() => handlePriorityChange("normal")}
              />
              <label htmlFor="priority-normal">
                <FontAwesomeIcon icon={faEquals} className="priority-icon" />
                Normal
              </label>
            </div>

            <div className="priority-option">
              <input
                type="radio"
                id="priority-high"
                name="priority"
                checked={formData.priority === "high"}
                onChange={() => handlePriorityChange("high")}
              />
              <label htmlFor="priority-high">
                <FontAwesomeIcon icon={faArrowUp} className="priority-icon" />
                High
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="data">
            <FontAwesomeIcon icon={faCodeBranch} />
            Additional Data (Optional - JSON format)
          </label>
          <textarea
            id="data"
            name="data"
            value={jsonData}
            onChange={handleJsonChange}
            placeholder='{"key": "value"}'
            rows={2}
          />
          <div className="form-helper">
            <FontAwesomeIcon icon={faInfoCircle} />
            Example: {"{"}&quot;orderId&quot;: &quot;123&quot;,
            &quot;amount&quot;: 1500{"}"}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-form-btn"
            onClick={handleCancel}
          >
            <FontAwesomeIcon icon={faTimes} />
            Cancel
          </button>

          <button
            type="submit"
            className="create-notification-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Notification"}
            <FontAwesomeIcon icon={faPaperPlane} className="icon-right" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationForm;
