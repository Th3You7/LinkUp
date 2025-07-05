package app.com.server.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.RestController;

import app.com.server.dto.CreateReactionDto;
import app.com.server.dto.ReactionDto;
import app.com.server.service.ReactionService;

@RestController
@RequestMapping("/api/reactions")
@CrossOrigin(origins = "*")
public class ReactionController {
    
    @Autowired
    private ReactionService reactionService;
    
    // ==================== CREATE ====================
    
    // Create a new reaction
    @PostMapping
    public ResponseEntity<ReactionDto> createReaction(@RequestBody CreateReactionDto createReactionDto) {
        try {
            ReactionDto createdReaction = reactionService.createReaction(createReactionDto);
            return new ResponseEntity<>(createdReaction, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== READ ====================
    
    // Get reaction by ID
    @GetMapping("/{id}")
    public ResponseEntity<ReactionDto> getReactionById(@PathVariable String id) {
        try {
            ReactionDto reaction = reactionService.getReactionById(id);
            return new ResponseEntity<>(reaction, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Get all reactions by post ID
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ReactionDto>> getReactionsByPostId(@PathVariable String postId) {
        List<ReactionDto> reactions = reactionService.getReactionsByPostId(postId);
        return new ResponseEntity<>(reactions, HttpStatus.OK);
    }
    
    // Get all reactions by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReactionDto>> getReactionsByUserId(@PathVariable UUID userId) {
        List<ReactionDto> reactions = reactionService.getReactionsByUserId(userId);
        return new ResponseEntity<>(reactions, HttpStatus.OK);
    }
    
    // Get reactions by post ID and reaction name
    @GetMapping("/post/{postId}/name/{name}")
    public ResponseEntity<List<ReactionDto>> getReactionsByPostIdAndName(
            @PathVariable String postId, 
            @PathVariable String name) {
        List<ReactionDto> reactions = reactionService.getReactionsByPostIdAndName(postId, name);
        return new ResponseEntity<>(reactions, HttpStatus.OK);
    }
    
    // Get reactions by reaction name
    @GetMapping("/name/{name}")
    public ResponseEntity<List<ReactionDto>> getReactionsByName(@PathVariable String name) {
        List<ReactionDto> reactions = reactionService.getReactionsByName(name);
        return new ResponseEntity<>(reactions, HttpStatus.OK);
    }
    
    // Get user's reaction to a post
    @GetMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<ReactionDto> getUserReactionToPost(
            @PathVariable String postId, 
            @PathVariable UUID userId) {
        ReactionDto reaction = reactionService.getUserReactionToPost(postId, userId);
        if (reaction != null) {
            return new ResponseEntity<>(reaction, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Check if user has reacted to a post
    @GetMapping("/post/{postId}/user/{userId}/exists")
    public ResponseEntity<Boolean> hasUserReactedToPost(
            @PathVariable String postId, 
            @PathVariable UUID userId) {
        boolean hasReacted = reactionService.hasUserReactedToPost(postId, userId);
        return new ResponseEntity<>(hasReacted, HttpStatus.OK);
    }
    
    // Get reaction count by post
    @GetMapping("/post/{postId}/count")
    public ResponseEntity<Long> getReactionCountByPostId(@PathVariable String postId) {
        long count = reactionService.getReactionCountByPostId(postId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // Get reaction count by user
    @GetMapping("/user/{userId}/count")
    public ResponseEntity<Long> getReactionCountByUserId(@PathVariable UUID userId) {
        long count = reactionService.getReactionCountByUserId(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // Get reaction count by post and reaction name
    @GetMapping("/post/{postId}/name/{name}/count")
    public ResponseEntity<Long> getReactionCountByPostIdAndName(
            @PathVariable String postId, 
            @PathVariable String name) {
        long count = reactionService.getReactionCountByPostIdAndName(postId, name);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
    
    // ==================== UPDATE ====================
    
    // Update reaction
    @PutMapping("/{id}")
    public ResponseEntity<ReactionDto> updateReaction(@PathVariable String id, @RequestBody CreateReactionDto updateReactionDto) {
        try {
            ReactionDto updatedReaction = reactionService.updateReaction(id, updateReactionDto);
            return new ResponseEntity<>(updatedReaction, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== DELETE ====================
    
    // Delete reaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReaction(@PathVariable String id) {
        try {
            reactionService.deleteReaction(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete reaction by post and user (remove user's reaction to a post)
    @DeleteMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<Void> deleteReactionByPostAndUser(
            @PathVariable String postId, 
            @PathVariable UUID userId) {
        try {
            reactionService.deleteReactionByPostAndUser(postId, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // Delete reactions by user ID
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteReactionsByUserId(@PathVariable UUID userId) {
        reactionService.deleteReactionsByUserId(userId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Delete reactions by post ID
    @DeleteMapping("/post/{postId}")
    public ResponseEntity<Void> deleteReactionsByPostId(@PathVariable String postId) {
        reactionService.deleteReactionsByPostId(postId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
} 