package app.com.server.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipantDto {
    private UUID id;
    private UUID chatSessionId; // Reference instead of full object to avoid circular dependency
    private UserDto user;
    private Instant joinedAt;
    private Instant lastReadAt;
}
