package app.com.server.repos;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.com.server.model.ChatParticipant;

public interface ChatParticipiantRepository extends JpaRepository<ChatParticipant, UUID> {

    List<ChatParticipant> findAllByChatSession_Id(UUID chatId);
    ChatParticipant findByChatSession_IdAndUser_Id(UUID chatId, UUID userId);
}
