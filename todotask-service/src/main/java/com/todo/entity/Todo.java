package com.todo.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;

import java.io.Serializable;


@Entity
@Table(name = "todos")
public class Todo implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @JsonProperty("isDone")
    private boolean isDone;

    private OffsetDateTime time;

    private Long userId;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    @JsonProperty("isDone")
    public boolean isDone() { return isDone; }

    @JsonProperty("isDone")
    public void setDone(boolean done) { isDone = done; }

    public LocalDateTime getTime() { return time; }
    public void setTime(LocalDateTime time) { this.time = time; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}