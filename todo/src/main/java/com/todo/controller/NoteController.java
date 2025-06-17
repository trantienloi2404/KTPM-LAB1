package com.todo.controller;

import com.todo.entity.Note;
import com.todo.response.ApiResponse;
import com.todo.service.NoteService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService service;

    public NoteController(NoteService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Note>>> getAllByUser(
            @RequestParam Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(service.getByDateRange(userId, startDate, endDate));
        }
        return ResponseEntity.ok(service.getAllByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Note>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Note>> create(@RequestBody Note note) {
        return ResponseEntity.ok(service.create(note));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Note>> update(@PathVariable Long id, @RequestBody Note updated) {
        return ResponseEntity.ok(service.update(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        return ResponseEntity.ok(service.delete(id));
    }
} 