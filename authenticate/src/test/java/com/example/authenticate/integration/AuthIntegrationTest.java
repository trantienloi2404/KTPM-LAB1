//package com.example.authenticate.integration;
//
//import com.example.authenticate.dto.AuthRequestDTO;
//import com.example.authenticate.entity.User;
//import com.example.authenticate.repository.UserRepository;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.http.MediaType;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.web.servlet.MockMvc;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@SpringBootTest
//@AutoConfigureMockMvc
//@ActiveProfiles("test") // This assumes you have a test profile with in-memory database
//public class AuthIntegrationTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @AfterEach
//    void cleanup() {
//        userRepository.deleteAll();
//    }
//
//    @Test
//    public void testFullRegistrationAndLoginFlow() throws Exception {
//        // Register a new user
//        AuthRequestDTO registerRequest = new AuthRequestDTO();
//        registerRequest.setUsername("integrationuser");
//        registerRequest.setPassword("integrationpass");
//
//        mockMvc.perform(post("/api/auth/register")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(registerRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value(201))
//                .andExpect(jsonPath("$.message").value("Registered successfully"));
//
//        // Verify user exists in repository
//        User savedUser = userRepository.findByUsername("integrationuser").orElse(null);
//        assertThat(savedUser).isNotNull();
//        assertThat(savedUser.getUsername()).isEqualTo("integrationuser");
//        assertThat(savedUser.getPassword()).isEqualTo("integrationpass");
//
//        // Login with the created user
//        AuthRequestDTO loginRequest = new AuthRequestDTO();
//        loginRequest.setUsername("integrationuser");
//        loginRequest.setPassword("integrationpass");
//
//        mockMvc.perform(post("/api/auth/login")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(loginRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value(200))
//                .andExpect(jsonPath("$.message").value("Login successful"));
//
//        // Try login with incorrect password
//        AuthRequestDTO wrongPasswordRequest = new AuthRequestDTO();
//        wrongPasswordRequest.setUsername("integrationuser");
//        wrongPasswordRequest.setPassword("wrongpassword");
//
//        mockMvc.perform(post("/api/auth/login")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(wrongPasswordRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value(401))
//                .andExpect(jsonPath("$.message").value("Invalid credentials"));
//    }
//
//    @Test
//    public void testRegisterDuplicateUsername() throws Exception {
//        // Create a user first
//        User existingUser = new User();
//        existingUser.setUsername("duplicateuser");
//        existingUser.setPassword("password");
//        userRepository.save(existingUser);
//
//        // Try to register with the same username
//        AuthRequestDTO registerRequest = new AuthRequestDTO();
//        registerRequest.setUsername("duplicateuser");
//        registerRequest.setPassword("anotherpassword");
//
//        mockMvc.perform(post("/api/auth/register")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(registerRequest)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value(409))
//                .andExpect(jsonPath("$.message").value("Username already exists"));
//    }
//}