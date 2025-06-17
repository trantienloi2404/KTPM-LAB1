package com.todo.service;

import com.todo.entity.Note;
import com.todo.repository.NoteRepository;
import com.todo.response.ApiResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    private final NoteRepository repo;

    public NoteService(NoteRepository repo) {
        this.repo = repo;
    }

    public ApiResponse<List<Note>> getAllByUser(Long userId) {
        return new ApiResponse<>(200, "Notes for user " + userId, repo.findByUserId(userId));
    }

    public ApiResponse<List<Note>> getByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return new ApiResponse<>(200, "Notes for user " + userId + " in date range", 
            repo.findByUserIdAndDateBetween(userId, startDate, endDate));
    }

    public ApiResponse<Note> getById(Long id) {
        return repo.findById(id)
                .map(note -> new ApiResponse<>(200, "Found", note))
                .orElse(new ApiResponse<>(404, "Not found", null));
    }

    public ApiResponse<Note> create(Note note) {
        return new ApiResponse<>(201, "Created", repo.save(note));
    }

    public ApiResponse<Note> update(Long id, Note updated) {
        Optional<Note> opt = repo.findById(id);
        if (opt.isEmpty()) return new ApiResponse<>(404, "Not found", null);

        Note n = opt.get();
        n.setTitle(updated.getTitle());
        n.setDescription(updated.getDescription());
        n.setDate(updated.getDate());
        return new ApiResponse<>(200, "Updated", repo.save(n));
    }

    public ApiResponse<Void> delete(Long id) {
        if (!repo.existsById(id)) {
            return new ApiResponse<>(404, "Not found", null);
        }
        repo.deleteById(id);
        return new ApiResponse<>(200, "Deleted", null);
    }
} 