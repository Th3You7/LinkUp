package app.com.server.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.com.server.dto.CreatePostDto;
import app.com.server.dto.PostDto;
import app.com.server.service.PostService;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    
    @Autowired
    private PostService postService;
    
    // ==================== CREATE ====================
    
    // Create a new post
    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody CreatePostDto createPostDto) {
        try {
            PostDto createdPost = postService.createPost(createPostDto);
            return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== READ ====================
    
    // Get all posts with pagination
    @GetMapping
    public ResponseEntity<Page<PostDto>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostDto> posts = postService.getAllPosts(page, size);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    
    // Get post by ID
    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable String id) {
        try {
            PostDto post = postService.getPostById(id);
            return new ResponseEntity<>(post, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Get posts by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDto>> getPostsByUserId(@PathVariable UUID userId) {
        List<PostDto> posts = postService.getPostsByUserId(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    
    // Get posts by user ID with pagination
    @GetMapping("/user/{userId}/page")
    public ResponseEntity<Page<PostDto>> getPostsByUserId(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostDto> posts = postService.getPostsByUserId(userId, page, size);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    
    // Get post count by user
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getPostCountByUserId(@PathVariable UUID userId) {
        long count = postService.getPostCountByUserId(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // ==================== SEARCH ====================
    
    // Search posts by content or title
    @GetMapping("/search")
    public ResponseEntity<Page<PostDto>> searchPosts(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostDto> posts = postService.searchPosts(searchTerm, page, size);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    
    // Get posts by multiple users (for friends' posts)
    @PostMapping("/friends")
    public ResponseEntity<Page<PostDto>> getPostsByUserIds(
            @RequestBody List<UUID> userIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<PostDto> posts = postService.getPostsByUserIds(userIds, page, size);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }
    
    // Get posts by date range
    @GetMapping("/date-range")
    public ResponseEntity<List<PostDto>> getPostsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            List<PostDto> posts = postService.getPostsByDateRange(start, end);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== UPDATE ====================
    
    // Update post
    @PutMapping("/{id}")
    public ResponseEntity<PostDto> updatePost(@PathVariable String id, @RequestBody CreatePostDto updatePostDto) {
        try {
            PostDto updatedPost = postService.updatePost(id, updatePostDto);
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== DELETE ====================
    
    // Delete post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        try {
            postService.deletePost(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete posts by user ID
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deletePostsByUserId(@PathVariable UUID userId) {
        postService.deletePostsByUserId(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
} 