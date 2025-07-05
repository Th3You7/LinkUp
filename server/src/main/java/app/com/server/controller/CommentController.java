package app.com.server.controller;

import app.com.server.dto.CommentDto;
import app.com.server.dto.CreateCommentDto;
import app.com.server.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    // ==================== CREATE ====================
    
    // Create a new comment
    @PostMapping
    public ResponseEntity<CommentDto> createComment(@RequestBody CreateCommentDto createCommentDto) {
        try {
            CommentDto createdComment = commentService.createComment(createCommentDto);
            return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== READ ====================
    
    // Get comment by ID
    @GetMapping("/{id}")
    public ResponseEntity<CommentDto> getCommentById(@PathVariable String id) {
        try {
            CommentDto comment = commentService.getCommentById(id);
            return new ResponseEntity<>(comment, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Get all comments by post ID
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDto>> getCommentsByPostId(@PathVariable String postId) {
        List<CommentDto> comments = commentService.getCommentsByPostId(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
    
    // Get comments by post ID with pagination
    @GetMapping("/post/{postId}/page")
    public ResponseEntity<Page<CommentDto>> getCommentsByPostId(
            @PathVariable String postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CommentDto> comments = commentService.getCommentsByPostId(postId, page, size);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
    
    // Get all comments by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CommentDto>> getCommentsByUserId(@PathVariable UUID userId) {
        List<CommentDto> comments = commentService.getCommentsByUserId(userId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
    
    // Get comments by user ID with pagination
    @GetMapping("/user/{userId}/page")
    public ResponseEntity<Page<CommentDto>> getCommentsByUserId(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CommentDto> comments = commentService.getCommentsByUserId(userId, page, size);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
    
    // Get comment count by post
    @GetMapping("/post/{postId}/count")
    public ResponseEntity<Long> getCommentCountByPostId(@PathVariable String postId) {
        long count = commentService.getCommentCountByPostId(postId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // Get comment count by user
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getCommentCountByUserId(@PathVariable UUID userId) {
        long count = commentService.getCommentCountByUserId(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // ==================== SEARCH ====================
    
    // Search comments by content
    @GetMapping("/search")
    public ResponseEntity<Page<CommentDto>> searchComments(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<CommentDto> comments = commentService.searchComments(searchTerm, page, size);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }
    
    // ==================== UPDATE ====================
    
    // Update comment
    @PutMapping("/{id}")
    public ResponseEntity<CommentDto> updateComment(@PathVariable String id, @RequestBody CreateCommentDto updateCommentDto) {
        try {
            CommentDto updatedComment = commentService.updateComment(id, updateCommentDto);
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== DELETE ====================
    
    // Delete comment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id) {
        try {
            commentService.deleteComment(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete comments by user ID
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteCommentsByUserId(@PathVariable UUID userId) {
        commentService.deleteCommentsByUserId(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Delete comments by post ID
    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> deleteCommentsByPostId(@PathVariable String postId) {
        commentService.deleteCommentsByPostId(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
} 