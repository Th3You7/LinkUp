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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.com.server.dto.CreateFriendshipDto;
import app.com.server.dto.FriendshipResponseDto;
import app.com.server.service.FriendshipService;

@RestController
@RequestMapping("/api/friendships")
@CrossOrigin(origins = "*")
public class FriendshipController {
    
    @Autowired
    private FriendshipService friendshipService;
    
    // ==================== FRIENDSHIP REQUESTS ====================
    
    // Send a friendship request
    @PostMapping("/send")
    public ResponseEntity<FriendshipResponseDto> sendFriendshipRequest(
            @RequestParam UUID senderId,
            @RequestBody CreateFriendshipDto createFriendshipDto) {
        try {
            FriendshipResponseDto friendship = friendshipService.sendFriendshipRequest(senderId, createFriendshipDto);
            return new ResponseEntity<>(friendship, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Accept a friendship request
    @PutMapping("/{friendshipId}/accept")
    public ResponseEntity<FriendshipResponseDto> acceptFriendshipRequest(
            @PathVariable UUID friendshipId,
            @RequestParam UUID userId) {
        try {
            FriendshipResponseDto friendship = friendshipService.acceptFriendshipRequest(friendshipId, userId);
            return new ResponseEntity<>(friendship, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Reject a friendship request
    @DeleteMapping("/{friendshipId}/reject")
    public ResponseEntity<Void> rejectFriendshipRequest(
            @PathVariable UUID friendshipId,
            @RequestParam UUID userId) {
        try {
            friendshipService.rejectFriendshipRequest(friendshipId, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== FRIEND MANAGEMENT ====================
    
    // Remove a friend
    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFriend(
            @RequestParam UUID userId,
            @RequestParam UUID friendId) {
        try {
            friendshipService.removeFriend(userId, friendId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Get all friends of a user
    @GetMapping("/friends")
    public ResponseEntity<List<FriendshipResponseDto>> getFriends(@RequestParam UUID userId) {
        List<FriendshipResponseDto> friends = friendshipService.getFriends(userId);
        return new ResponseEntity<>(friends, HttpStatus.OK);
    }
    
    // ==================== BLOCKING ====================
    
    // Block a user
    @PostMapping("/block")
    public ResponseEntity<FriendshipResponseDto> blockUser(
            @RequestParam UUID userId,
            @RequestParam UUID userToBlockId) {
        try {
            FriendshipResponseDto friendship = friendshipService.blockUser(userId, userToBlockId);
            return new ResponseEntity<>(friendship, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // Unblock a user
    @DeleteMapping("/unblock")
    public ResponseEntity<Void> unblockUser(
            @RequestParam UUID userId,
            @RequestParam UUID userToUnblockId) {
        try {
            friendshipService.unblockUser(userId, userToUnblockId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
    
    // ==================== REQUESTS ====================
    
    // Get pending friendship requests received by user
    @GetMapping("/pending")
    public ResponseEntity<List<FriendshipResponseDto>> getPendingRequests(@RequestParam UUID userId) {
        List<FriendshipResponseDto> requests = friendshipService.getPendingRequests(userId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
    
    // Get sent friendship requests by user
    @GetMapping("/sent")
    public ResponseEntity<List<FriendshipResponseDto>> getSentRequests(@RequestParam UUID userId) {
        List<FriendshipResponseDto> requests = friendshipService.getSentRequests(userId);
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }
    
    // ==================== GENERAL ====================
    
    // Get all friendships of a user (friends, pending, blocked)
    @GetMapping("/all")
    public ResponseEntity<List<FriendshipResponseDto>> getAllFriendships(@RequestParam UUID userId) {
        List<FriendshipResponseDto> friendships = friendshipService.getAllFriendships(userId);
        return new ResponseEntity<>(friendships, HttpStatus.OK);
    }
    
    // Get friendship status between two users
    @GetMapping("/status")
    public ResponseEntity<FriendshipResponseDto> getFriendshipStatus(
            @RequestParam UUID userId1,
            @RequestParam UUID userId2) {
        FriendshipResponseDto friendship = friendshipService.getFriendshipStatus(userId1, userId2);
        if (friendship == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(friendship, HttpStatus.OK);
    }
    
    // Check if two users are friends
    @GetMapping("/check")
    public ResponseEntity<Boolean> areFriends(
            @RequestParam UUID userId1,
            @RequestParam UUID userId2) {
        boolean areFriends = friendshipService.areFriends(userId1, userId2);
        return new ResponseEntity<>(areFriends, HttpStatus.OK);
    }
    
    // Get friendship by ID
    @GetMapping("/{friendshipId}")
    public ResponseEntity<FriendshipResponseDto> getFriendshipById(@PathVariable UUID friendshipId) {
        try {
            FriendshipResponseDto friendship = friendshipService.getFriendshipById(friendshipId);
            return new ResponseEntity<>(friendship, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}