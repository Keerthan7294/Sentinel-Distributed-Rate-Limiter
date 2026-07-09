# Sentinel: Distributed Rate-Limiter

Sentinel is a high-performance, distributed rate-limiting system designed to protect APIs and microservices from excessive traffic. Built with Java 21 and Spring Boot 3, it leverages a Token Bucket algorithm utilizing Redis for distributed state management, ensuring consistency across multiple instances.

## 🚀 Key Features

*   **Distributed Rate Limiting:** Implements a Token Bucket algorithm via Lua scripts in Redis, allowing multiple nodes to share the same rate-limit state securely and efficiently.
*   **High Performance:** Leverages **Java 21 Virtual Threads** to optimize concurrent request handling, allowing the system to scale effortlessly.
*   **Real-time Traffic Logging:** Captures and pushes traffic logs (allowed/blocked requests) asynchronously using a **Kafka producer**.
*   **Live Dashboard:** A React-based frontend application built with Vite that consumes real-time traffic data via **WebSockets** for live visualization.

## 🛠️ Technology Stack

**Backend:**
*   Java 21
*   Spring Boot 3
*   Spring Data Redis (Token Bucket State)
*   Spring Kafka (Event Streaming)
*   Spring Web MVC & WebSockets

**Frontend:**
*   React 19
*   Vite
*   StompJS / SockJS (WebSocket Client)

**Infrastructure:**
*   Redis (Rate Limiter Data Store)
*   Apache Kafka & Zookeeper (Message Broker)
*   Docker & Docker Compose

## 🏗️ Architecture Overview

1.  **Incoming Request:** A client sends a request to a protected API endpoint.
2.  **RateLimitInterceptor:** Intercepts the request and checks the `RateLimiter` service.
3.  **Token Bucket via Redis:** The `RateLimiter` executes an atomic Lua script in Redis to check if the client has enough tokens.
4.  **Logging to Kafka:** The outcome (Allowed/Blocked) is sent as an event to a Kafka topic via the `TrafficLogService`.
5.  **WebSocket Broadcast:** The backend consumes from the Kafka topic and broadcasts the events over WebSockets to connected clients.
6.  **Real-Time UI:** The React dashboard updates dynamically, visualizing traffic flow.

## ⚙️ Configuration

You can customize the rate limiter settings in `src/main/resources/application.properties`:

```properties
# Rate Limiter defaults
sentinel.rate-limiter.capacity=100
sentinel.rate-limiter.refill-rate=10
```

## 🚀 Getting Started

### Prerequisites

*   Java 21
*   Node.js & npm (for the frontend)
*   Docker & Docker Compose

### Running the Infrastructure

Start Redis, Kafka, and Zookeeper using Docker Compose:

```bash
docker-compose up -d
```

### Running the Backend

Start the Spring Boot application using the Maven wrapper:

```bash
./mvnw spring-boot:run
```

### Running the Frontend

Navigate to the `frontend` directory, install dependencies, and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```
