import React from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, isDone: boolean) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const handleToggle = async () => {
    await onToggle(todo.id!, !todo.isDone);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={`todo-item ${todo.isDone ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.isDone}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        <div className="todo-details">
          <h3 className={todo.isDone ? 'completed-text' : ''}>{todo.title}</h3>
          <p className="todo-date">{formatDate(todo.time)}</p>
        </div>
      </div>
      <div className="todo-actions">
        <button onClick={() => onEdit(todo)} className="edit-button">
          Edit
        </button>
        <button onClick={() => onDelete(todo.id!)} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;