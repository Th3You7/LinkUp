package app.com.server.dto;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatSessionDto {
    private UUID id;
    private MessageDto lastMessage;
    private List<ChatParticipantDto> participants;
    private String firstName;
    private String lastName;
    private String avatar;
    private boolean isVerified;
    private boolean isOnline;
    private boolean isActive;
    private int unreadCount;
    private boolean hasAttachment;
    private String attachmentType; // 'image' | 'file' | 'link'
    private String attachmentName;
    private String timestamp;
}
