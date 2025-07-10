package app.com.server.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.com.server.dto.CreateReactionDto;
import app.com.server.dto.ReactionDto;
import app.com.server.mapper.ReactionMapper;
import app.com.server.model.Post;
import app.com.server.model.Reaction;
import app.com.server.model.User;
import app.com.server.repos.PostRepository;
import app.com.server.repos.ReactionRepository;
import app.com.server.repos.UserRepository;

@Service
public class ReactionService {
    
    @Autowired
    private ReactionRepository reactionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private ReactionMapper reactionMapper;
    
    // Create a new reaction
    public ReactionDto createReaction(CreateReactionDto createReactionDto) {
        // Validate input
        if (createReactionDto.getName() == null || createReactionDto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Reaction name is required");
        }
        if (createReactionDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (createReactionDto.getPostId() == null || createReactionDto.getPostId().trim().isEmpty()) {
            throw new IllegalArgumentException("Post ID is required");
        }
        
        // Check if user exists
        Optional<User> user = userRepository.findById(createReactionDto.getUserId());
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + createReactionDto.getUserId());
        }
        
        // Check if post exists
        Optional<Post> post = postRepository.findById(createReactionDto.getPostId());
        if (post.isEmpty()) {
            throw new IllegalArgumentException("Post not found with id: " + createReactionDto.getPostId());
        }
        
        // Check if user already reacted to this post
        if (reactionRepository.existsByPostAndUser(post.get(), user.get())) {
            throw new IllegalArgumentException("User has already reacted to this post");
        }
        
        // Create new reaction using mapper
        Reaction reaction = reactionMapper.toEntity(createReactionDto);
        reaction.setUser(user.get());
        reaction.setPost(post.get());
        
        Reaction savedReaction = reactionRepository.save(reaction);
        return reactionMapper.toDto(savedReaction);
    }
    
    // Get reaction by ID
    public ReactionDto getReactionById(String id) {
        Optional<Reaction> reaction = reactionRepository.findById(id);
        if (reaction.isPresent()) {
            return reactionMapper.toDto(reaction.get());
        }
        throw new IllegalArgumentException("Reaction not found with id: " + id);
    }
    
    // Get all reactions by post ID
    public List<ReactionDto> getReactionsByPostId(String postId) {
        return reactionRepository.findByPostId(postId).stream()
                .map(reactionMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get all reactions by user ID
    public List<ReactionDto> getReactionsByUserId(UUID userId) {
        return reactionRepository.findByUserId(userId).stream()
                .map(reactionMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get reactions by post ID and reaction name
    public List<ReactionDto> getReactionsByPostIdAndName(String postId, String name) {
        return reactionRepository.findByPostIdAndName(postId, name).stream()
                .map(reactionMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get reactions by reaction name
    public List<ReactionDto> getReactionsByName(String name) {
        return reactionRepository.findByName(name).stream()
                .map(reactionMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Check if user has reacted to a post
    public boolean hasUserReactedToPost(String postId, UUID userId) {
        return reactionRepository.existsByPostIdAndUserId(postId, userId);
    }
    
    // Get user's reaction to a post
    public ReactionDto getUserReactionToPost(String postId, UUID userId) {
        Optional<Reaction> reaction = reactionRepository.findByPostIdAndUserId(postId, userId);
        if (reaction.isPresent()) {
            return reactionMapper.toDto(reaction.get());
        }
        return null;
    }
    
    // Update reaction
    public ReactionDto updateReaction(String id, CreateReactionDto updateReactionDto) {
        Optional<Reaction> existingReaction = reactionRepository.findById(id);
        if (existingReaction.isPresent()) {
            Reaction reaction = existingReaction.get();
            
            // Update name if provided
            if (updateReactionDto.getName() != null) {
                reaction.setName(updateReactionDto.getName());
            }
            
            Reaction savedReaction = reactionRepository.save(reaction);
            return reactionMapper.toDto(savedReaction);
        }
        throw new IllegalArgumentException("Reaction not found with id: " + id);
    }
    
    // Delete reaction
    public void deleteReaction(String id) {
        if (reactionRepository.existsById(id)) {
            reactionRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Reaction not found with id: " + id);
        }
    }
    
    // Delete reaction by post and user (remove user's reaction to a post)
    public void deleteReactionByPostAndUser(String postId, UUID userId) {
        Optional<Reaction> reaction = reactionRepository.findByPostIdAndUserId(postId, userId);
        if (reaction.isPresent()) {
            reactionRepository.delete(reaction.get());
        } else {
            throw new IllegalArgumentException("Reaction not found for post: " + postId + " and user: " + userId);
        }
    }
    
    // Delete reactions by user ID
    public void deleteReactionsByUserId(UUID userId) {
        List<Reaction> reactions = reactionRepository.findByUserId(userId);
        reactionRepository.deleteAll(reactions);
    }
    
    // Delete reactions by post ID
    public void deleteReactionsByPostId(String postId) {
        List<Reaction> reactions = reactionRepository.findByPostId(postId);
        reactionRepository.deleteAll(reactions);
    }
    
    // Get reaction count by post
    public long getReactionCountByPostId(String postId) {
        return reactionRepository.countByPostId(postId);
    }
    
    // Get reaction count by user
    public long getReactionCountByUserId(UUID userId) {
        return reactionRepository.countByUserId(userId);
    }
    
    // Get reaction count by post and reaction name
    public long getReactionCountByPostIdAndName(String postId, String name) {
        return reactionRepository.countByPostIdAndName(postId, name);
    }
} 