# LinkUp - Social Media Platform MVP

A modern social media platform built with Angular 19 frontend and Spring Boot 3.5 backend, featuring real-time chat, post management, and user interactions.

## 📁 Project Structure

```
LinkUp/
├── 📄 LinkUp_Presentation.md     # Complete project presentation
├── 📄 README.md                   # This file - project overview
├── 🎨 conception/                 # UML Diagrams and Documentation
│   ├── class_diagram/            # Class diagram files
│   │   ├── class_diagram.puml    # PlantUML source
│   │   └── class_diagram.svg     # Generated SVG diagram
│   ├── usecase_diagram/          # Use case diagram files
│   │   ├── usecase_diagram.puml  # PlantUML source
│   │   └── usecase_diagram.png   # Generated PNG diagram
│   └── sequence_diagram/         # Sequence diagram files
│       ├── login_sequence.puml   # Login flow PlantUML
│       ├── login_sequence.png    # Login flow diagram
│       ├── register_sequence.puml # Registration flow PlantUML
│       └── register_sequence.png  # Registration flow diagram
├── 🌐 front/                     # Angular 19 Frontend
│   ├── 📄 package.json           # Frontend dependencies
│   ├── 📄 README.md              # Frontend documentation
│   ├── 📄 angular.json           # Angular configuration
│   ├── 📄 tailwind.config.js     # Tailwind CSS configuration
│   ├── 📁 src/                   # Source code
│   │   ├── 📁 app/               # Application code
│   │   │   ├── 📁 core/          # Core services and models
│   │   │   │   ├── 📁 config/    # App configuration
│   │   │   │   ├── 📁 guards/    # Route guards
│   │   │   │   ├── 📁 interceptors/ # HTTP interceptors
│   │   │   │   ├── 📁 models/    # TypeScript models
│   │   │   │   └── 📁 services/  # Core services
│   │   │   ├── 📁 feature/       # Feature modules
│   │   │   │   ├── 📁 auth/      # Authentication module
│   │   │   │   ├── 📁 chat/      # Chat module
│   │   │   │   ├── 📁 home/      # Home feed module
│   │   │   │   └── 📁 profile/   # User profile module
│   │   │   └── 📁 shared/         # Shared components
│   │   │       └── 📁 components/ # Reusable components
│   │   ├── 📄 index.html         # Main HTML file
│   │   ├── 📄 main.ts            # Application entry point
│   │   └── 📄 styles.css         # Global styles
│   ├── 📁 dist/                  # Build output
│   ├── 📁 node_modules/          # Dependencies
│   └── 📁 public/                # Static assets
└── ⚙️ server/                    # Spring Boot Backend
    ├── 📄 pom.xml                # Maven dependencies
    ├── 📄 README.md              # Backend documentation
    ├── 📁 src/                   # Source code
    │   ├── 📁 main/              # Main application code
    │   │   ├── 📁 java/          # Java source files
    │   │   │   └── 📁 app/com/server/ # Main package
    │   │   │       ├── 📁 config/     # Configuration classes
    │   │   │       ├── 📁 controller/ # REST controllers
    │   │   │       ├── 📁 dto/        # Data Transfer Objects
    │   │   │       ├── 📁 entity/     # JPA entities
    │   │   │       ├── 📁 mapper/     # MapStruct mappers
    │   │   │       ├── 📁 repository/ # Data repositories
    │   │   │       ├── 📁 service/     # Business logic
    │   │   │       ├── 📁 websocket/  # WebSocket configuration
    │   │   │       └── 📄 ServerApplication.java # Main class
    │   │   └── 📁 resources/     # Configuration files
    │   │       ├── 📄 application.properties # App configuration
    │   │       ├── 📁 static/     # Static resources
    │   │       └── 📁 templates/  # Template files
    │   └── 📁 test/              # Test code
    └── 📁 target/                # Build output
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Java** (JDK 17 or higher)
- **Maven** (3.6 or higher)
- **MySQL** (8.0 or higher)
- **Git**

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd LinkUp
```

### 2. Environment Setup

#### Database Configuration

Create a MySQL database and update the connection settings:

```sql
CREATE DATABASE linkup_db;
CREATE USER 'linkup_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON linkup_db.* TO 'linkup_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Environment Variables

Create environment files for both frontend and backend:

**Backend Environment** (`server/src/main/resources/application.properties`):

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/linkup_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=linkup_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# JWT Configuration
jwt.secret=your-super-secret-jwt-key-here
jwt.expiration=86400000

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# CORS Configuration
cors.allowed-origins=http://localhost:4200
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true

# WebSocket Configuration
websocket.endpoint=/ws
websocket.allowed-origins=http://localhost:4200
```

**Frontend Environment** (`front/src/environments/environment.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080/api",
  wsUrl: "ws://localhost:8080/ws",
  jwtSecret: "your-super-secret-jwt-key-here",
};
```

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will be available at: `http://localhost:8080`

### 4. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd front

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at: `http://localhost:4200`

## 🛠️ Development

### Available Scripts

#### Frontend (Angular)

```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

#### Backend (Spring Boot)

```bash
# Run application
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package

# Run JAR
java -jar target/server-0.0.1-SNAPSHOT.jar
```

## 📋 Features

### ✅ Implemented Features

- **User Authentication**: Registration, login, JWT-based auth
- **Post Management**: Create, read, update, delete posts
- **Comment System**: Add, edit, delete comments on posts
- **Reaction System**: Like posts and comments
- **Real-time Chat**: WebSocket-based messaging
- **User Profiles**: View and edit user profiles
- **Friendship System**: Send/accept friend requests
- **Search**: Search users and posts
- **Responsive Design**: Mobile-first approach

### 🔄 In Development

- **File Upload**: Image upload for posts and profiles
- **Notifications**: Real-time notifications
- **Advanced Search**: Filtered search with pagination
- **Chat Features**: File sharing, emoji reactions

### 📅 Planned Features

- **Mobile App**: React Native or Flutter
- **Groups**: Create and join interest groups
- **Events**: Event creation and management
- **AI Features**: Content recommendations
- **Analytics**: User engagement metrics

## 🏗️ Architecture

### Frontend Architecture

- **Framework**: Angular 19 with TypeScript
- **Styling**: Tailwind CSS 4.1
- **State Management**: RxJS Observables
- **Real-time**: STOMP.js with WebSocket
- **Icons**: FontAwesome 7.0

### Backend Architecture

- **Framework**: Spring Boot 3.5
- **Database**: MySQL with JPA/Hibernate
- **Security**: Spring Security with JWT
- **Real-time**: Spring WebSocket
- **Build**: Maven
- **Language**: Java 17

### Database Schema

Key entities:

- **User**: Authentication and profile data
- **Post**: User-generated content
- **Comment**: Comments on posts
- **Reaction**: Likes and reactions
- **ChatSession**: Chat conversations
- **Message**: Individual chat messages
- **Friendship**: User relationships

## 🔧 Configuration

### Database Setup

1. Install MySQL 8.0+
2. Create database and user (see Quick Start)
3. Update `application.properties` with your credentials
4. Run the application to auto-create tables

### JWT Configuration

- Update `jwt.secret` in `application.properties`
- Use a strong, random secret key
- Keep the same secret in frontend environment

### CORS Configuration

- Update `cors.allowed-origins` for production
- Add your production domain to allowed origins

## 🧪 Testing

### Frontend Testing

```bash
cd front
npm test
```

### Backend Testing

```bash
cd server
mvn test
```

### Manual Testing

1. Start both frontend and backend
2. Register a new user
3. Create posts and comments
4. Test real-time chat functionality
5. Verify responsive design on mobile

## 📚 Documentation

- **Project Presentation**: `LinkUp_Presentation.md` - Complete project overview
- **Frontend Docs**: `front/README.md` - Angular-specific documentation
- **Backend Docs**: `server/README.md` - Spring Boot API documentation
- **UML Diagrams**: `conception/` - System architecture diagrams

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Check the documentation in each module
- Review the UML diagrams in `conception/`
- Open an issue on GitHub

## 🎯 Project Status

**Current Status**: MVP Complete ✅

- Core features implemented
- Real-time functionality working
- Responsive design complete
- Ready for user testing

**Next Phase**: Enhancement and scaling

- Performance optimization
- Advanced features
- Mobile application
- Production deployment

---

_Built with ❤️ using Angular 19, Spring Boot 3.5, and modern web technologies_
