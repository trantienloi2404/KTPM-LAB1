//package com.example.authenticate.service;
//
//import com.example.authenticate.dto.AuthRequestDTO;
//import com.example.authenticate.entity.User;
//import com.example.authenticate.repository.UserRepository;
//import com.example.authenticate.response.ApiResponse;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.util.Optional;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//import org.mockito.junit.jupiter.MockitoSettings;
//import org.mockito.quality.Strictness;
//
//@ExtendWith(MockitoExtension.class)
//@MockitoSettings(strictness = Strictness.LENIENT)
//public class AuthServiceTest {
//
//    @Mock
//    private UserRepository userRepository;
//
//    @InjectMocks
//    private AuthService authService;
//
//    private AuthRequestDTO validRequest;
//
//    @Mock
//    private User existingUser;
//
//    @BeforeEach
//    void setUp() {
//        validRequest = new AuthRequestDTO();
//        validRequest.setUsername("testuser");
//        validRequest.setPassword("password");
//
//        // Cấu hình đối tượng User mock
//        when(existingUser.getId()).thenReturn(1L);
//        when(existingUser.getUsername()).thenReturn("testuser");
//        when(existingUser.getPassword()).thenReturn("password");
//    }
//
//    @Test
//    void shouldRegisterNewUser() {
//        // given
//        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
//        when(userRepository.save(any(User.class))).thenReturn(existingUser);
//
//        // when
//        ApiResponse<Long> response = authService.register(validRequest);
//
//        // then
//        assertThat(response.getStatus()).isEqualTo(201);
//        assertThat(response.getMessage()).isEqualTo("Registered successfully");
//        assertThat(response.getData()).isEqualTo(1L);
//        verify(userRepository).save(any(User.class));
//    }
//
//    @Test
//    void shouldNotRegisterExistingUsername() {
//        // given
//        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(existingUser));
//
//        // when
//        ApiResponse<Long> response = authService.register(validRequest);
//
//        // then
//        assertThat(response.getStatus()).isEqualTo(409);
//        assertThat(response.getMessage()).isEqualTo("Username already exists");
//        assertThat(response.getData()).isNull();
//        verify(userRepository, never()).save(any(User.class));
//    }
//
//    @Test
//    void shouldLoginValidUser() {
//        // given
//        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(existingUser));
//
//        // when
//        ApiResponse<Long> response = authService.login(validRequest);
//
//        // then
//        assertThat(response.getStatus()).isEqualTo(200);
//        assertThat(response.getMessage()).isEqualTo("Login successful");
//        assertThat(response.getData()).isEqualTo(1L);
//    }
//
//    @Test
//    void shouldRejectLoginWithInvalidCredentials() {
//        // given
//        AuthRequestDTO invalidRequest = new AuthRequestDTO();
//        invalidRequest.setUsername("testuser");
//        invalidRequest.setPassword("wrongpassword");
//
//        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(existingUser));
//
//        // when
//        ApiResponse<Long> response = authService.login(invalidRequest);
//
//        // then
//        assertThat(response.getStatus()).isEqualTo(401);
//        assertThat(response.getMessage()).isEqualTo("Invalid credentials");
//        assertThat(response.getData()).isNull();
//    }
//
//    @Test
//    void shouldRejectLoginWithNonexistentUser() {
//        // given
//        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
//
//        // when
//        ApiResponse<Long> response = authService.login(validRequest);
//
//        // then
//        assertThat(response.getStatus()).isEqualTo(401);
//        assertThat(response.getMessage()).isEqualTo("Invalid credentials");
//        assertThat(response.getData()).isNull();
//    }
//}