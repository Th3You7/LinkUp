package app.com.server.dto;

import app.com.server.enums.FriendshipInvitationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipStatusUpdateDto {
    private FriendshipInvitationStatus status;
}
