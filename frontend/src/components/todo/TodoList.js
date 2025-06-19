import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Paper,
  Typography,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from '../../store/slices/todoSlice';

function TodoList() {
  const dispatch = useDispatch();
  const { todos, loading } = useSelector((state) => state.todo);
  const [newTodo, setNewTodo] = useState('');
  const [editTodo, setEditTodo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      dispatch(addTodo({ 
        title: newTodo, 
        time: new Date().toISOString(), // Current time
        userId: 1 // Default userId
      }));
      setNewTodo('');
    }
  };

  const handleUpdateTodo = () => {
    if (editTodo && editTodo.title.trim()) {
      dispatch(updateTodo(editTodo));
      setEditTodo(null);
      setOpenDialog(false);
    }
  };

  const handleDeleteTodo = (id) => {
    dispatch(deleteTodo(id));
  };

  const handleToggleComplete = (todo) => {
    dispatch(updateTodo({ 
      ...todo, 
      isDone: !todo.isDone // Changed from 'completed' to 'isDone' to match backend
    }));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h5" gutterBottom>
          Add New Todo
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Enter new todo"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTodo}
            disabled={loading}
          >
            Add
          </Button>
        </Box>
      </Paper>

      <Paper>
        <List>
          {loading ? (
            <ListItem>
              <ListItemText primary="Loading todos..." />
            </ListItem>
          ) : Array.isArray(todos) && todos.length > 0 ? todos.map((todo) => (
            <ListItem
              key={todo.id}
              divider
              secondaryAction={
                <Box>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      setEditTodo(todo);
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <Checkbox
                checked={todo.isDone} // Changed from 'completed' to 'isDone' to match backend
                onChange={() => handleToggleComplete(todo)}
              />
              <ListItemText
                primary={todo.title}
                // secondary={new Date(todo.time).toLocaleString()} // Display formatted time
                sx={{
                  textDecoration: todo.isDone ? 'line-through' : 'none', // Changed from 'completed' to 'isDone'
                }}
              />
            </ListItem>
          )) : (
            <ListItem>
              <ListItemText primary="No todos found. Add some todos to get started!" />
            </ListItem>
          )}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={editTodo?.title || ''}
            onChange={(e) =>
              setEditTodo({ ...editTodo, title: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateTodo} disabled={loading}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TodoList;