# Kubernetes Deployment for Microservices Application

This directory contains Kubernetes YAML files to deploy your microservices application on Minikube.

## Architecture

The application consists of:
- **4 PostgreSQL databases** (authenticate, todo, notification, image)
- **1 Redis cache**
- **4 Microservices** (authenticate-service, todotask-service, notification-service, image-service)  
- **1 Frontend** (React application)

## Prerequisites

1. **Docker** installed and running
2. **Minikube** installed and running
3. **kubectl** installed and configured
4. **Docker images built** for your services

## Step-by-Step Deployment Instructions

### 1. Start Minikube

```bash
# Start minikube with enough resources
minikube start --memory=8192 --cpus=4

# Enable ingress addon (optional, for external access)
minikube addons enable ingress
```

### 2. Build Docker Images

First, build all your Docker images and load them into Minikube:

```bash
# Navigate to your project root
cd /path/to/your/project

# Build images for each service
docker build -t authenticate-service:latest ./authenticate-service-new
docker build -t todotask-service:latest ./todotask-service
docker build -t notification-service:latest ./notification-service
docker build -t image-service:latest ./image-service
docker build -t frontend:latest ./frontend

# Load images into minikube
minikube image load authenticate-service:latest
minikube image load todotask-service:latest
minikube image load notification-service:latest
minikube image load image-service:latest
minikube image load frontend:latest
```

### 3. Configure Secrets (Important!)

Before deploying, you need to update the secrets with your actual values:

```bash
# Edit the secrets.yaml file
nano k8s/secrets.yaml

# Replace the base64 encoded values with your actual secrets
# To encode: echo -n "your-actual-secret" | base64
```

### 4. Deploy to Kubernetes

#### Option A: Use the deployment script (Recommended)

```bash
# Navigate to k8s directory
cd k8s

# Make the script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

#### Option B: Manual deployment

```bash
# Navigate to k8s directory
cd k8s

# 1. Create namespace
kubectl apply -f namespace.yaml

# 2. Apply configurations
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml

# 3. Deploy databases (wait for each to be ready)
kubectl apply -f postgres-authenticate.yaml
kubectl apply -f postgres-todo.yaml
kubectl apply -f postgres-notification.yaml
kubectl apply -f postgres-image.yaml
kubectl apply -f redis.yaml

# Wait for databases
kubectl wait --for=condition=available --timeout=300s deployment/postgres-authenticate -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/postgres-todo -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/postgres-notification -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/postgres-image -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/redis -n microservices-app

# 4. Deploy microservices
kubectl apply -f authenticate-service.yaml
kubectl apply -f todotask-service.yaml
kubectl apply -f notification-service.yaml
kubectl apply -f image-service.yaml

# 5. Deploy frontend
kubectl apply -f frontend.yaml
```

### 5. Verify Deployment

```bash
# Check all pods are running
kubectl get pods -n microservices-app

# Check services
kubectl get services -n microservices-app

# Check persistent volumes
kubectl get pv
kubectl get pvc -n microservices-app
```

### 6. Access the Application

```bash
# Get the frontend service URL
minikube service frontend-service -n microservices-app

# Or use port forwarding
kubectl port-forward service/frontend-service 3000:80 -n microservices-app
# Then access http://localhost:3000
```

## Troubleshooting

### Check Logs

```bash
# Check specific service logs
kubectl logs -f deployment/authenticate-service -n microservices-app
kubectl logs -f deployment/todotask-service -n microservices-app
kubectl logs -f deployment/notification-service -n microservices-app
kubectl logs -f deployment/image-service -n microservices-app
kubectl logs -f deployment/frontend -n microservices-app

# Check database logs
kubectl logs -f deployment/postgres-authenticate -n microservices-app
kubectl logs -f deployment/redis -n microservices-app
```

### Check Pod Status

```bash
# Describe a pod for detailed information
kubectl describe pod <pod-name> -n microservices-app

# Get pod details
kubectl get pods -o wide -n microservices-app
```

### Database Connection Issues

```bash
# Test database connectivity
kubectl exec -it deployment/postgres-authenticate -n microservices-app -- psql -U myuser -d authenticate_db -c "SELECT 1;"
```

### Service Communication Issues

```bash
# Test service connectivity from within a pod
kubectl exec -it deployment/authenticate-service -n microservices-app -- curl http://postgres-authenticate-service:5432
```

## Scaling

```bash
# Scale a service
kubectl scale deployment authenticate-service --replicas=3 -n microservices-app

# Auto-scale based on CPU
kubectl autoscale deployment authenticate-service --cpu-percent=50 --min=1 --max=10 -n microservices-app
```

## Cleanup

```bash
# Delete the entire application
kubectl delete namespace microservices-app

# Or delete individual resources
kubectl delete -f . -n microservices-app
```

## Production Considerations

1. **Secrets Management**: Use proper secret management tools (e.g., HashiCorp Vault, Kubernetes Secrets)
2. **Resource Limits**: Adjust CPU and memory limits based on your requirements
3. **Persistent Storage**: Use appropriate storage classes for production
4. **Monitoring**: Add monitoring and logging solutions (Prometheus, Grafana, ELK stack)
5. **Security**: Implement network policies, RBAC, and security contexts
6. **Backup**: Set up database backup strategies
7. **SSL/TLS**: Configure proper SSL certificates for HTTPS

## File Structure

```
k8s/
├── namespace.yaml              # Namespace definition
├── configmap.yaml             # Configuration data
├── secrets.yaml               # Secret data (update with real values)
├── postgres-authenticate.yaml # Auth database
├── postgres-todo.yaml         # Todo database  
├── postgres-notification.yaml # Notification database
├── postgres-image.yaml        # Image database
├── redis.yaml                 # Redis cache
├── authenticate-service.yaml  # Auth microservice
├── todotask-service.yaml     # Todo microservice
├── notification-service.yaml # Notification microservice
├── image-service.yaml        # Image microservice
├── frontend.yaml             # Frontend application
├── deploy.sh                 # Deployment script
└── README.md                 # This file
``` 