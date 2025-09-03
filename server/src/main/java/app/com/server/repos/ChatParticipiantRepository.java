package app.com.server.repos;

import app.com.server.model.ChatParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatParticipiantRepository extends JpaRepository<ChatParticipant, String> {

    List<ChatParticipant> findAllByChatSession_Id(String chatId);
    ChatParticipant findByChatSession_IdAndUser_Id(String chatId, String userId);
}
