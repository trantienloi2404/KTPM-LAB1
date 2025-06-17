package com.todo.service;

import com.todo.entity.Todo;
import com.todo.repository.TodoRepository;
import com.todo.response.ApiResponse;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class TodoService {

    private final TodoRepository repo;
    private final CacheService cacheService;

    public TodoService(TodoRepository repo, CacheService cacheService) {
        this.repo = repo;
        this.cacheService = cacheService;
    }

    @Cacheable(value = "todos", key = "#userId")
    public ApiResponse<List<Todo>> getAllByUser(Long userId) {
        return new ApiResponse<>(200, "Todos for user " + userId, repo.findByUserId(userId)); // OK
    }

    @Cacheable(value = "todos", key = "#userId + '-' + #startDate + '-' + #endDate")
    public ApiResponse<List<Todo>> getByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return new ApiResponse<>(200, "Todos for user " + userId + " in date range", 
            repo.findByUserIdAndTimeBetween(userId, startDate, endDate));
    }

    @Cacheable(value = "todo", key = "#id")
    public ApiResponse<Todo> getById(Long id) {
        return repo.findById(id)
                .map(todo -> new ApiResponse<>(200, "Found", todo)) // OK
                .orElse(new ApiResponse<>(404, "Not found", null)); // Not Found
    }

    @CacheEvict(value = {"todos", "todo"}, allEntries = true)
    public ApiResponse<Todo> create(Todo todo) {
        ApiResponse<Todo> response = new ApiResponse<>(201, "Created", repo.save(todo)); // Created
        // Cache the new todo
        cacheService.setCache("todo:" + todo.getId(), response.getData(), 1, TimeUnit.HOURS);
        return response;
    }

    @CacheEvict(value = {"todos", "todo"}, allEntries = true)
    public ApiResponse<Todo> update(Long id, Todo updated) {
        Optional<Todo> opt = repo.findById(id);
        if (opt.isEmpty()) return new ApiResponse<>(404, "Not found", null); // Not Found

        Todo t = opt.get();
        t.setTitle(updated.getTitle());
        t.setDone(updated.isDone());
        t.setTime(updated.getTime());
        ApiResponse<Todo> response = new ApiResponse<>(200, "Updated", repo.save(t)); // OK
        // Update cache
        cacheService.setCache("todo:" + id, response.getData(), 1, TimeUnit.HOURS);
        return response;
    }

    @CacheEvict(value = {"todos", "todo"}, allEntries = true)
    public ApiResponse<Todo> markAsRead(Long id, boolean markAsRead) {
        Optional<Todo> opt = repo.findById(id);
        if (opt.isEmpty()) return new ApiResponse<>(404, "Not found", null); // Not Found

        Todo t = opt.get();
        t.setDone(markAsRead);
        ApiResponse<Todo> response = new ApiResponse<>(200, "Marked as read", repo.save(t)); // OK
        // Update cache
        cacheService.setCache("todo:" + id, response.getData(), 1, TimeUnit.HOURS);
        return response;
    }

    @CacheEvict(value = {"todos", "todo"}, allEntries = true)
    public ApiResponse<Void> delete(Long id) {
        if (!repo.existsById(id)) return new ApiResponse<>(404, "Not found", null); // Not Found
        repo.deleteById(id);
        // Remove from cache
        cacheService.deleteCache("todo:" + id);
        return new ApiResponse<>(200, "Deleted", null); // OK
    }
}
