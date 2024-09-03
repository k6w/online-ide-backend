# Online IDE Backend

This **Advanced & Secure Online IDE Backend** is a sophisticated backend system designed to power a secure online IDE, supporting multiple programming languages and featuring robust sandboxing and security measures.

## Key Features

- **Language Support**: JavaScript, Python, Lua, C++, and cURL requests.
- **Sandboxing**: Secure execution in isolated Docker containers with gVisor.
- **Security**: Rate limiting, input sanitization, and secure configurations.
- **Resource Management**: Configured to manage CPU and memory usage.
- **Logging and Monitoring**: Integrated with Prometheus and Winston.
- **Deployment**: Docker and Kubernetes configurations included.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#clone-the-repository)
3. [Configure Environment Variables](#configure-environment-variables)
4. [Install Dependencies](#install-dependencies)
5. [Set Up Docker](#set-up-docker)
    - [Build the Docker Image](#build-the-docker-image)
    - [Run the Docker Container](#run-the-docker-container)
6. [Set Up PostgreSQL](#set-up-postgresql)
7. [Set Up MongoDB](#set-up-mongodb)
8. [Set Up Elasticsearch](#set-up-elasticsearch)
9. [Run Migrations and Seed Data](#run-migrations-and-seed-data)
10. [Start the Backend Server](#start-the-backend-server)
11. [Verify the Setup](#verify-the-setup)
12. [Docker and Kubernetes (Optional)](#docker-and-kubernetes-optional)
13. [Troubleshooting](#troubleshooting)
14. [Contributing](#contributing)
15. [License](#license)
16. [Usage Examples](#usage-examples)
17. [API Documentation](#api-documentation)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or later) - [Download Node.js](https://nodejs.org/)
- **Docker** (v20.x or later) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (optional, if using Docker Compose) - [Install Docker Compose](https://docs.docker.com/compose/install/)
- **PostgreSQL** - [Install PostgreSQL](https://www.postgresql.org/download/)
- **MongoDB** - [Install MongoDB](https://www.mongodb.com/try/download/community)
- **Elasticsearch** - [Install Elasticsearch](https://www.elastic.co/downloads/elasticsearch)

## Clone the Repository

Clone the repository from GitHub to your local machine:

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
```

## Configure Environment Variables

Create a `.env` file in the root directory. This file will hold sensitive and configuration data required for the application.

**.env**
```env
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
MONGO_URI=mongodb://localhost:27017/mydatabase

# Elasticsearch Configuration
ELASTICSEARCH_NODE=http://localhost:9200

# Prometheus Configuration
METRICS_PORT=9091

# Logging Configuration
LOG_LEVEL=info

# Resource Limits
MEMORY_LIMIT="100m"
CPU_LIMIT="500m"
```

- **PORT**: Port on which the backend server will run.
- **DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME**: PostgreSQL configuration details.
- **MONGO_URI**: MongoDB connection string.
- **ELASTICSEARCH_NODE**: URL for the Elasticsearch instance.
- **METRICS_PORT**: Port for Prometheus metrics.
- **LOG_LEVEL**: Level of logging (e.g., info, debug).
- **MEMORY_LIMIT**: Docker container memory limit.
- **CPU_LIMIT**: Docker container CPU limit.

## Install Dependencies

Navigate to the project directory and install the necessary Node.js packages:

```bash
npm install
```

## Set Up Docker

### Build the Docker Image

Build the Docker image using the Dockerfile provided:

```bash
docker build -t your-backend-image:latest .
```

This command creates a Docker image with the tag `your-backend-image:latest`.

### Run the Docker Container

Run the Docker container with the following command:

```bash
docker run -d \
  -p 3000:3000 \
  --name backend-container \
  --env-file .env \
  your-backend-image:latest
```

- `-d`: Runs the container in detached mode.
- `-p 3000:3000`: Maps port 3000 of the host to port 3000 of the container.
- `--name backend-container`: Names the container for easier reference.
- `--env-file .env`: Passes the environment variables defined in the `.env` file to the container.

## Set Up PostgreSQL

1. **Install PostgreSQL**: Follow the [installation instructions](https://www.postgresql.org/download/) for your operating system.
2. **Create Database and User**:

   Connect to the PostgreSQL instance and run the following SQL commands:

   ```sql
   CREATE DATABASE mydatabase;
   CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
   GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
   ```

   Replace `mydatabase`, `myuser`, and `mypassword` with the values specified in your `.env` file.

## Set Up MongoDB

1. **Install MongoDB**: Follow the [installation instructions](https://www.mongodb.com/try/download/community) for your operating system.
2. **Start MongoDB**:

   Start the MongoDB server with:

   ```bash
   mongod
   ```

   The default connection string `mongodb://localhost:27017/mydatabase` will be used unless otherwise specified.

## Set Up Elasticsearch

1. **Install Elasticsearch**: Follow the [installation instructions](https://www.elastic.co/downloads/elasticsearch) for your operating system.
2. **Start Elasticsearch**:

   Start Elasticsearch with:

   ```bash
   bin/elasticsearch
   ```

   Ensure Elasticsearch is running and accessible at the URL specified in your `.env` file.

## Run Migrations and Seed Data

If you have any database migrations or seed data scripts, execute them as needed. 

**Note:** This step is specific to your project and may not be applicable if no migrations or seed scripts are provided.

## Start the Backend Server

If running inside Docker, the server should already be running. If running locally without Docker, start the server using:

```bash
npm start
```

## Verify the Setup

1. **Check Server**: Open a web browser and navigate to `http://localhost:3000` to verify that the backend server is running.
2. **Check Metrics**: Visit `http://localhost:9091/metrics` to ensure that Prometheus metrics are being collected.
3. **Check Logs**: Review the logs to verify that the application is functioning correctly. Logs are available in `combined.log`.

## Docker and Kubernetes (Optional)

If deploying using Kubernetes, apply the Kubernetes configurations:

1. **Apply Deployment and Service Configuration**:

   ```bash
   kubectl apply -f kubernetes/deployment.yaml
   kubectl apply -f kubernetes/service.yaml
   ```

2. **Verify Kubernetes Deployment**:

   Ensure that the deployment and service are running properly:

   ```bash
   kubectl get deployments
   kubectl get services
   ```

## Troubleshooting

- **Server Not Starting**: Check if all required services (PostgreSQL, MongoDB, Elasticsearch) are running. Verify environment variables and Docker container logs.
- **Docker Issues**: Review Docker logs for errors and ensure the Docker image is built correctly.
- **Metrics Issues**: Check Prometheus configuration and ensure it can access the `/metrics` endpoint.

## Contributing

To contribute to this project, follow these guidelines:

1. Fork the repository and create a feature branch.
2. Make your changes and test them thoroughly.
3. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Usage Examples

### Execute Code

**POST /api/execute**

Execute code in a specified language. 

**Request:**

```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{
    "language": "javascript",
    "code": "console.log(\"Hello World\");"
  }'
```

**Response:**

```json
{
  "output": "Hello World\n"
}
```

### Execute cURL Request

**POST /api/curl**

Perform a cURL request with specified parameters.

**Request:**

```bash
curl -X POST http://localhost:3000/api/curl \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://jsonplaceholder.typicode.com/todos/1",
    "method": "GET",
    "headers": "",
    "data": ""
  }'
```

**Response:**

```json
{
  "output": "{\n  \"userId\": 1,\n  \"id\": 1,\n  \"title\":

 \"delectus aut autem\",\n  \"completed\": false\n}"
}
```

## API Documentation

### Execute Code

**Endpoint:** `/api/execute`

**Method:** POST

**Request Body:**

```json
{
  "language": "string",
  "code": "string"
}
```

- **language**: Programming language of the code to be executed. (e.g., "javascript", "python", "lua", "cpp")
- **code**: The code to be executed.

**Response:**

```json
{
  "output": "string"
}
```

- **output**: The result of the executed code.

### Execute cURL Request

**Endpoint:** `/api/curl`

**Method:** POST

**Request Body:**

```json
{
  "url": "string",
  "method": "string",
  "headers": "string",
  "data": "string"
}
```

- **url**: The URL for the cURL request.
- **method**: HTTP method (e.g., "GET", "POST").
- **headers**: Optional headers for the request.
- **data**: Optional data to be sent with the request.

**Response:**

```json
{
  "output": "string"
}
```

- **output**: The response from the cURL request.

For further information, adjust the request parameters as needed based on your use case.