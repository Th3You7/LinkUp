package app.com.server.dto;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private UUID id;
    private String message;
    private String sender;
    private Instant createdAt;
    private UUID chatSessionId; // Reference instead of full object to avoid circular dependency
}
