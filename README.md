# Microservices Todo Application

A modern microservices-based Todo application with real-time notifications, user authentication, and image upload capabilities.

## Architecture

The application follows a microservices architecture with the following services:

- 🔐 **Authentication Service**: Handles user authentication and authorization
- 📝 **Todo Task Service**: Manages todo tasks and real-time notifications
- 🖼️ **Image Service**: Handles image uploads and management
- 🔔 **Notification Service**: Manages real-time notifications
- 🌐 **Frontend**: React-based user interface
- 🚀 **API Gateway**: Routes requests to appropriate services
- 🐳 **Docker & Docker Compose**: Containerization and orchestration

## Tech Stack

### Backend Services
- Java 17
- Spring Boot 3.2.3
- Spring Security
- Spring Data JPA
- PostgreSQL
- WebSocket
- JWT
- Docker
- Node.js 18
- Express.js 5.1
- Cloudinary
- Firebase
- SQLite

### Frontend
- React 18
- Redux Toolkit
- Material-UI
- React Router v6
- Axios
- WebSocket
- Firebase
- Cloudinary

### Infrastructure
- Docker
- Docker Compose
- Nginx
- PostgreSQL

## Project Structure

```
.
├── authenticate-service/      # Authentication Service
├── todotask-service/         # Todo Task Service
├── image-service/           # Image Service
├── notification-service/    # Notification Service
├── frontend/               # React Frontend
├── docker-compose.yml      # Docker Compose configuration
└── README.md              # Project documentation
```

## Features

- 👤 User authentication and authorization
- 📝 Todo task management (CRUD operations)
- 🖼️ Image management (upload, retrieve, delete images for notes and users using Cloudinary and Firebase)
- 🔔 Internal notification service (CRUD notifications, user-based, priority levels, read/unread status, real-time via WebSocket)
- 📱 Responsive design
- 🔒 JWT-based security
- 🌐 RESTful APIs
- 📊 PostgreSQL database
- 🗄️ SQLite database for notification service (simple, no setup required)
- 🐳 Docker containerization

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Java 17+
- Maven

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000

# Database Configuration
POSTGRES_DB=tododb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

### Running the Application

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Start all services using Docker Compose:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost
- API Gateway: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

## Development

### Running Services Individually

Each service can be run independently for development:

1. Authentication Service:
```bash
cd authenticate
./mvnw spring-boot:run
```

2. Todo Task Service:
```bash
cd todotask-service
./mvnw spring-boot:run
```

3. Frontend:
```bash
cd frontend
npm install
npm start
```

### API Documentation

Each service provides its own Swagger documentation:
- Authentication Service: http://localhost:8081/swagger-ui.html
- Todo Task Service: http://localhost:8082/swagger-ui.html
- Image Service: http://localhost:8083/swagger-ui.html
- Notification Service: http://localhost:8084/swagger-ui.html

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
