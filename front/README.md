# LinkUp Frontend

A modern social media application built with Angular 17 and Tailwind CSS.

## Features

### Post Preview Modal

- **Click to Open**: Click on any post content or image to open a detailed preview modal
- **Comments System**: View all comments for a post in real-time
- **Add Comments**: Write and submit new comments with a rich input interface
- **Delete Comments**: Comment owners and post owners can delete comments
- **Responsive Design**: Modal adapts to different screen sizes
- **Dark Theme**: Beautiful dark mode interface matching modern social media platforms

### Post Management

- Create new posts with text and images
- Edit and delete your own posts
- Like and comment on posts
- Real-time updates

### Authentication

- User registration and login
- Password reset functionality
- Secure token-based authentication

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

## Post Preview Modal Usage

The post preview modal provides a comprehensive view of posts with full comment functionality:

### Opening the Modal

- Click anywhere on a post card (except action buttons)
- The modal will open with the post content and all comments

### Comment Features

- **View Comments**: All comments are loaded automatically
- **Add Comments**: Use the input field at the bottom to add new comments
- **Delete Comments**: Click the three dots (⋯) next to comments you can delete
- **Comment Actions**: Use emoji, image, GIF, and sticker buttons for rich comments

### Modal Controls

- **Close**: Click the X button or click outside the modal
- **Scroll**: Comments section is scrollable for long comment threads
- **Sort**: Use the dropdown to sort comments by relevance, newest, or oldest

## Technical Details

### Components

- `PostPreviewComponent`: Main modal component with comment functionality
- `PostCardComponent`: Enhanced with click-to-open modal functionality
- `MainComponent`: Manages modal state and post interactions

### Services

- `CommentService`: Handles all comment CRUD operations
- `PostService`: Manages post data and operations
- `AuthService`: User authentication and current user management

### Styling

- Tailwind CSS for responsive design
- Custom animations and transitions
- Dark theme optimized for readability

## API Integration

The modal integrates with the backend API for:

- Loading comments by post ID
- Creating new comments
- Deleting comments (with proper authorization)
- Real-time state management

## Future Enhancements

- Real-time comment updates using WebSocket
- Comment editing functionality
- Comment reactions (like, love, etc.)
- Comment replies and threading
- Image upload in comments
- Comment moderation tools
