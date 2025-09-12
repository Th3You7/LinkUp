package app.com.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String message;
    private String sender;
    private String chatSessionId;
    private String receiver; // Added to support creating chat sessions on first message
}
