import React, { useState, useEffect } from "react";
import { Todo } from "../types/todo";

interface TodoFormProps {
  onSubmit: (todo: Omit<Todo, "id">) => Promise<void>;
  initialData?: Todo;
  onCancel: () => void;
  userId: number;
}

const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
  userId,
}) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState<{ title?: string; time?: string }>({});

  useEffect(() => {
    console.log("🟡 useEffect triggered. InitialData:", initialData);

    try {
      if (initialData) {
        setTitle(initialData.title);

        const date = new Date(initialData.time);
        console.log("🟢 Raw time from backend (ISO):", initialData.time);
        console.log("🔵 Date parsed:", date);
        console.log("🔵 Is valid date:", !isNaN(date.getTime()));

        if (!isNaN(date.getTime())) {
          const localDatetime = formatDateToInputValue(date);
          console.log("🟣 Formatted for datetime-local:", localDatetime);
          setTime(localDatetime);
        } else {
          console.warn(
            "🔴 Invalid date received. Using now:",
            initialData.time
          );
          const now = new Date();
          const fallback = formatDateToInputValue(now);
          setTime(fallback);
        }
      } else {
        const now = new Date();
        const defaultTime = formatDateToInputValue(now);
        console.log("🟠 No initialData. Using current time:", defaultTime);
        setTime(defaultTime);
      }
    } catch (error) {
      console.error("🔴 Error in useEffect while setting date:", error);
      const fallback = formatDateToInputValue(new Date());
      setTime(fallback);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: { title?: string; time?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!time) {
      newErrors.time = "Date and time are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      console.log("🟡 Submitting with title:", title);
      console.log("🟡 Submitting with time (input value):", time);

      const dateObj = new Date(time);
      console.log("🟢 Date object from input:", dateObj);
      console.log("🔵 Is valid date:", !isNaN(dateObj.getTime()));

      if (isNaN(dateObj.getTime())) {
        console.log("🔴 Invalid date. Aborting.");
        setErrors((prev) => ({ ...prev, time: "Invalid date format" }));
        return;
      }

      const iso = dateObj.toISOString();
      console.log("🟣 Converted to ISO:", iso);

      const todoData: Omit<Todo, "id"> = {
        title,
        time: iso,
        isDone: initialData ? initialData.isDone : false,
        userId,
      };

      await onSubmit(todoData);
      onCancel();
    } catch (error) {
      console.error("🔴 Error during submit:", error);
      setErrors((prev) => ({ ...prev, time: "Error processing date" }));
    }
  };

  return (
    <div className="form-container">
      <h2>{initialData ? "Edit Todo" : "Add New Todo"}</h2>
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
            onChange={(e) => {
              console.log(
                "🟡 User changed datetime-local input to:",
                e.target.value
              );
              setTime(e.target.value);
            }}
          />

          {errors.time && <div className="error-message">{errors.time}</div>}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {initialData ? "Update" : "Add"} Todo
          </button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

function formatDateToInputValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export default TodoForm;
