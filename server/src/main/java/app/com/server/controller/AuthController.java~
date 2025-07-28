package app.com.server.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.com.server.dto.CreateUserDto;
import app.com.server.dto.LoginRequestDto;
import app.com.server.dto.LoginResponseDto;
import app.com.server.dto.RegisterResponseDto;
import app.com.server.dto.UserDto;
import app.com.server.mapper.UserMapper;
import app.com.server.model.User;
import app.com.server.repos.UserRepository;
import app.com.server.service.UserService;
import app.com.server.utils.JwtUtil;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CreateUserDto createUserDto) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(createUserDto.getUsername())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }

            // Check if email already exists
            if (userRepository.existsByEmail(createUserDto.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
            }

            // Create new user using mapper
            User user = userMapper.toEntity(createUserDto);
            user.setPassword(passwordEncoder.encode(createUserDto.getPassword()));

            User savedUser = userRepository.save(user);

            // Generate JWT token
            String token = jwtUtil.generateToken(savedUser.getUsername());

            // Create response DTO using mapper
            UserDto userDto = userMapper.toDto(savedUser);

            RegisterResponseDto.UserInfo userInfo = new RegisterResponseDto.UserInfo(
                userDto.getId(),
                userDto.getUsername(),
                userDto.getEmail(),
                userDto.getFirstName(),
                userDto.getLastName()
            );

            RegisterResponseDto response = new RegisterResponseDto(
                "User registered successfully",
                token,
                userInfo
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        try {
            if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
            }

            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails.getUsername());

            // Get user details from repository
            User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Create response DTO using mapper
            UserDto userDto = userMapper.toDto(user);

            LoginResponseDto.UserInfo userInfo = new LoginResponseDto.UserInfo(
                userDto.getId(),
                userDto.getUsername(),
                userDto.getEmail(),
                userDto.getFirstName(),
                userDto.getLastName()
            );

            LoginResponseDto response = new LoginResponseDto(
                "Login successful",
                token,
                userInfo
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid username or password"));
        }
    }
} 