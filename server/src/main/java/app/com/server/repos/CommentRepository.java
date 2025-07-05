package app.com.server.repos;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.com.server.model.Comment;
import app.com.server.model.Post;
import app.com.server.model.User;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    
    // Find all comments by a specific post
    List<Comment> findByPostOrderByCreatedAtDesc(Post post);
    
    // Find all comments by post ID
    List<Comment> findByPostIdOrderByCreatedAtDesc(String postId);
    
    // Find comments by post with pagination
    Page<Comment> findByPostOrderByCreatedAtDesc(Post post, Pageable pageable);
    
    // Find comments by post ID with pagination
    Page<Comment> findByPostIdOrderByCreatedAtDesc(String postId, Pageable pageable);
    
    // Find all comments by a specific user
    List<Comment> findByUserOrderByCreatedAtDesc(User user);
    
    // Find all comments by user ID
    List<Comment> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    // Find comments by user with pagination
    Page<Comment> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // Find comments by user ID with pagination
    Page<Comment> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    
    // Find comments containing specific content
    @Query("SELECT c FROM Comment c WHERE LOWER(c.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Comment> findByContentContainingIgnoreCase(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Count comments by post
    long countByPost(Post post);
    
    // Count comments by post ID
    long countByPostId(String postId);
    
    // Count comments by user
    long countByUser(User user);
    
    // Count comments by user ID
    long countByUserId(UUID userId);
} 