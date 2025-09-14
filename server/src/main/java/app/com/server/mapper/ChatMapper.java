package app.com.server.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import app.com.server.dto.ChatParticipantDto;
import app.com.server.dto.ChatSessionDto;
import app.com.server.dto.MessageDto;
import app.com.server.dto.UserDto;
import app.com.server.model.ChatParticipant;
import app.com.server.model.ChatSession;
import app.com.server.model.Message;
import app.com.server.model.User;

@Component
public class ChatMapper {

    public MessageDto mapToMessageDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setMessage(message.getMessage());
        dto.setSender(message.getSender());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setChatSessionId(message.getChatSession().getId());
        return dto;
    }

    public ChatSessionDto mapToChatSessionDto(ChatSession chatSession) {
        ChatSessionDto dto = new ChatSessionDto();
        dto.setId(chatSession.getId());
        
        // Map last message if exists
        if (chatSession.getLastMessage() != null) {
            dto.setLastMessage(mapToMessageDto(chatSession.getLastMessage()));
        }
        
        // Map participants
        List<ChatParticipantDto> participantDtos = chatSession.getParticipants().stream()
            .map(this::mapToChatParticipantDto)
            .collect(Collectors.toList());
        dto.setParticipants(participantDtos);
        
        // Set UI fields from the first participant (assuming 2 participants max)
        if (!chatSession.getParticipants().isEmpty()) {
            User firstParticipant = chatSession.getParticipants().iterator().next().getUser();
            dto.setFirstName(firstParticipant.getFirstName());
            dto.setLastName(firstParticipant.getLastName());
            dto.setAvatar(""); // TODO: Add avatar field to User model if needed
            dto.setVerified(false); // TODO: Add verification field to User model if needed
            dto.setOnline(false); // TODO: Implement online status tracking
            dto.setActive(true);
            dto.setUnreadCount(0); // TODO: Calculate actual unread count
            dto.setHasAttachment(false); // TODO: Check if last message has attachments
            dto.setAttachmentType("");
            dto.setAttachmentName("");
            dto.setTimestamp(chatSession.getLastMessage() != null ? 
                chatSession.getLastMessage().getCreatedAt().toString() : "");
        } else {
            // Fallback values
            dto.setFirstName("User");
            dto.setLastName("");
            dto.setAvatar("");
            dto.setVerified(false);
            dto.setOnline(false);
            dto.setActive(true);
            dto.setUnreadCount(0);
            dto.setHasAttachment(false);
            dto.setAttachmentType("");
            dto.setAttachmentName("");
            dto.setTimestamp("");
        }
        
        return dto;
    }

    public ChatParticipantDto mapToChatParticipantDto(ChatParticipant participant) {
        ChatParticipantDto dto = new ChatParticipantDto();
        dto.setId(participant.getId());
        dto.setChatSessionId(participant.getChatSession().getId());
        dto.setUser(mapToUserDto(participant.getUser()));
        dto.setJoinedAt(participant.getJoinedAt());
        dto.setLastReadAt(participant.getLastReadAt());
        return dto;
    }

    public UserDto mapToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        // Skip post and comment counts for chat functionality to avoid lazy initialization issues
        dto.setPostCount(0);
        dto.setCommentCount(0);
        return dto;
    }

    // Utility method to map list of chat sessions
    public List<ChatSessionDto> mapToChatSessionDtoList(List<ChatSession> chatSessions) {
        return chatSessions.stream()
            .map(this::mapToChatSessionDto)
            .collect(Collectors.toList());
    }

    // Utility method to map list of messages
    public List<MessageDto> mapToMessageDtoList(List<Message> messages) {
        return messages.stream()
            .map(this::mapToMessageDto)
            .collect(Collectors.toList());
    }
}
