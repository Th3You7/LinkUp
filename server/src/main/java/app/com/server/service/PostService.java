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

import app.com.server.dto.CreatePostDto;
import app.com.server.dto.PostDto;
import app.com.server.model.Post;
import app.com.server.model.User;
import app.com.server.repos.PostRepository;
import app.com.server.repos.UserRepository;

@Service
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Create a new post
    public PostDto createPost(CreatePostDto createPostDto) {
        // Validate input
        if (createPostDto.getContent() == null || createPostDto.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Post content is required");
        }
        if (createPostDto.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        
        // Check if user exists
        Optional<User> user = userRepository.findById(createPostDto.getUserId());
        if (user.isEmpty()) {
            throw new IllegalArgumentException("User not found with id: " + createPostDto.getUserId());
        }
        
        // Create new post
        Post post = new Post();
        post.setTitle(createPostDto.getTitle());
        post.setContent(createPostDto.getContent());
        post.setImage(createPostDto.getImage());
        post.setUser(user.get());
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        
        Post savedPost = postRepository.save(post);
        return convertToDto(savedPost);
    }
    
    // Get post by ID
    public PostDto getPostById(String id) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isPresent()) {
            return convertToDto(post.get());
        }
        throw new IllegalArgumentException("Post not found with id: " + id);
    }
    
    // Get all posts with pagination
    public Page<PostDto> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::convertToDto);
    }
    
    // Get posts by user ID
    public List<PostDto> getPostsByUserId(UUID userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Get posts by user ID with pagination
    public Page<PostDto> getPostsByUserId(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::convertToDto);
    }
    
    // Search posts by content or title
    public Page<PostDto> searchPosts(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByContentOrTitleContainingIgnoreCase(searchTerm, pageable)
                .map(this::convertToDto);
    }
    
    // Get posts by multiple users (for friends' posts)
    public Page<PostDto> getPostsByUserIds(List<UUID> userIds, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByUserIdInOrderByCreatedAtDesc(userIds, pageable)
                .map(this::convertToDto);
    }
    
    // Update post
    public PostDto updatePost(String id, CreatePostDto updatePostDto) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post post = existingPost.get();
            
            // Update fields if provided
            if (updatePostDto.getTitle() != null) {
                post.setTitle(updatePostDto.getTitle());
            }
            if (updatePostDto.getContent() != null) {
                post.setContent(updatePostDto.getContent());
            }
            if (updatePostDto.getImage() != null) {
                post.setImage(updatePostDto.getImage());
            }
            
            post.setUpdatedAt(LocalDateTime.now());
            
            Post savedPost = postRepository.save(post);
            return convertToDto(savedPost);
        }
        throw new IllegalArgumentException("Post not found with id: " + id);
    }
    
    // Delete post
    public void deletePost(String id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Post not found with id: " + id);
        }
    }
    
    // Delete posts by user ID
    public void deletePostsByUserId(UUID userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        postRepository.deleteAll(posts);
    }
    
    // Get posts created between two dates
    public List<PostDto> getPostsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return postRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    // Get post count by user
    public long getPostCountByUserId(UUID userId) {
        return postRepository.countByUserId(userId);
    }
    
    // Convert Post entity to PostDto
    private PostDto convertToDto(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setImage(post.getImage());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setUserId(post.getUser().getId());
        dto.setUserFirstName(post.getUser().getFirstName());
        dto.setUserLastName(post.getUser().getLastName());
        dto.setUsername(post.getUser().getUsername());
        dto.setCommentCount(post.getComments().size());
        dto.setReactionCount(post.getReactions().size());
        return dto;
    }
} 