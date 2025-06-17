package com.todo.service;

import com.todo.entity.Todo;
import com.todo.repository.TodoRepository;
import com.todo.response.ApiResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoService todoService;

    private Todo todo1;
    private Todo todo2;
    private Long userId = 1L;

    @BeforeEach
    void setUp() {
        todo1 = new Todo();
        todo1.setId(1L);
        todo1.setTitle("Test Todo 1");
        todo1.setDone(false);
        todo1.setTime(LocalDateTime.now());
        todo1.setUserId(userId);

        todo2 = new Todo();
        todo2.setId(2L);
        todo2.setTitle("Test Todo 2");
        todo2.setDone(true);
        todo2.setTime(LocalDateTime.now());
        todo2.setUserId(userId);
    }

    @Test
    void shouldGetAllTodosByUser() {
        // given
        List<Todo> todos = Arrays.asList(todo1, todo2);
        when(todoRepository.findByUserId(userId)).thenReturn(todos);

        // when
        ApiResponse<List<Todo>> response = todoService.getAllByUser(userId);

        // then
        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(response.getMessage()).isEqualTo("Todos for user " + userId);
        assertThat(response.getData()).hasSize(2);
        assertThat(response.getData().get(0).getTitle()).isEqualTo("Test Todo 1");
        assertThat(response.getData().get(1).getTitle()).isEqualTo("Test Todo 2");
    }

    @Test
    void shouldGetTodoById() {
        // given
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo1));

        // when
        ApiResponse<Todo> response = todoService.getById(1L);

        // then
        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(response.getMessage()).isEqualTo("Found");
        assertThat(response.getData().getTitle()).isEqualTo("Test Todo 1");
    }

    @Test
    void shouldReturnNotFoundWhenTodoDoesNotExist() {
        // given
        when(todoRepository.findById(999L)).thenReturn(Optional.empty());

        // when
        ApiResponse<Todo> response = todoService.getById(999L);

        // then
        assertThat(response.getStatus()).isEqualTo(404);
        assertThat(response.getMessage()).isEqualTo("Not found");
        assertThat(response.getData()).isNull();
    }

    @Test
    void shouldCreateTodo() {
        // given
        Todo newTodo = new Todo();
        newTodo.setTitle("New Todo");
        newTodo.setDone(false);
        newTodo.setTime(LocalDateTime.now());
        newTodo.setUserId(userId);

        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> {
            Todo savedTodo = invocation.getArgument(0);
            savedTodo.setId(3L);
            return savedTodo;
        });

        // when
        ApiResponse<Todo> response = todoService.create(newTodo);

        // then
        assertThat(response.getStatus()).isEqualTo(201);
        assertThat(response.getMessage()).isEqualTo("Created");
        assertThat(response.getData().getId()).isEqualTo(3L);
        assertThat(response.getData().getTitle()).isEqualTo("New Todo");
    }

    @Test
    void shouldUpdateTodo() {
        // given
        Todo updatedTodo = new Todo();
        updatedTodo.setTitle("Updated Title");
        updatedTodo.setDone(true);
        LocalDateTime newTime = LocalDateTime.now().minusDays(1);
        updatedTodo.setTime(newTime);

        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo1));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        ApiResponse<Todo> response = todoService.update(1L, updatedTodo);

        // then
        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(response.getMessage()).isEqualTo("Updated");
        assertThat(response.getData().getTitle()).isEqualTo("Updated Title");
        assertThat(response.getData().isDone()).isTrue();
        assertThat(response.getData().getTime()).isEqualTo(newTime);
        
        // Original fields should remain unchanged
        assertThat(response.getData().getId()).isEqualTo(1L);
        assertThat(response.getData().getUserId()).isEqualTo(userId);
    }

    @Test
    void shouldNotUpdateNonExistentTodo() {
        // given
        Todo updatedTodo = new Todo();
        updatedTodo.setTitle("Updated Title");

        when(todoRepository.findById(999L)).thenReturn(Optional.empty());

        // when
        ApiResponse<Todo> response = todoService.update(999L, updatedTodo);

        // then
        assertThat(response.getStatus()).isEqualTo(404);
        assertThat(response.getMessage()).isEqualTo("Not found");
        assertThat(response.getData()).isNull();
        verify(todoRepository, never()).save(any(Todo.class));
    }

    @Test
    void shouldMarkTodoAsRead() {
        // given
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo1));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // when
        ApiResponse<Todo> response = todoService.markAsRead(1L, true);

        // then
        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(response.getMessage()).isEqualTo("Marked as read");
        assertThat(response.getData().isDone()).isTrue();
    }

    @Test
    void shouldNotMarkNonExistentTodoAsRead() {
        // given
        when(todoRepository.findById(999L)).thenReturn(Optional.empty());

        // when
        ApiResponse<Todo> response = todoService.markAsRead(999L, true);

        // then
        assertThat(response.getStatus()).isEqualTo(404);
        assertThat(response.getMessage()).isEqualTo("Not found");
        assertThat(response.getData()).isNull();
        verify(todoRepository, never()).save(any(Todo.class));
    }

    @Test
    void shouldDeleteTodo() {
        // given
        when(todoRepository.existsById(1L)).thenReturn(true);

        // when
        ApiResponse<Void> response = todoService.delete(1L);

        // then
        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(response.getMessage()).isEqualTo("Deleted");
        verify(todoRepository).deleteById(1L);
    }

    @Test
    void shouldNotDeleteNonExistentTodo() {
        // given
        when(todoRepository.existsById(999L)).thenReturn(false);

        // when
        ApiResponse<Void> response = todoService.delete(999L);

        // then
        assertThat(response.getStatus()).isEqualTo(404);
        assertThat(response.getMessage()).isEqualTo("Not found");
        verify(todoRepository, never()).deleteById(999L);
    }
} 