package app.com.server.controller;

import app.com.server.model.Message;
import app.com.server.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWSController {
    private final ChatService chatService;
    private final SimpMessagingTemplate broker;

    @Autowired
    public ChatWSController(ChatService chatService, SimpMessagingTemplate broker) {
        this.chatService = chatService;
        this.broker = broker;
    }

    @MessageMapping("/chat.send")
    public void send(Message message, String sessionId) {
        chatService.sendMessage(message, sessionId);
    }
    @MessageMapping("/chat.list")
    public void join(String chatSessionId, int page) {
        chatService.getMessages(chatSessionId, page);
    }

    @MessageMapping("/chat.read")
    public void read(Message message) {
        chatService.markRead(message.getChatSession().getId().toString(), message.getSender());
    }

    @MessageMapping("/chat.delete_message")
    public void deleteMessage(String messageId) {
        chatService.deleteMessage(messageId);
    }

    @MessageMapping("/chat.delete_session")
    public void deleteSession(String sessionId) {
        chatService.deleteSession(sessionId);
    }

    @MessageMapping("/chat.typing")
    public void typing(String sessionId) {
        broker.convertAndSend("/topic/typing/" + sessionId, true);
    }
}
