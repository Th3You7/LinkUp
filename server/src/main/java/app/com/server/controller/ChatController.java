package app.com.server.controller;

import app.com.server.model.Message;
import app.com.server.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RestController
@RequestMapping ("/api/chat")
@CrossOrigin("*")
public class ChatController {
    private final ChatService chatService;
    private final SimpMessagingTemplate broker;

    @Autowired
    public ChatController(ChatService chatService, SimpMessagingTemplate broker) {
        this.chatService = chatService;
        this.broker = broker;
    }

    @GetMapping("/{chatId}/messages")
    public Page<Message> getMessages(@PathVariable String chatId, @RequestParam(defaultValue = "0") int page) {
        return chatService.getMessages(chatId, page);
    } // http://localhost:8080/api/chat/{chatId}/messages")

    @PostMapping("/{chatId}/messages")
    public Message sendMessage(@PathVariable String chatId, @RequestBody Message message) {
        return chatService.sendMessage(message, chatId);
    }

    @DeleteMapping("/{chatId}/messages/{messageId}")
    public void deleteMessage(@PathVariable String chatId, @PathVariable String messageId) {
        chatService.deleteMessage(messageId);
    }

    @DeleteMapping("/{chatId}")
    public void deleteChat(@PathVariable String chatId) {
        chatService.deleteSession(chatId);
    }

    @PutMapping("/{chatId}/messages/{userId}/read")
    public void seenMessage(@PathVariable String chatId, @PathVariable String userId) {
        chatService.markRead(chatId, userId);
    }

    @PutMapping("/{chatId}/typing")
    public void typing(@PathVariable String chatId) {
        broker.convertAndSend("/topic/typing/" + chatId, true);
    }

}
