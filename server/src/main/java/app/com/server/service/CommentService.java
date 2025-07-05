package app.com.server.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import app.com.server.dto.CommentDto;
import app.com.server.dto.CreateCommentDto;
import app.com.server.model.Comment;
import app.com.server.model.Post;
import app.com.server.model.User;
import app.com.server.repos.CommentRepository;
import app.com.server.repos.PostRepository;
import app.com.server.repos.UserRepository;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    // Create a new comment
    public CommentDto createComment(CreateCommentDto createCommentDto) {
        // Validate input
        if (createCommentDto.getContent() == null || createCommentDto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content is required");
        }
        if (createCommentDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (createCommentDto.getPostId() == null || createCommentDto.getPostId().trim().isEmpty()) {
            throw new IllegalArgumentException("Post ID is required");
        }
        
        // Check if user exists
        Optional<User> user = userRepository.findById(createCommentDto.getUserId());
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + createCommentDto.getUserId());
        }
        
        // Check if post exists
        Optional<Post> post = postRepository.findById(createCommentDto.getPostId());
        if (post.isEmpty()) {
            throw new IllegalArgumentException("Post not found with id: " + createCommentDto.getPostId());
        }
        
        // Create new comment
        Comment comment = new Comment();
        comment.setContent(createCommentDto.getContent());
        comment.setUser(user.get());
        comment.setPost(post.get());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        
        Comment savedComment = commentRepository.save(comment);
        return convertToDto(savedComment);
    }
    
    // Get comment by ID
    public CommentDto getCommentById(String id) {
        Optional<Comment> comment = commentRepository.findById(id);
        if (comment.isPresent()) {
            return convertToDto(comment.get());
        }
        throw new IllegalArgumentException("Comment not found with id: " + id);
    }
    
    // Get all comments by post ID
    public List<CommentDto> getCommentsByPostId(String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Get comments by post ID with pagination
    public Page<CommentDto> getCommentsByPostId(String postId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId, pageable)
                .map(this::convertToDto);
    }
    
    // Get all comments by user ID
    public List<CommentDto> getCommentsByUserId(UUID userId) {
        return commentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Get comments by user ID with pagination
    public Page<CommentDto> getCommentsByUserId(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return commentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::convertToDto);
    }
    
    // Search comments by content
    public Page<CommentDto> searchComments(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return commentRepository.findByContentContainingIgnoreCase(searchTerm, pageable)
                .map(this::convertToDto);
    }
    
    // Update comment
    public CommentDto updateComment(String id, CreateCommentDto updateCommentDto) {
        Optional<Comment> existingComment = commentRepository.findById(id);
        if (existingComment.isPresent()) {
            Comment comment = existingComment.get();
            
            // Update content if provided
            if (updateCommentDto.getContent() != null) {
                comment.setContent(updateCommentDto.getContent());
            }
            
            comment.setUpdatedAt(LocalDateTime.now());
            
            Comment savedComment = commentRepository.save(comment);
            return convertToDto(savedComment);
        }
        throw new IllegalArgumentException("Comment not found with id: " + id);
    }
    
    // Delete comment
    public void deleteComment(String id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Comment not found with id: " + id);
        }
    }
    
    // Delete comments by user ID
    public void deleteCommentsByUserId(UUID userId) {
        List<Comment> comments = commentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        commentRepository.deleteAll(comments);
    }
    
    // Delete comments by post ID
    public void deleteCommentsByPostId(String postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        commentRepository.deleteAll(comments);
    }
    
    // Get comment count by post
    public long getCommentCountByPostId(String postId) {
        return commentRepository.countByPostId(postId);
    }
    
    // Get comment count by user
    public long getCommentCountByUserId(UUID userId) {
        return commentRepository.countByUserId(userId);
    }
    
    // Convert Comment entity to CommentDto
    private CommentDto convertToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setUserId(comment.getUser().getId());
        dto.setUserFirstName(comment.getUser().getFirstName());
        dto.setUserLastName(comment.getUser().getLastName());
        dto.setUsername(comment.getUser().getUsername());
        dto.setPostId(comment.getPost().getId());
        dto.setReplyCount(comment.getReplies().size());
        return dto;
    }
} 