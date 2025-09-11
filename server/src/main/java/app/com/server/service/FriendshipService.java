package app.com.server.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.com.server.dto.CreateFriendshipDto;
import app.com.server.dto.FriendshipResponseDto;
import app.com.server.enums.FriendshipInvitationStatus;
import app.com.server.mapper.FriendshipMapper;
import app.com.server.model.Friendship;
import app.com.server.model.User;
import app.com.server.repos.FriendshipRepository;
import app.com.server.repos.UserRepository;

@Service
public class FriendshipService {
    
    @Autowired
    private FriendshipRepository friendshipRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FriendshipMapper friendshipMapper;
    
    // Send a friendship request
    public FriendshipResponseDto sendFriendshipRequest(UUID senderId, CreateFriendshipDto createFriendshipDto) {
        // Validate input
        if (createFriendshipDto.getReceiverEmail() == null || createFriendshipDto.getReceiverEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Receiver email is required");
        }
        
        // Find sender
        Optional<User> senderOpt = userRepository.findById(senderId);
        if (senderOpt.isEmpty()) {
            throw new IllegalArgumentException("Sender not found");
        }
        User sender = senderOpt.get();
        
        // Find receiver by email
        Optional<User> receiverOpt = userRepository.findByEmail(createFriendshipDto.getReceiverEmail());
        if (receiverOpt.isEmpty()) {
            throw new IllegalArgumentException("Receiver not found with email: " + createFriendshipDto.getReceiverEmail());
        }
        User receiver = receiverOpt.get();
        
        // Check if sender and receiver are the same
        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Cannot send friendship request to yourself");
        }
        
        // Check if friendship already exists
        if (friendshipRepository.existsFriendshipBetweenUsers(senderId, receiver.getId())) {
            throw new IllegalArgumentException("Friendship already exists between these users");
        }
        
        // Create friendship request
        Friendship friendship = friendshipMapper.toEntity(createFriendshipDto, sender, receiver);
        Friendship savedFriendship = friendshipRepository.save(friendship);
        
        return friendshipMapper.toResponseDto(savedFriendship);
    }
    
    // Accept a friendship request
    public FriendshipResponseDto acceptFriendshipRequest(UUID friendshipId, UUID userId) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findById(friendshipId);
        if (friendshipOpt.isEmpty()) {
            throw new IllegalArgumentException("Friendship request not found");
        }
        
        Friendship friendship = friendshipOpt.get();
        
        // Check if user is the receiver
        if (!friendship.getReceiver().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only accept friendship requests sent to you");
        }
        
        // Check if status is pending
        if (friendship.getStatus() != FriendshipInvitationStatus.PENDING) {
            throw new IllegalArgumentException("This friendship request is not pending");
        }
        
        // Update status to accepted
        friendship.setStatus(FriendshipInvitationStatus.ACCEPTED);
        friendship.setUpdatedAt(Instant.now());
        
        Friendship savedFriendship = friendshipRepository.save(friendship);
        return friendshipMapper.toResponseDto(savedFriendship);
    }
    
    // Reject a friendship request
    public void rejectFriendshipRequest(UUID friendshipId, UUID userId) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findById(friendshipId);
        if (friendshipOpt.isEmpty()) {
            throw new IllegalArgumentException("Friendship request not found");
        }
        
        Friendship friendship = friendshipOpt.get();
        
        // Check if user is the receiver
        if (!friendship.getReceiver().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only reject friendship requests sent to you");
        }
        
        // Delete the friendship request
        friendshipRepository.delete(friendship);
    }
    
    // Cancel a friendship request (for sender)
    public void cancelFriendshipRequest(UUID friendshipId, UUID userId) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findById(friendshipId);
        if (friendshipOpt.isEmpty()) {
            throw new IllegalArgumentException("Friendship request not found");
        }
        
        Friendship friendship = friendshipOpt.get();
        
        // Check if user is the sender
        if (!friendship.getSender().getId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel friendship requests sent by you");
        }
        
        // Check if status is pending
        if (friendship.getStatus() != FriendshipInvitationStatus.PENDING) {
            throw new IllegalArgumentException("You can only cancel pending friendship requests");
        }
        
        // Delete the friendship request
        friendshipRepository.delete(friendship);
    }
    
    // Block a user
    public FriendshipResponseDto blockUser(UUID userId, UUID userToBlockId) {
        // Check if users exist
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<User> userToBlockOpt = userRepository.findById(userToBlockId);
        
        if (userOpt.isEmpty() || userToBlockOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        
        User user = userOpt.get();
        User userToBlock = userToBlockOpt.get();
        
        // Check if trying to block yourself
        if (userId.equals(userToBlockId)) {
            throw new IllegalArgumentException("Cannot block yourself");
        }
        
        // Check if friendship already exists
        Optional<Friendship> existingFriendship = friendshipRepository.findBySenderIdAndReceiverId(userId, userToBlockId);
        if (existingFriendship.isEmpty()) {
            existingFriendship = friendshipRepository.findBySenderIdAndReceiverId(userToBlockId, userId);
        }
        
        Friendship friendship;
        if (existingFriendship.isPresent()) {
            friendship = existingFriendship.get();
            friendship.setStatus(FriendshipInvitationStatus.BLOCKED);
            friendship.setUpdatedAt(Instant.now());
        } else {
            friendship = new Friendship();
            friendship.setSender(user);
            friendship.setReceiver(userToBlock);
            friendship.setStatus(FriendshipInvitationStatus.BLOCKED);
            friendship.setCreatedAt(Instant.now());
            friendship.setUpdatedAt(Instant.now());
        }
        
        Friendship savedFriendship = friendshipRepository.save(friendship);
        return friendshipMapper.toResponseDto(savedFriendship);
    }
    
    // Unblock a user
    public void unblockUser(UUID userId, UUID userToUnblockId) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findBySenderIdAndReceiverId(userId, userToUnblockId);
        if (friendshipOpt.isEmpty()) {
            friendshipOpt = friendshipRepository.findBySenderIdAndReceiverId(userToUnblockId, userId);
        }
        
        if (friendshipOpt.isEmpty()) {
            throw new IllegalArgumentException("No friendship found between these users");
        }
        
        Friendship friendship = friendshipOpt.get();
        if (friendship.getStatus() != FriendshipInvitationStatus.BLOCKED) {
            throw new IllegalArgumentException("User is not blocked");
        }
        
        // Delete the friendship (unblock)
        friendshipRepository.delete(friendship);
    }
    
    // Remove a friend
    public void removeFriend(UUID userId, UUID friendId) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findBySenderIdAndReceiverId(userId, friendId);
        if (friendshipOpt.isEmpty()) {
            friendshipOpt = friendshipRepository.findBySenderIdAndReceiverId(friendId, userId);
        }
        
        if (friendshipOpt.isEmpty()) {
            throw new IllegalArgumentException("No friendship found between these users");
        }
        
        Friendship friendship = friendshipOpt.get();
        if (friendship.getStatus() != FriendshipInvitationStatus.ACCEPTED) {
            throw new IllegalArgumentException("Users are not friends");
        }
        
        // Delete the friendship
        friendshipRepository.delete(friendship);
    }
    
    // Get all friends of a user
    public List<FriendshipResponseDto> getFriends(UUID userId) {
        List<Friendship> friendships = friendshipRepository.findAcceptedFriendshipsByUserId(userId);
        return friendships.stream()
                .map(friendshipMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    // Get pending friendship requests received by user
    public List<FriendshipResponseDto> getPendingRequests(UUID userId) {
        List<Friendship> friendships = friendshipRepository.findPendingFriendshipRequests(userId);
        return friendships.stream()
                .map(friendshipMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    // Get sent friendship requests by user
    public List<FriendshipResponseDto> getSentRequests(UUID userId) {
        List<Friendship> friendships = friendshipRepository.findSentFriendshipRequests(userId);
        return friendships.stream()
                .map(friendshipMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    // Get all friendships of a user (friends, pending, blocked)
    public List<FriendshipResponseDto> getAllFriendships(UUID userId) {
        List<Friendship> friendships = friendshipRepository.findByUserId(userId);
        return friendships.stream()
                .map(friendshipMapper::toResponseDto)
                .collect(Collectors.toList());
    }
    
    // Get friendship status between two users
    public FriendshipResponseDto getFriendshipStatus(UUID userId1, UUID userId2) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findBySenderIdAndReceiverId(userId1, userId2);
        if (friendshipOpt.isEmpty()) {
            friendshipOpt = friendshipRepository.findBySenderIdAndReceiverId(userId2, userId1);
        }
        
        if (friendshipOpt.isEmpty()) {
            return null; // No friendship exists
        }
        
        return friendshipMapper.toResponseDto(friendshipOpt.get());
    }
    
    // Check if two users are friends
    public boolean areFriends(UUID userId1, UUID userId2) {
        return friendshipRepository.findAcceptedFriendshipsByUserId(userId1).stream()
                .anyMatch(f -> f.getSender().getId().equals(userId2) || f.getReceiver().getId().equals(userId2));
    }
    
    // Get friendship by ID
    public FriendshipResponseDto getFriendshipById(UUID friendshipId) {
        Optional<Friendship> friendshipOpt = friendshipRepository.findById(friendshipId);
        if (friendshipOpt.isEmpty()) {
            throw new IllegalArgumentException("Friendship not found");
        }
        
        return friendshipMapper.toResponseDto(friendshipOpt.get());
    }
}
