package app.com.server.dto;

import java.time.Instant;
import java.util.UUID;

import app.com.server.enums.FriendshipInvitationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipDto {
    private UUID id;
    private UUID senderId;
    private String senderFirstName;
    private String senderLastName;
    private String senderUsername;
    private UUID receiverId;
    private String receiverFirstName;
    private String receiverLastName;
    private String receiverUsername;
    private FriendshipInvitationStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
