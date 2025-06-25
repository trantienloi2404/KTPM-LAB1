#!/bin/bash

echo "🚀 Deploying microservices application to Minikube..."

# Apply namespace first
echo "📁 Creating namespace..."
kubectl apply -f namespace.yaml

# Apply ConfigMap and Secrets
echo "⚙️  Applying ConfigMap and Secrets..."
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml

# Deploy databases first (they need to be ready before services)
echo "🗄️  Deploying databases..."
kubectl apply -f postgres-authenticate.yaml
kubectl apply -f postgres-todo.yaml
kubectl apply -f postgres-notification.yaml
kubectl apply -f postgres-image.yaml
kubectl apply -f redis.yaml

# Wait for databases to be ready
echo "⏳ Waiting for databases to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/postgres-authenticate -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/postgres-todo -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/postgres-notification -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/postgres-image -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/redis -n microservices-app

# Deploy microservices
echo "🔧 Deploying microservices..."
kubectl apply -f authenticate-service.yaml
kubectl apply -f todotask-service.yaml
kubectl apply -f notification-service.yaml
kubectl apply -f image-service.yaml

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/authenticate-service -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/todotask-service -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/notification-service -n microservices-app
kubectl wait --for=condition=available --timeout=300s deployment/image-service -n microservices-app

# Deploy frontend
echo "🌐 Deploying frontend..."
kubectl apply -f frontend.yaml

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n microservices-app

echo "✅ Deployment completed!"
echo ""
echo "📊 Checking deployment status..."
kubectl get pods -n microservices-app
echo ""
echo "🌐 To access the application:"
echo "   minikube service frontend-service -n microservices-app"
echo ""
echo "🔍 To check logs:"
echo "   kubectl logs -f deployment/frontend -n microservices-app"
echo "   kubectl logs -f deployment/authenticate-service -n microservices-app"
echo ""
echo "🧹 To clean up:"
echo "   kubectl delete namespace microservices-app" 