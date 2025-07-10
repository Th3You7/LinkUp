package app.com.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.com.server.dto.CommentDto;
import app.com.server.dto.CreateCommentDto;
import app.com.server.dto.CreatePostDto;
import app.com.server.dto.CreateReactionDto;
import app.com.server.dto.CreateReplyDto;
import app.com.server.dto.CreateUserDto;
import app.com.server.dto.PostDto;
import app.com.server.dto.ReactionDto;
import app.com.server.dto.ReplyDto;
import app.com.server.dto.UserDto;
import app.com.server.mapper.CommentMapper;
import app.com.server.mapper.PostMapper;
import app.com.server.mapper.ReactionMapper;
import app.com.server.mapper.ReplyMapper;
import app.com.server.mapper.UserMapper;
import app.com.server.model.Comment;
import app.com.server.model.Post;
import app.com.server.model.Reaction;
import app.com.server.model.Reply;
import app.com.server.model.User;

/**
 * Example service demonstrating how to use MapStruct mappers
 * This is for demonstration purposes - you can integrate these mappers
 * into your existing services
 */
@Service
public class ExampleMapperService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PostMapper postMapper;

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private ReplyMapper replyMapper;

    @Autowired
    private ReactionMapper reactionMapper;

    // User mapping examples
    public UserDto mapUserToDto(User user) {
        return userMapper.toDto(user);
    }

    public User mapCreateUserDtoToEntity(CreateUserDto createUserDto) {
        return userMapper.toEntity(createUserDto);
    }

    public List<UserDto> mapUsersToDtoList(List<User> users) {
        return userMapper.toDtoList(users);
    }

    // Post mapping examples
    public PostDto mapPostToDto(Post post) {
        return postMapper.toDto(post);
    }

    public Post mapCreatePostDtoToEntity(CreatePostDto createPostDto) {
        return postMapper.toEntity(createPostDto);
    }

    public List<PostDto> mapPostsToDtoList(List<Post> posts) {
        return postMapper.toDtoList(posts);
    }

    // Comment mapping examples
    public CommentDto mapCommentToDto(Comment comment) {
        return commentMapper.toDto(comment);
    }

    public Comment mapCreateCommentDtoToEntity(CreateCommentDto createCommentDto) {
        return commentMapper.toEntity(createCommentDto);
    }

    public List<CommentDto> mapCommentsToDtoList(List<Comment> comments) {
        return commentMapper.toDtoList(comments);
    }

    // Reply mapping examples
    public ReplyDto mapReplyToDto(Reply reply) {
        return replyMapper.toDto(reply);
    }

    public Reply mapCreateReplyDtoToEntity(CreateReplyDto createReplyDto) {
        return replyMapper.toEntity(createReplyDto);
    }

    public List<ReplyDto> mapRepliesToDtoList(List<Reply> replies) {
        return replyMapper.toDtoList(replies);
    }

    // Reaction mapping examples
    public ReactionDto mapReactionToDto(Reaction reaction) {
        return reactionMapper.toDto(reaction);
    }

    public Reaction mapCreateReactionDtoToEntity(CreateReactionDto createReactionDto) {
        return reactionMapper.toEntity(createReactionDto);
    }

    public List<ReactionDto> mapReactionsToDtoList(List<Reaction> reactions) {
        return reactionMapper.toDtoList(reactions);
    }
} 