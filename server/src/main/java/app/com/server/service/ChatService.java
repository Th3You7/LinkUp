package app.com.server.service;


import app.com.server.model.ChatSession;
import app.com.server.model.Message;
import app.com.server.model.ChatParticipant;
import app.com.server.repos.ChatParticipiantRepository;
import app.com.server.repos.ChatSessionRepository;
import app.com.server.repos.MessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ChatService {
    private final ChatSessionRepository chatRepository;
    private final ChatParticipiantRepository chatParticipiantRepository;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate broker;

    @Autowired
    public ChatService(ChatSessionRepository chatRepository, ChatParticipiantRepository chatParticipiantRepository, MessageRepository messageRepository, SimpMessagingTemplate broker) {
        this.chatRepository = chatRepository;
        this.chatParticipiantRepository = chatParticipiantRepository;
        this.messageRepository = messageRepository;
        this.broker = broker;
    }

    @Transactional
    public Message sendMessage(Message message, String chatSessionId) {
        // create chat session
        ChatSession chatSession = chatRepository.findById(chatSessionId).orElseThrow();
        // save message
        messageRepository.save(message);
        // set last message
        chatSession.setLastMessage(message);
        chatRepository.save(chatSession);

        // get participants
        List<ChatParticipant> participants = chatParticipiantRepository.findAllByChatSession_Id(message.getChatSession().getId().toString());

        // send message to all participants
        for (ChatParticipant participant : participants) {
            broker.convertAndSend("/topic/messages/" + participant.getId().toString(), message);
            //broker.convertAndSend("/topic/lastMessage/" + participant.getId().toString(), message);
        }

        return message;

    }

    @Transactional
    public Page<Message> getMessages(String chatSessionId, int page) {
        return messageRepository.findByChatSession_IdOrderBySetCreatedAtDesc(UUID.fromString(chatSessionId), PageRequest.of(page, 10));
    }

    @Transactional
    public void markRead(String ChatSessionId, String userId) {
        ChatParticipant participant = chatParticipiantRepository.findByChatSession_IdAndUser_Id(ChatSessionId, userId);
        participant.setLastReadAt(Instant.now());
    }

    @Transactional
    public void deleteSession(String chatSessionId) {
        chatRepository.deleteById(chatSessionId);
    }

    @Transactional
    public void deleteMessage(String messageId) {
        messageRepository.deleteById(messageId);
    }
}
