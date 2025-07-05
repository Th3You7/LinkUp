# LinkUp Social Media Platform - Backend API

This is the backend API for the LinkUp social media platform, built with Spring Boot and JPA.

## Features

- User management (registration, authentication, profile management)
- Post management (create, read, update, delete posts)
- Comment system (comments on posts with replies)
- Reaction system (like, love, etc. on posts)
- Search functionality for users, posts, comments, and replies
- Pagination support
- RESTful API design

## API Endpoints

### User Management

#### Create User

```
POST /api/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User by ID

```
GET /api/users/{id}
```

#### Get User by Email

```
GET /api/users/email/{email}
```

#### Get User by Username

```
GET /api/users/username/{username}
```

#### Get All Users

```
GET /api/users
```

#### Search Users by Name

```
GET /api/users/search/name?searchTerm=john
```

#### Search Users by Username

```
GET /api/users/search/username?searchTerm=john
```

#### Update User

```
PUT /api/users/{id}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "username": "johnsmith",
  "email": "john.smith@example.com",
  "password": "newpassword123"
}
```

#### Delete User

```
DELETE /api/users/{id}
```

#### User Login

```
POST /api/users/login?email=john@example.com&password=password123
```

### Post Management

#### Create Post

```
POST /api/posts
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my first post!",
  "image": "https://example.com/image.jpg",
  "userId": "user-uuid-here"
}
```

#### Get Post by ID

```
GET /api/posts/{id}
```

#### Get All Posts (with pagination)

```
GET /api/posts?page=0&size=10
```

#### Get Posts by User ID

```
GET /api/posts/user/{userId}
```

#### Get Posts by User ID (with pagination)

```
GET /api/posts/user/{userId}/page?page=0&size=10
```

#### Search Posts

```
GET /api/posts/search?searchTerm=hello&page=0&size=10
```

#### Get Posts by Multiple Users (for friends' posts)

```
POST /api/posts/friends?page=0&size=10
Content-Type: application/json

["user-uuid-1", "user-uuid-2", "user-uuid-3"]
```

#### Update Post

```
PUT /api/posts/{id}
Content-Type: application/json

{
  "title": "Updated Post Title",
  "content": "Updated post content",
  "image": "https://example.com/new-image.jpg",
  "userId": "user-uuid-here"
}
```

#### Delete Post

```
DELETE /api/posts/{id}
```

#### Delete Posts by User ID

```
DELETE /api/posts/user/{userId}
```

#### Get Posts by Date Range

```
GET /api/posts/date-range?startDate=2024-01-01T00:00:00&endDate=2024-12-31T23:59:59
```

#### Get Post Count by User

```
GET /api/posts/user/{userId}/count
```

### Comment Management

#### Create Comment

```
POST /api/comments
Content-Type: application/json

{
  "content": "Great post!",
  "userId": "user-uuid-here",
  "postId": "post-id-here"
}
```

#### Get Comment by ID

```
GET /api/comments/{id}
```

#### Get Comments by Post ID

```
GET /api/comments/post/{postId}
```

#### Get Comments by Post ID (with pagination)

```
GET /api/comments/post/{postId}/page?page=0&size=10
```

#### Get Comments by User ID

```
GET /api/comments/user/{userId}
```

#### Get Comments by User ID (with pagination)

```
GET /api/comments/user/{userId}/page?page=0&size=10
```

#### Search Comments

```
GET /api/comments/search?searchTerm=great&page=0&size=10
```

#### Update Comment

```
PUT /api/comments/{id}
Content-Type: application/json

{
  "content": "Updated comment content",
  "userId": "user-uuid-here",
  "postId": "post-id-here"
}
```

#### Delete Comment

```
DELETE /api/comments/{id}
```

#### Delete Comments by User ID

```
DELETE /api/comments/user/{userId}
```

#### Delete Comments by Post ID

```
DELETE /api/comments/post/{postId}
```

#### Get Comment Count by Post

```
GET /api/comments/post/{postId}/count
```

#### Get Comment Count by User

```
GET /api/comments/user/{userId}/count
```

### Reply Management

#### Create Reply

```
POST /api/replies
Content-Type: application/json

{
  "content": "I agree with you!",
  "userId": "user-uuid-here",
  "commentId": "comment-id-here"
}
```

#### Get Reply by ID

```
GET /api/replies/{id}
```

#### Get Replies by Comment ID

```
GET /api/replies/comment/{commentId}
```

#### Get Replies by Comment ID (with pagination)

```
GET /api/replies/comment/{commentId}/page?page=0&size=10
```

#### Get Replies by User ID

```
GET /api/replies/user/{userId}
```

#### Get Replies by User ID (with pagination)

```
GET /api/replies/user/{userId}/page?page=0&size=10
```

#### Search Replies

```
GET /api/replies/search?searchTerm=agree&page=0&size=10
```

#### Update Reply

```
PUT /api/replies/{id}
Content-Type: application/json

{
  "content": "Updated reply content",
  "userId": "user-uuid-here",
  "commentId": "comment-id-here"
}
```

#### Delete Reply

```
DELETE /api/replies/{id}
```

#### Delete Replies by User ID

```
DELETE /api/replies/user/{userId}
```

#### Delete Replies by Comment ID

```
DELETE /api/replies/comment/{commentId}
```

#### Get Reply Count by Comment

```
GET /api/replies/comment/{commentId}/count
```

#### Get Reply Count by User

```
GET /api/replies/user/{userId}/count
```

### Reaction Management

#### Create Reaction

```
POST /api/reactions
Content-Type: application/json

{
  "name": "like",
  "userId": "user-uuid-here",
  "postId": "post-id-here"
}
```

#### Get Reaction by ID

```
GET /api/reactions/{id}
```

#### Get Reactions by Post ID

```
GET /api/reactions/post/{postId}
```

#### Get Reactions by User ID

```
GET /api/reactions/user/{userId}
```

#### Get Reactions by Post ID and Name

```
GET /api/reactions/post/{postId}/name/{name}
```

#### Get Reactions by Name

```
GET /api/reactions/name/{name}
```

#### Get User's Reaction to Post

```
GET /api/reactions/post/{postId}/user/{userId}
```

#### Check if User Reacted to Post

```
GET /api/reactions/post/{postId}/user/{userId}/exists
```

#### Update Reaction

```
PUT /api/reactions/{id}
Content-Type: application/json

{
  "name": "love",
  "userId": "user-uuid-here",
  "postId": "post-id-here"
}
```

#### Delete Reaction

```
DELETE /api/reactions/{id}
```

#### Delete Reaction by Post and User

```
DELETE /api/reactions/post/{postId}/user/{userId}
```

#### Delete Reactions by User ID

```
DELETE /api/reactions/user/{userId}
```

#### Delete Reactions by Post ID

```
DELETE /api/reactions/post/{postId}
```

#### Get Reaction Count by Post

```
GET /api/reactions/post/{postId}/count
```

#### Get Reaction Count by User

```
GET /api/reactions/user/{userId}/count
```

#### Get Reaction Count by Post and Name

```
GET /api/reactions/post/{postId}/name/{name}/count
```

## Database Schema

### User Entity

- `id` (UUID, Primary Key)
- `firstName` (String)
- `lastName` (String)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String)
- `posts` (One-to-Many with Post)
- `comments` (One-to-Many with Comment)
- `replies` (One-to-Many with Reply)
- `reactions` (One-to-Many with Reaction)

### Post Entity

- `id` (String, Primary Key)
- `title` (String)
- `content` (String)
- `image` (String)
- `createdAt` (LocalDateTime)
- `updatedAt` (LocalDateTime)
- `user` (Many-to-One with User)
- `comments` (One-to-Many with Comment)
- `reactions` (One-to-Many with Reaction)

### Comment Entity

- `id` (String, Primary Key)
- `content` (String)
- `createdAt` (LocalDateTime)
- `updatedAt` (LocalDateTime)
- `user` (Many-to-One with User)
- `post` (Many-to-One with Post)
- `replies` (One-to-Many with Reply)

### Reply Entity

- `id` (String, Primary Key)
- `content` (String)
- `createdAt` (LocalDateTime)
- `updatedAt` (LocalDateTime)
- `user` (Many-to-One with User)
- `comment` (Many-to-One with Comment)

### Reaction Entity

- `id` (String, Primary Key)
- `name` (String) - e.g., "like", "love", "haha", "wow", "sad", "angry"
- `user` (Many-to-One with User)
- `post` (Many-to-One with Post)

## Getting Started

1. Make sure you have Java 17+ and Maven installed
2. Configure your database connection in `application.properties`
3. Run the application: `mvn spring-boot:run`
4. The API will be available at `http://localhost:8080`

## Notes

- Passwords are stored in plain text for this demo. In production, use proper password hashing.
- The API includes CORS configuration for cross-origin requests.
- Pagination is supported for most list endpoints.
- Error handling returns appropriate HTTP status codes.
