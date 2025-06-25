import React, { useState, useEffect } from "react";
import { useTodo } from "../context/TodoContext";
import { useAuth } from "../context/AuthContext";
import TodoItem from "../components/TodoItem";
import NoteItem from "../components/NoteItem";
import TodoForm from "../components/TodoForm";
import NoteForm from "../components/NoteForm";
import { Todo, Note } from "../types/todo";

const TodoPage: React.FC = () => {
  const { user } = useAuth();
  const {
    todos,
    notes,
    loading,
    error,
    fetchTodos,
    fetchNotes,
    addTodo,
    updateTodo,
    toggleTodoStatus,
    deleteTodo,
    addNote,
    updateNote,
    deleteNote,
  } = useTodo();

  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState<"todos" | "notes">("todos");

  useEffect(() => {
    if (user) {
      fetchTodos();
      fetchNotes();
    }
  }, [user]);

  const handleAddTodo = () => {
    setEditingTodo(null);
    setShowTodoForm(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowTodoForm(true);
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setShowNoteForm(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowNoteForm(true);
  };

  const handleTodoSubmit = async (todoData: Omit<Todo, "id">) => {
    if (editingTodo) {
      await updateTodo(editingTodo.id!, { ...todoData, id: editingTodo.id });
    } else {
      await addTodo(todoData);
    }
    setShowTodoForm(false);
    setEditingTodo(null);
  };

  const handleNoteSubmit = async (
    noteData: Omit<Note, "id">,
    imagesToUpload?: File[]
  ) => {
    if (editingNote) {
      await updateNote(editingNote.id!, { ...noteData, id: editingNote.id });
    } else {
      await addNote(noteData, imagesToUpload);
    }
    setShowNoteForm(false);
    setEditingNote(null);
  };
  // Sort todos by date (most recent first)
  const sortedTodos = [...todos].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  // Sort notes by date (most recent first)
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!user) {
    return (
      <div className="todo-page">
        <h2>Please login to view your todos and notes</h2>
      </div>
    );
  }

  return (
    <div className="todo-page">
      <h1>Your Tasks and Notes</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button
          className={`tab ${activeTab === "todos" ? "active" : ""}`}
          onClick={() => setActiveTab("todos")}
        >
          Tasks ({todos.length})
        </button>
        <button
          className={`tab ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Notes ({notes.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "todos" ? (
          <div className="todos-container">
            <div className="actions-bar">
              <button onClick={handleAddTodo} className="add-button">
                Add New Task
              </button>
            </div>

            {showTodoForm && (
              <TodoForm
                onSubmit={handleTodoSubmit}
                initialData={editingTodo || undefined}
                onCancel={() => setShowTodoForm(false)}
                userId={user.id}
              />
            )}

            {loading ? (
              <div className="loading">Loading tasks...</div>
            ) : sortedTodos.length === 0 ? (
              <div className="empty-state">
                <p>
                  You don't have any tasks yet. Click the button above to add
                  one.
                </p>
              </div>
            ) : (
              <div className="todo-list">
                {sortedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodoStatus}
                    onEdit={handleEditTodo}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="notes-container">
            <div className="actions-bar">
              <button onClick={handleAddNote} className="add-button">
                Add New Note
              </button>
            </div>

            {showNoteForm && (
              <NoteForm
                onSubmit={handleNoteSubmit}
                initialData={editingNote || undefined}
                onCancel={() => setShowNoteForm(false)}
                userId={user.id}
              />
            )}

            {loading ? (
              <div className="loading">Loading notes...</div>
            ) : sortedNotes.length === 0 ? (
              <div className="empty-state">
                <p>
                  You don't have any notes yet. Click the button above to add
                  one.
                </p>
              </div>
            ) : (
              <div className="note-list">
                {sortedNotes.map((note) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={deleteNote}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;
