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
import app.com.server.model.Reply;
import app.com.server.model.User;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, String> {
    
    // Find all replies by a specific comment
    List<Reply> findByCommentOrderByCreatedAtDesc(Comment comment);
    
    // Find all replies by comment ID
    List<Reply> findByCommentIdOrderByCreatedAtDesc(String commentId);
    
    // Find replies by comment with pagination
    Page<Reply> findByCommentOrderByCreatedAtDesc(Comment comment, Pageable pageable);
    
    // Find replies by comment ID with pagination
    Page<Reply> findByCommentIdOrderByCreatedAtDesc(String commentId, Pageable pageable);
    
    // Find all replies by a specific user
    List<Reply> findByUserOrderByCreatedAtDesc(User user);
    
    // Find all replies by user ID
    List<Reply> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    // Find replies by user with pagination
    Page<Reply> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    // Find replies by user ID with pagination
    Page<Reply> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    
    // Find replies containing specific content
    @Query("SELECT r FROM Reply r WHERE LOWER(r.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Reply> findByContentContainingIgnoreCase(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Count replies by comment
    long countByComment(Comment comment);
    
    // Count replies by comment ID
    long countByCommentId(String commentId);
    
    // Count replies by user
    long countByUser(User user);
    
    // Count replies by user ID
    long countByUserId(UUID userId);
} 