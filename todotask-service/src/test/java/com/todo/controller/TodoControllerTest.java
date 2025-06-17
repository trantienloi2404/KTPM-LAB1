package com.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.entity.Todo;
import com.todo.response.ApiResponse;
import com.todo.service.TodoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TodoController.class)
public class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;

    @Autowired
    private ObjectMapper objectMapper;

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
    public void shouldGetAllTodosByUser() throws Exception {
        // given
        List<Todo> todos = Arrays.asList(todo1, todo2);
        ApiResponse<List<Todo>> response = new ApiResponse<>(200, "Todos for user " + userId, todos);
        
        when(todoService.getAllByUser(userId)).thenReturn(response);

        // when & then
        mockMvc.perform(get("/api/todos?userId=" + userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("Todos for user " + userId))
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].title").value("Test Todo 1"))
                .andExpect(jsonPath("$.data[1].title").value("Test Todo 2"));
    }

    @Test
    public void shouldGetTodoById() throws Exception {
        // given
        ApiResponse<Todo> response = new ApiResponse<>(200, "Found", todo1);
        
        when(todoService.getById(1L)).thenReturn(response);

        // when & then
        mockMvc.perform(get("/api/todos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("Found"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("Test Todo 1"));
    }

    @Test
    public void shouldReturnNotFoundForNonExistentTodo() throws Exception {
        // given
        ApiResponse<Todo> response = new ApiResponse<>(404, "Not found", null);
        
        when(todoService.getById(999L)).thenReturn(response);

        // when & then
        mockMvc.perform(get("/api/todos/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Not found"))
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    public void shouldCreateTodo() throws Exception {
        // given
        Todo newTodo = new Todo();
        newTodo.setUserId(userId);
        newTodo.setTitle("New Todo");
        newTodo.setDone(false);
        newTodo.setTime(LocalDateTime.now());
        
        Todo createdTodo = new Todo();
        createdTodo.setId(3L);
        createdTodo.setUserId(userId);
        createdTodo.setTitle("New Todo");
        createdTodo.setDone(false);
        createdTodo.setTime(newTodo.getTime());
        
        ApiResponse<Todo> response = new ApiResponse<>(201, "Created", createdTodo);
        
        when(todoService.create(any(Todo.class))).thenReturn(response);

        // when & then
        mockMvc.perform(post("/api/todos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newTodo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(201))
                .andExpect(jsonPath("$.message").value("Created"))
                .andExpect(jsonPath("$.data.id").value(3))
                .andExpect(jsonPath("$.data.title").value("New Todo"));
    }

    @Test
    public void shouldUpdateTodo() throws Exception {
        // given
        Todo updatedTodo = new Todo();
        updatedTodo.setTitle("Updated Title");
        updatedTodo.setDone(true);
        updatedTodo.setTime(LocalDateTime.now());
        
        Todo resultTodo = new Todo();
        resultTodo.setId(1L);
        resultTodo.setUserId(userId);
        resultTodo.setTitle("Updated Title");
        resultTodo.setDone(true);
        resultTodo.setTime(updatedTodo.getTime());
        
        ApiResponse<Todo> response = new ApiResponse<>(200, "Updated", resultTodo);
        
        when(todoService.update(eq(1L), any(Todo.class))).thenReturn(response);

        // when & then
        mockMvc.perform(put("/api/todos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedTodo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("Updated"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("Updated Title"))
                .andExpect(jsonPath("$.data.done").value(true));
    }

    @Test
    public void shouldMarkTodoAsRead() throws Exception {
        // given
        boolean markAsRead = true;
        
        Todo resultTodo = new Todo();
        resultTodo.setId(1L);
        resultTodo.setUserId(userId);
        resultTodo.setTitle("Test Todo 1");
        resultTodo.setDone(true);
        resultTodo.setTime(todo1.getTime());
        
        ApiResponse<Todo> response = new ApiResponse<>(200, "Marked as read", resultTodo);
        
        when(todoService.markAsRead(eq(1L), eq(true))).thenReturn(response);

        // when & then
        mockMvc.perform(patch("/api/todos/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(markAsRead)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("Marked as read"))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.done").value(true));
    }

    @Test
    public void shouldDeleteTodo() throws Exception {
        // given
        ApiResponse<Void> response = new ApiResponse<>(200, "Deleted", null);
        
        when(todoService.delete(1L)).thenReturn(response);

        // when & then
        mockMvc.perform(delete("/api/todos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").value("Deleted"))
                .andExpect(jsonPath("$.data").isEmpty());
    }
} 