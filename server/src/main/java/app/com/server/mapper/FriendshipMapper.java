package app.com.server.mapper;

import java.time.Instant;

import org.springframework.stereotype.Component;

import app.com.server.dto.CreateFriendshipDto;
import app.com.server.dto.FriendshipDto;
import app.com.server.dto.FriendshipResponseDto;
import app.com.server.dto.UserDto;
import app.com.server.enums.FriendshipInvitationStatus;
import app.com.server.model.Friendship;
import app.com.server.model.User;

@Component
public class FriendshipMapper {
    
    public FriendshipDto toDto(Friendship friendship) {
        if (friendship == null) {
            return null;
        }
        
        FriendshipDto dto = new FriendshipDto();
        dto.setId(friendship.getId());
        dto.setSenderId(friendship.getSender().getId());
        dto.setSenderFirstName(friendship.getSender().getFirstName());
        dto.setSenderLastName(friendship.getSender().getLastName());
        dto.setSenderUsername(friendship.getSender().getUsername());
        dto.setReceiverId(friendship.getReceiver().getId());
        dto.setReceiverFirstName(friendship.getReceiver().getFirstName());
        dto.setReceiverLastName(friendship.getReceiver().getLastName());
        dto.setReceiverUsername(friendship.getReceiver().getUsername());
        dto.setStatus(friendship.getStatus());
        dto.setCreatedAt(friendship.getCreatedAt());
        dto.setUpdatedAt(friendship.getUpdatedAt());
        
        return dto;
    }
    
    public FriendshipResponseDto toResponseDto(Friendship friendship) {
        if (friendship == null) {
            return null;
        }
        
        FriendshipResponseDto dto = new FriendshipResponseDto();
        dto.setId(friendship.getId());
        dto.setStatus(friendship.getStatus());
        dto.setCreatedAt(friendship.getCreatedAt());
        dto.setUpdatedAt(friendship.getUpdatedAt());
        
        // Map sender
        UserDto senderDto = new UserDto();
        senderDto.setId(friendship.getSender().getId());
        senderDto.setFirstName(friendship.getSender().getFirstName());
        senderDto.setLastName(friendship.getSender().getLastName());
        senderDto.setUsername(friendship.getSender().getUsername());
        senderDto.setEmail(friendship.getSender().getEmail());
        dto.setSender(senderDto);
        
        // Map receiver
        UserDto receiverDto = new UserDto();
        receiverDto.setId(friendship.getReceiver().getId());
        receiverDto.setFirstName(friendship.getReceiver().getFirstName());
        receiverDto.setLastName(friendship.getReceiver().getLastName());
        receiverDto.setUsername(friendship.getReceiver().getUsername());
        receiverDto.setEmail(friendship.getReceiver().getEmail());
        dto.setReceiver(receiverDto);
        
        return dto;
    }
    
    public Friendship toEntity(CreateFriendshipDto dto, User sender, User receiver) {
        if (dto == null || sender == null || receiver == null) {
            return null;
        }
        
        Friendship friendship = new Friendship();
        friendship.setSender(sender);
        friendship.setReceiver(receiver);
        friendship.setStatus(FriendshipInvitationStatus.PENDING);
        friendship.setCreatedAt(Instant.now());
        friendship.setUpdatedAt(Instant.now());
        
        return friendship;
    }
}
