package com.todo.repository;

import com.todo.entity.Todo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class TodoRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TodoRepository todoRepository;

    @Test
    public void shouldFindTodosByUserId() {
        // given
        Long userId1 = 1L;
        Long userId2 = 2L;

        Todo todo1 = new Todo();
        todo1.setTitle("Todo 1");
        todo1.setDone(false);
        todo1.setTime(LocalDateTime.now());
        todo1.setUserId(userId1);
        entityManager.persist(todo1);

        Todo todo2 = new Todo();
        todo2.setTitle("Todo 2");
        todo2.setDone(true);
        todo2.setTime(LocalDateTime.now());
        todo2.setUserId(userId1);
        entityManager.persist(todo2);

        Todo todo3 = new Todo();
        todo3.setTitle("Todo 3");
        todo3.setDone(false);
        todo3.setTime(LocalDateTime.now());
        todo3.setUserId(userId2);
        entityManager.persist(todo3);

        entityManager.flush();

        // when
        List<Todo> foundTodos = todoRepository.findByUserId(userId1);

        // then
        assertThat(foundTodos).hasSize(2);
        assertThat(foundTodos.get(0).getTitle()).isEqualTo("Todo 1");
        assertThat(foundTodos.get(1).getTitle()).isEqualTo("Todo 2");
    }

    @Test
    public void shouldReturnEmptyListWhenNoTodosForUser() {
        // when
        List<Todo> foundTodos = todoRepository.findByUserId(999L);

        // then
        assertThat(foundTodos).isEmpty();
    }
} 