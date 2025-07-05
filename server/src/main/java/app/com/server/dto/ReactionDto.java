package app.com.server.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReactionDto {
    private String id;
    private String name;
    private UUID userId;
    private String userFirstName;
    private String userLastName;
    private String username;
    private String postId;
} 