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

import app.com.server.dto.CreateReplyDto;
import app.com.server.dto.ReplyDto;
import app.com.server.mapper.ReplyMapper;
import app.com.server.model.Comment;
import app.com.server.model.Reply;
import app.com.server.model.User;
import app.com.server.repos.CommentRepository;
import app.com.server.repos.ReplyRepository;
import app.com.server.repos.UserRepository;

@Service
public class ReplyService {
    
    @Autowired
    private ReplyRepository replyRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private ReplyMapper replyMapper;
    
    // Create a new reply
    public ReplyDto createReply(CreateReplyDto createReplyDto) {
        // Validate input
        if (createReplyDto.getContent() == null || createReplyDto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Reply content is required");
        }
        if (createReplyDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (createReplyDto.getCommentId() == null || createReplyDto.getCommentId().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment ID is required");
        }
        
        // Check if user exists
        Optional<User> user = userRepository.findById(createReplyDto.getUserId());
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + createReplyDto.getUserId());
        }
        
        // Check if comment exists
        Optional<Comment> comment = commentRepository.findById(createReplyDto.getCommentId());
        if (comment.isEmpty()) {
            throw new IllegalArgumentException("Comment not found with id: " + createReplyDto.getCommentId());
        }
        
        // Create new reply using mapper
        Reply reply = replyMapper.toEntity(createReplyDto);
        reply.setUser(user.get());
        reply.setComment(comment.get());
        reply.setCreatedAt(LocalDateTime.now());
        reply.setUpdatedAt(LocalDateTime.now());
        
        Reply savedReply = replyRepository.save(reply);
        return replyMapper.toDto(savedReply);
    }
    
    // Get reply by ID
    public ReplyDto getReplyById(String id) {
        Optional<Reply> reply = replyRepository.findById(id);
        if (reply.isPresent()) {
            return replyMapper.toDto(reply.get());
        }
        throw new IllegalArgumentException("Reply not found with id: " + id);
    }
    
    // Get all replies by comment ID
    public List<ReplyDto> getRepliesByCommentId(String commentId) {
        return replyRepository.findByCommentIdOrderByCreatedAtDesc(commentId).stream()
                .map(replyMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get replies by comment ID with pagination
    public Page<ReplyDto> getRepliesByCommentId(String commentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return replyRepository.findByCommentIdOrderByCreatedAtDesc(commentId, pageable)
                .map(replyMapper::toDto);
    }
    
    // Get all replies by user ID
    public List<ReplyDto> getRepliesByUserId(UUID userId) {
        return replyRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(replyMapper::toDto)
                .collect(Collectors.toList());
    }
    
    // Get replies by user ID with pagination
    public Page<ReplyDto> getRepliesByUserId(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return replyRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(replyMapper::toDto);
    }
    
    // Search replies by content
    public Page<ReplyDto> searchReplies(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return replyRepository.findByContentContainingIgnoreCase(searchTerm, pageable)
                .map(replyMapper::toDto);
    }
    
    // Update reply
    public ReplyDto updateReply(String id, CreateReplyDto updateReplyDto) {
        Optional<Reply> existingReply = replyRepository.findById(id);
        if (existingReply.isPresent()) {
            Reply reply = existingReply.get();
            
            // Update content if provided
            if (updateReplyDto.getContent() != null) {
                reply.setContent(updateReplyDto.getContent());
            }
            
            reply.setUpdatedAt(LocalDateTime.now());
            
            Reply savedReply = replyRepository.save(reply);
            return replyMapper.toDto(savedReply);
        }
        throw new IllegalArgumentException("Reply not found with id: " + id);
    }
    
    // Delete reply
    public void deleteReply(String id) {
        if (replyRepository.existsById(id)) {
            replyRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Reply not found with id: " + id);
        }
    }
    
    // Delete replies by user ID
    public void deleteRepliesByUserId(UUID userId) {
        List<Reply> replies = replyRepository.findByUserIdOrderByCreatedAtDesc(userId);
        replyRepository.deleteAll(replies);
    }
    
    // Delete replies by comment ID
    public void deleteRepliesByCommentId(String commentId) {
        List<Reply> replies = replyRepository.findByCommentIdOrderByCreatedAtDesc(commentId);
        replyRepository.deleteAll(replies);
    }
    
    // Get reply count by comment
    public long getReplyCountByCommentId(String commentId) {
        return replyRepository.countByCommentId(commentId);
    }
    
    // Get reply count by user
    public long getReplyCountByUserId(UUID userId) {
        return replyRepository.countByUserId(userId);
    }
} 