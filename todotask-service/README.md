# Todo Task Service

A Spring Boot microservice for managing todo tasks with real-time notifications.

## Features

- 📝 CRUD operations for todo tasks
- 🔔 Real-time notifications using WebSocket
- 🔐 JWT authentication
- 📊 PostgreSQL database
- 🐳 Docker containerization
- 🔄 RESTful API endpoints
- 📈 Swagger API documentation

## Tech Stack

- Java 17
- Spring Boot 3.2.3
- Spring Security
- Spring Data JPA
- PostgreSQL
- WebSocket
- JWT
- Docker
- Swagger/OpenAPI

## Project Structure

```
todotask-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── todotask/
│   │   │               ├── config/
│   │   │               ├── controller/
│   │   │               ├── dto/
│   │   │               ├── entity/
│   │   │               ├── repository/
│   │   │               ├── service/
│   │   │               └── TodoTaskApplication.java
│   │   └── resources/
│   │       └── application.properties
├── pom.xml
└── Dockerfile
```

## API Endpoints

### Todo Tasks

- `GET /api/todos`: Get all todos
- `GET /api/todos/{id}`: Get todo by ID
- `POST /api/todos`: Create new todo
- `PUT /api/todos/{id}`: Update todo
- `DELETE /api/todos/{id}`: Delete todo
- `PATCH /api/todos/{id}/complete`: Toggle todo completion

### WebSocket

- `ws://localhost:8080/ws`: WebSocket endpoint for real-time notifications

## Database Schema

### Todo Entity
```sql
CREATE TABLE todos (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Configure the database in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tododb
spring.datasource.username=postgres
spring.datasource.password=your_password
```

3. Build the project:
```bash
./mvnw clean install
```

4. Run the application:
```bash
./mvnw spring-boot:run
```

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t todo-task-service .
```

2. Run the container:
```bash
docker run -p 8080:8080 todo-task-service
```

## Environment Variables

- `SPRING_DATASOURCE_URL`: Database URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `JWT_SECRET`: JWT secret key
- `JWT_EXPIRATION`: JWT expiration time
- `SERVER_PORT`: Server port (default: 8080)

## API Documentation

Swagger UI is available at: `http://localhost:8080/swagger-ui.html`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 