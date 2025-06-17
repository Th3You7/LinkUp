package app.com.server.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<Reply> replies = new HashSet<>();




}
