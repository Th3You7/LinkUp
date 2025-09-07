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
public class FriendshipResponseDto {
    private UUID id;
    private UserDto sender;
    private UserDto receiver;
    private FriendshipInvitationStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
