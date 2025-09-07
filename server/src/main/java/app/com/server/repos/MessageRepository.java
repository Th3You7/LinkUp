package app.com.server.repos;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import app.com.server.model.Message;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    Page<Message> findByChatSession_IdOrderByCreatedAtDesc(UUID chatSession_id, Pageable pageable);
}
