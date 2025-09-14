package app.com.server.service;


import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import app.com.server.dto.ChatSessionDto;
import app.com.server.dto.MessageDto;
import app.com.server.dto.SendMessageRequest;
import app.com.server.mapper.ChatMapper;
import app.com.server.model.ChatParticipant;
import app.com.server.model.ChatSession;
import app.com.server.model.Message;
import app.com.server.model.User;
import app.com.server.repos.ChatParticipiantRepository;
import app.com.server.repos.ChatSessionRepository;
import app.com.server.repos.MessageRepository;
import app.com.server.repos.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class ChatService {
    private final ChatSessionRepository chatRepository;
    private final ChatParticipiantRepository chatParticipiantRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ChatMapper chatMapper;

    @Autowired
    public ChatService(ChatSessionRepository chatRepository, ChatParticipiantRepository chatParticipiantRepository, MessageRepository messageRepository, UserRepository userRepository, ChatMapper chatMapper) {
        this.chatRepository = chatRepository;
        this.chatParticipiantRepository = chatParticipiantRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.chatMapper = chatMapper;
    }

    @Transactional
    public MessageDto sendMessage(SendMessageRequest request) {
       //create message

        // Create message
        Message message = new Message();
        message.setMessage(request.getMessage());
        message.setSender(request.getSender());
       
        // Set the chat session
        ChatSession chatSession = chatRepository.findById(UUID.fromString(request.getChatSessionId())).orElseThrow();
        message.setChatSession(chatSession);
        
        // Save message
        Message savedMessage = messageRepository.save(message);
        
        // Set last message
        chatSession.setLastMessage(savedMessage);
        chatRepository.save(chatSession);

        return chatMapper.mapToMessageDto(savedMessage);
    }

    @Transactional
    public Page<MessageDto> getMessages(String chatSessionId, int page) {
        Page<Message> messages = messageRepository.findByChatSession_IdOrderByCreatedAtDesc(UUID.fromString(chatSessionId), PageRequest.of(page, 10));
        return messages.map(chatMapper::mapToMessageDto);
    }

    @Transactional
    public void markRead(String ChatSessionId, String userId) {
        ChatParticipant participant = chatParticipiantRepository.findByChatSession_IdAndUser_Id(UUID.fromString(ChatSessionId), UUID.fromString(userId));
        participant.setLastReadAt(Instant.now());
    }

    @Transactional
    public void deleteSession(String chatSessionId) {
        chatRepository.deleteById(UUID.fromString(chatSessionId));
    }

    @Transactional
    public void deleteMessage(String messageId) {
        messageRepository.deleteById(UUID.fromString(messageId));
    }

    @Transactional
    public ChatSessionDto createChatSession(UUID userId1, UUID userId2) {
        // Check if chat session already exists between these users
        List<ChatParticipant> existingParticipants = chatParticipiantRepository.findAll();
        for (ChatParticipant participant : existingParticipants) {
            List<ChatParticipant> sessionParticipants = chatParticipiantRepository.findAllByChatSession_Id(participant.getChatSession().getId());
            if (sessionParticipants.size() == 2) {
                UUID user1Id = sessionParticipants.get(0).getUser().getId();
                UUID user2Id = sessionParticipants.get(1).getUser().getId();
                if ((user1Id.equals(userId1) && user2Id.equals(userId2)) || 
                    (user1Id.equals(userId2) && user2Id.equals(userId1))) {
                    return chatMapper.mapToChatSessionDto(participant.getChatSession());
                }
            }
        }

        // Create new chat session
        ChatSession chatSession = new ChatSession();
        chatSession = chatRepository.save(chatSession);

        // Add participants
        User user1 = userRepository.findById(userId1).orElseThrow(() -> new IllegalArgumentException("User not found: " + userId1));
        User user2 = userRepository.findById(userId2).orElseThrow(() -> new IllegalArgumentException("User not found: " + userId2));
        
        ChatParticipant participant1 = new ChatParticipant();
        participant1.setChatSession(chatSession);
        participant1.setUser(user1);
        chatParticipiantRepository.save(participant1);

        ChatParticipant participant2 = new ChatParticipant();
        participant2.setChatSession(chatSession);
        participant2.setUser(user2);
        chatParticipiantRepository.save(participant2);

        return chatMapper.mapToChatSessionDto(chatSession);
    }

    @Transactional
    public List<ChatSessionDto> getUserChatSessions(UUID userId) {
        List<ChatParticipant> userParticipants = chatParticipiantRepository.findAllByUser_Id(userId);
        
        return userParticipants.stream()
            .map(ChatParticipant::getChatSession)
            .map(chatMapper::mapToChatSessionDto)
            .toList();
    }

    @Transactional
    public List<ChatParticipant> getChatParticipants(String chatSessionId) {
        return chatParticipiantRepository.findAllByChatSession_Id(UUID.fromString(chatSessionId));
    }

    @Transactional
    public User getUserById(UUID userId) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    }

    @Transactional
    public ChatSession getChatSessionById(UUID sessionId) {
        return chatRepository.findById(sessionId).orElseThrow(() -> new IllegalArgumentException("Chat session not found: " + sessionId));
    }

    @Transactional
    public ChatSessionDto createChatSessionForMessage(SendMessageRequest request) {
        // Create a new chat session between sender and receiver
        UUID senderId = UUID.fromString(request.getSender());
        UUID receiverId = UUID.fromString(request.getReceiver());
        
        return createChatSession(senderId, receiverId);
    }

    // Public method for external access to mapper
    public ChatSessionDto mapToChatSessionDto(ChatSession chatSession) {
        return chatMapper.mapToChatSessionDto(chatSession);
    }
}
