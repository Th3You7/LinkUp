package app.com.server.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Reaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    @ManyToOne()
    @JoinColumn(name = "post_id")
    private Post post;
    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

}
