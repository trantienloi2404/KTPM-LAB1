package com.todo.controller;

import com.todo.entity.Todo;
import com.todo.response.ApiResponse;
import com.todo.service.TodoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Todo>>> getAllByUser(
            @RequestParam Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(service.getByDateRange(userId, startDate, endDate));
        }
        return ResponseEntity.ok(service.getAllByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Todo>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Todo>> create(@RequestBody Todo todo) {
        return ResponseEntity.ok(service.create(todo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Todo>> update(@PathVariable Long id, @RequestBody Todo updated) {
        return ResponseEntity.ok(service.update(id, updated));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Todo>> markAsRead(@PathVariable Long id, @RequestBody boolean markAsRead) {
        return ResponseEntity.ok(service.markAsRead(id, markAsRead));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        return ResponseEntity.ok(service.delete(id));
    }
}
