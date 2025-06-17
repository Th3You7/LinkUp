package app.com.server.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne()
    @JoinColumn(name = "comment_id")
    private Comment comment;

}
