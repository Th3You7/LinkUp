package app.com.server.repos;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.com.server.enums.FriendshipInvitationStatus;
import app.com.server.model.Friendship;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {
    
    // Find friendship by sender and receiver
    Optional<Friendship> findBySenderIdAndReceiverId(UUID senderId, UUID receiverId);
    
    // Find all friendships where user is sender
    List<Friendship> findBySenderId(UUID senderId);
    
    // Find all friendships where user is receiver
    List<Friendship> findByReceiverId(UUID receiverId);
    
    // Find all friendships where user is either sender or receiver
    @Query("SELECT f FROM Friendship f WHERE f.sender.id = :userId OR f.receiver.id = :userId")
    List<Friendship> findByUserId(@Param("userId") UUID userId);
    
    // Find friendships by status
    List<Friendship> findByStatus(FriendshipInvitationStatus status);
    
    // Find friendships where user is sender and status is specific
    List<Friendship> findBySenderIdAndStatus(UUID senderId, FriendshipInvitationStatus status);
    
    // Find friendships where user is receiver and status is specific
    List<Friendship> findByReceiverIdAndStatus(UUID receiverId, FriendshipInvitationStatus status);
    
    // Find accepted friendships where user is either sender or receiver
    @Query("SELECT f FROM Friendship f WHERE (f.sender.id = :userId OR f.receiver.id = :userId) AND f.status = 'ACCEPTED'")
    List<Friendship> findAcceptedFriendshipsByUserId(@Param("userId") UUID userId);
    
    // Find pending friendships where user is receiver
    @Query("SELECT f FROM Friendship f WHERE f.receiver.id = :userId AND f.status = 'PENDING'")
    List<Friendship> findPendingFriendshipRequests(@Param("userId") UUID userId);
    
    // Find sent friendship requests where user is sender and status is pending
    @Query("SELECT f FROM Friendship f WHERE f.sender.id = :userId AND f.status = 'PENDING'")
    List<Friendship> findSentFriendshipRequests(@Param("userId") UUID userId);
    
    // Check if friendship exists between two users (any status)
    @Query("SELECT COUNT(f) > 0 FROM Friendship f WHERE (f.sender.id = :userId1 AND f.receiver.id = :userId2) OR (f.sender.id = :userId2 AND f.receiver.id = :userId1)")
    boolean existsFriendshipBetweenUsers(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2);
    
    // Check if specific friendship exists (sender -> receiver)
    boolean existsBySenderIdAndReceiverId(UUID senderId, UUID receiverId);
    
    // Find mutual friends between two users
    @Query("SELECT f1.receiver FROM Friendship f1 " +
           "INNER JOIN Friendship f2 ON f1.receiver.id = f2.receiver.id " +
           "WHERE f1.sender.id = :userId1 AND f1.status = 'ACCEPTED' " +
           "AND f2.sender.id = :userId2 AND f2.status = 'ACCEPTED'")
    List<Friendship> findMutualFriends(@Param("userId1") UUID userId1, @Param("userId2") UUID userId2);
}
