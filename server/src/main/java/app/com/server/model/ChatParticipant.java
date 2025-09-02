package app.com.server.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ChatParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne()
    @JoinColumn(name = "chat_session_id")
    private ChatSession chatSession;
    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;
    private Instant joinedAt = Instant.now();
    private Instant lastReadAt;

}
