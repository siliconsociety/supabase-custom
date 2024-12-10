# AKS Supabase Studio Minimal Deployment Guide

## Prerequisites
- Azure CLI installed
- `kubectl` installed
- `helm` installed
- An Azure subscription
- Optional: A domain name (example uses quantus.cloud)

## 1. Create AKS Cluster

```bash
# Login to Azure
az login

# Create a resource group
az group create --name myaksresourcegroup --location eastus

# Create AKS cluster
az aks create \
    --resource-group myaksresourcegroup \
    --name myakscluster \
    --node-count 1 \
    --enable-addons monitoring \
    --generate-ssh-keys

# Get credentials
az aks get-credentials --resource-group myaksresourcegroup --name myakscluster
```

## 2. Create Base Configuration Files

Create a file named `test-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-app
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: test-app
  template:
    metadata:
      labels:
        app: test-app
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name: test-app-service
  namespace: default
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: test-app
```

Create a file named `studio-deployment.yaml`:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: studio
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: studio
  template:
    metadata:
      labels:
        app: studio
    spec:
      containers:
      - name: studio
        image: supabase/studio:20240326-5e5586d
        ports:
        - containerPort: 3000
        env:
        - name: STUDIO_DEFAULT_ORGANIZATION
          value: "Quantus"
        - name: STUDIO_DEFAULT_PROJECT
          value: "Development"
        - name: SUPABASE_PUBLIC_URL
          value: "http://quantus.cloud"
        - name: NEXT_PUBLIC_ENABLE_LOGS
          value: "true"
        livenessProbe:
          httpGet:
            path: /api/profile
            port: 3000
          initialDelaySeconds: 3

---
apiVersion: v1
kind: Service
metadata:
  name: studio-service
  namespace: default
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: studio

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: studio-ingress
  namespace: default
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/proxy-body-size: "100m"
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: studio-service
            port:
              number: 80
```

## 3. Deploy Test Configuration

```bash
# Apply test deployment
kubectl apply -f test-deployment.yaml
```

## 4. Install Ingress Controller

```bash
# Add the ingress-nginx repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install with proper configuration
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.externalTrafficPolicy=Local \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-internal"=false \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/azure-load-balancer-health-probe-request-path"=/healthz

# Wait for the ingress controller to get an external IP
kubectl get service nginx-ingress-ingress-nginx-controller -n ingress-nginx

```

## 5. Deploy Supabase Studio

```bash
# Deploy Studio
kubectl apply -f studio-deployment.yaml

# Verify deployment
kubectl get pods
kubectl get services
kubectl get ingress
```

## 6. Verification Commands

```bash
# Check all resources
kubectl get all -n ingress-nginx
kubectl get all -n default

# Get the external IP
kubectl get service nginx-ingress-ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# Test connectivity from within cluster
kubectl run tmp-debug --rm -i --tty --image curlimages/curl -- curl -v http://studio-service
```

## Expected Results
1. `kubectl get pods` should show running pods for both test-app and studio
2. `kubectl get service -n ingress-nginx` should show the ingress controller with an external IP
3. Accessing the external IP in a browser should show the Supabase Studio interface

## Troubleshooting Commands

```bash
# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/nginx-ingress-ingress-nginx-controller

# Check Studio logs
kubectl logs -l app=studio

# Check ingress configuration
kubectl describe ingress studio-ingress

# Test internal connectivity
kubectl run tmp-debug --rm -i --tty --image curlimages/curl -- sh
# Then inside the pod:
curl -v http://studio-service
```

## Cleanup if Needed

```bash
# Remove all deployments
kubectl delete -f test-deployment.yaml
kubectl delete -f studio-deployment.yaml

# Uninstall ingress controller
helm uninstall nginx-ingress -n ingress-nginx

# Delete namespace if needed
kubectl delete namespace ingress-nginx
```

## Notes
- Wait for the ingress controller to obtain an external IP before testing connectivity
- Ensure no other services are using the same ports
- The Studio may take a few minutes to fully initialize
- If changing configurations, always update through the YAML files and reapply rather than making direct changes
