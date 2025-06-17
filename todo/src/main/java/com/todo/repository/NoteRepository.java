package com.todo.repository;

import com.todo.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserId(Long userId);
    List<Note> findByUserIdAndDateBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
} 