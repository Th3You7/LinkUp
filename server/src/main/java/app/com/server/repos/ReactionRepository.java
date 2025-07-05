package app.com.server.repos;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import app.com.server.model.Post;
import app.com.server.model.Reaction;
import app.com.server.model.User;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, String> {
    
    // Find all reactions by a specific post
    List<Reaction> findByPost(Post post);
    
    // Find all reactions by post ID
    List<Reaction> findByPostId(String postId);
    
    // Find all reactions by a specific user
    List<Reaction> findByUser(User user);
    
    // Find all reactions by user ID
    List<Reaction> findByUserId(UUID userId);
    
    // Find reaction by post and user (to check if user already reacted)
    Optional<Reaction> findByPostAndUser(Post post, User user);
    
    // Find reaction by post ID and user ID
    Optional<Reaction> findByPostIdAndUserId(String postId, UUID userId);
    
    // Find reactions by reaction name (like, love, etc.)
    List<Reaction> findByName(String name);
    
    // Find reactions by post and reaction name
    List<Reaction> findByPostAndName(Post post, String name);
    
    // Find reactions by post ID and reaction name
    List<Reaction> findByPostIdAndName(String postId, String name);
    
    // Count reactions by post
    long countByPost(Post post);
    
    // Count reactions by post ID
    long countByPostId(String postId);
    
    // Count reactions by user
    long countByUser(User user);
    
    // Count reactions by user ID
    long countByUserId(UUID userId);
    
    // Count reactions by post and reaction name
    long countByPostAndName(Post post, String name);
    
    // Count reactions by post ID and reaction name
    long countByPostIdAndName(String postId, String name);
    
    // Check if user has reacted to a post
    boolean existsByPostAndUser(Post post, User user);
    
    // Check if user has reacted to a post by IDs
    boolean existsByPostIdAndUserId(String postId, UUID userId);
} 