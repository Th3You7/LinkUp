package app.com.server.repos;

import app.com.server.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, String> {
    Page<Message> findByChatSession_IdOrderBySetCreatedAtDesc(UUID chatSession_id, Pageable pageable);
}
