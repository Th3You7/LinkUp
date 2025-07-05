package app.com.server.controller;

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

import app.com.server.dto.CreateReplyDto;
import app.com.server.dto.ReplyDto;
import app.com.server.service.ReplyService;

@RestController
@RequestMapping("/api/replies")
@CrossOrigin(origins = "*")
public class ReplyController {
    
    @Autowired
    private ReplyService replyService;
    
    // ==================== CREATE ====================
    
    // Create a new reply
    @PostMapping
    public ResponseEntity<ReplyDto> createReply(@RequestBody CreateReplyDto createReplyDto) {
        try {
            ReplyDto createdReply = replyService.createReply(createReplyDto);
            return new ResponseEntity<>(createdReply, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== READ ====================
    
    // Get reply by ID
    @GetMapping("/{id}")
    public ResponseEntity<ReplyDto> getReplyById(@PathVariable String id) {
        try {
            ReplyDto reply = replyService.getReplyById(id);
            return new ResponseEntity<>(reply, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Get all replies by comment ID
    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<ReplyDto>> getRepliesByCommentId(@PathVariable String commentId) {
        List<ReplyDto> replies = replyService.getRepliesByCommentId(commentId);
        return new ResponseEntity<>(replies, HttpStatus.OK);
    }
    
    // Get replies by comment ID with pagination
    @GetMapping("/comment/{commentId}/page")
    public ResponseEntity<Page<ReplyDto>> getRepliesByCommentId(
            @PathVariable String commentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReplyDto> replies = replyService.getRepliesByCommentId(commentId, page, size);
        return new ResponseEntity<>(replies, HttpStatus.OK);
    }
    
    // Get all replies by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReplyDto>> getRepliesByUserId(@PathVariable UUID userId) {
        List<ReplyDto> replies = replyService.getRepliesByUserId(userId);
        return new ResponseEntity<>(replies, HttpStatus.OK);
    }
    
    // Get replies by user ID with pagination
    @GetMapping("/user/{userId}/page")
    public ResponseEntity<Page<ReplyDto>> getRepliesByUserId(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReplyDto> replies = replyService.getRepliesByUserId(userId, page, size);
        return new ResponseEntity<>(replies, HttpStatus.OK);
    }
    
    // Get reply count by comment
    @GetMapping("/comment/{commentId}/count")
    public ResponseEntity<Long> getReplyCountByCommentId(@PathVariable String commentId) {
        long count = replyService.getReplyCountByCommentId(commentId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // Get reply count by user
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getReplyCountByUserId(@PathVariable UUID userId) {
        long count = replyService.getReplyCountByUserId(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // ==================== SEARCH ====================
    
    // Search replies by content
    @GetMapping("/search")
    public ResponseEntity<Page<ReplyDto>> searchReplies(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ReplyDto> replies = replyService.searchReplies(searchTerm, page, size);
        return new ResponseEntity<>(replies, HttpStatus.OK);
    }
    
    // ==================== UPDATE ====================
    
    // Update reply
    @PutMapping("/{id}")
    public ResponseEntity<ReplyDto> updateReply(@PathVariable String id, @RequestBody CreateReplyDto updateReplyDto) {
        try {
            ReplyDto updatedReply = replyService.updateReply(id, updateReplyDto);
            return new ResponseEntity<>(updatedReply, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== DELETE ====================
    
    // Delete reply
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReply(@PathVariable String id) {
        try {
            replyService.deleteReply(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete replies by user ID
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteRepliesByUserId(@PathVariable UUID userId) {
        replyService.deleteRepliesByUserId(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Delete replies by comment ID
    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<Void> deleteRepliesByCommentId(@PathVariable String commentId) {
        replyService.deleteRepliesByCommentId(commentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
} 