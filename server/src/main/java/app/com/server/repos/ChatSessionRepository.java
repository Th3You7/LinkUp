package app.com.server.repos;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import app.com.server.model.ChatSession;

public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {
}
