//package com.example.authenticate.repository;
//
//import com.example.authenticate.entity.User;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
//
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@DataJpaTest
//public class UserRepositoryTest {
//
//    @Autowired
//    private TestEntityManager entityManager;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Test
//    public void shouldFindUserByUsername() {
//        // given
//        User user = new User();
//        user.setUsername("testuser");
//        user.setPassword("password");
//        entityManager.persist(user);
//        entityManager.flush();
//
//        // when
//        Optional<User> found = userRepository.findByUsername("testuser");
//
//        // then
//        assertThat(found).isPresent();
//        assertThat(found.get().getUsername()).isEqualTo("testuser");
//        assertThat(found.get().getPassword()).isEqualTo("password");
//    }
//
//    @Test
//    public void shouldReturnEmptyWhenUsernameNotFound() {
//        // when
//        Optional<User> found = userRepository.findByUsername("nonexistent");
//
//        // then
//        assertThat(found).isEmpty();
//    }
//}