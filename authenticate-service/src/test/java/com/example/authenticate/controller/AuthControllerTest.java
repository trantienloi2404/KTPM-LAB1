//package com.example.authenticate.controller;
//
//import com.example.authenticate.dto.AuthRequestDTO;
//import com.example.authenticate.response.ApiResponse;
//import com.example.authenticate.service.AuthService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(AuthController.class)
//public class AuthControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockBean
//    private AuthService authService;
//
//    @Autowired
//    private ObjectMapper objectMapper;
//
//    @Test
//    public void shouldRegisterUser() throws Exception {
//        // given
//        AuthRequestDTO request = new AuthRequestDTO();
//        request.setUsername("testuser");
//        request.setPassword("password");
//
//        ApiResponse<Long> response = new ApiResponse<>(201, "Registered successfully", 1L);
//
//        when(authService.register(any(AuthRequestDTO.class))).thenReturn(response);
//
//        // when & then
//        mockMvc.perform(post("/api/auth/register")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value(201))
//                .andExpect(jsonPath("$.message").value("Registered successfully"))
//                .andExpect(jsonPath("$.data").value(1));
//    }
//
//    @Test
//    public void shouldLoginUser() throws Exception {
//        // given
//        AuthRequestDTO request = new AuthRequestDTO();
//        request.setUsername("testuser");
//        request.setPassword("password");
//
//        ApiResponse<Long> response = new ApiResponse<>(200, "Login successful", 1L);
//
//        when(authService.login(any(AuthRequestDTO.class))).thenReturn(response);
//
//        // when & then
//        mockMvc.perform(post("/api/auth/login")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value(200))
//                .andExpect(jsonPath("$.message").value("Login successful"))
//                .andExpect(jsonPath("$.data").value(1));
//    }
//
//    @Test
//    public void shouldReturnErrorOnInvalidCredentials() throws Exception {
//        // given
//        AuthRequestDTO request = new AuthRequestDTO();
//        request.setUsername("testuser");
//        request.setPassword("wrongpassword");
//
//        ApiResponse<Long> response = new ApiResponse<>(401, "Invalid credentials", null);
//
//        when(authService.login(any(AuthRequestDTO.class))).thenReturn(response);
//
//        // when & then
//        mockMvc.perform(post("/api/auth/login")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value(401))
//                .andExpect(jsonPath("$.message").value("Invalid credentials"))
//                .andExpect(jsonPath("$.data").isEmpty());
//    }
//}