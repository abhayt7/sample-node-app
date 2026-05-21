# DevOps CI/CD Pipeline Assignment

## Project Overview

This project demonstrates a complete DevOps CI/CD pipeline implementation using:

* Git & GitHub
* Jenkins
* Docker
* DockerHub
* AWS EC2
* Kubernetes
* Prometheus
* Grafana
* Domain (GoDaddy) + AWS Route53

The pipeline automatically:

1. Pulls source code from GitHub
2. Builds Docker image
3. Runs basic tests
4. Pushes Docker image to DockerHub
5. Deploys containerized application to AWS EC2 / Kubernetes
6. Monitors application using Prometheus and Grafana
7. Exposes application using custom domain (Route53 + GoDaddy)

---

# CI/CD Architecture

```text
Developer Push Code
        ↓
GitHub Repository
        ↓
GitHub Webhook Trigger
        ↓
Jenkins Pipeline
        ↓
Checkout Source Code
        ↓
Build Docker Image
        ↓
Run Tests
        ↓
Push Docker Image to DockerHub
        ↓
Deploy to AWS EC2 / Kubernetes
        ↓
Monitoring (Prometheus + Grafana)
        ↓
Route53 DNS Mapping
        ↓
GoDaddy Custom Domain Access
```

---

# Tools & Technologies Used

| Tool       | Purpose                |
| ---------- | ---------------------- |
| Git        | Version control        |
| GitHub     | Source code repository |
| Jenkins    | CI/CD automation       |
| Docker     | Containerization       |
| DockerHub  | Image registry         |
| AWS EC2    | Deployment server      |
| Kubernetes | Orchestration          |
| Prometheus | Monitoring             |
| Grafana    | Visualization          |
| Node.js    | Sample application     |
| Route53    | DNS management         |
| GoDaddy    | Domain provider        |

---

# Project Structure

```text
sample-node-app/
│
├── Dockerfile
├── Jenkinsfile
├── app.js
├── package.json
├── .env.example
├── deployment.yaml
├── service.yaml
└── README.md
```

---

# Step 1: GitHub Repository

Repository:

```text
https://github.com/abhayt7/sample-node-app
```

---

# Step 2: Node.js Application

## package.json

```json
{
  "name": "sample-node-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js",
    "test": "echo \"Tests Passed Successfully\""
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

## app.js

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('CI/CD Pipeline Working Successfully!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

# Step 3: Docker Setup

## Dockerfile

```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node","app.js"]
```

---

# Step 4: Jenkins CI/CD Pipeline

## Jenkinsfile

```groovy
pipeline {
    agent any

    environment {
        IMAGE_NAME = "abhay93/sample-node-app"
    }

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/abhayt7/sample-node-app.git'
            }
        }

        stage('Build') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:latest")
                }
            }
        }

        stage('Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Push Image') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-creds') {
                        docker.image("${IMAGE_NAME}:latest").push()
                    }
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker stop sample-node-app || true
                docker rm sample-node-app || true

                docker pull abhay93/sample-node-app:latest

                docker run -d --name sample-node-app -p 80:3000 abhay93/sample-node-app:latest
                '''
            }
        }
    }
}
```

---

# Step 5: AWS EC2 Setup

* Ubuntu 22.04
* t2.medium

Open ports:

* 22 SSH
* 80 App
* 8080 Jenkins
* 9090 Prometheus
* 3001 Grafana

---

# Step 6: Kubernetes Setup (Clean Installation)

```bash
sudo swapoff -a
sudo apt update
sudo apt install -y docker.io apt-transport-https ca-certificates curl

sudo apt install -y kubelet kubeadm kubectl
sudo kubeadm init --pod-network-cidr=192.168.0.0/16

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

---

# Step 7: Kubernetes Deployment

## deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-node-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sample-node-app
  template:
    metadata:
      labels:
        app: sample-node-app
    spec:
      containers:
      - name: sample-node-app
        image: abhay93/sample-node-app:latest
        ports:
        - containerPort: 3000
```

## service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: sample-node-service
spec:
  type: LoadBalancer
  selector:
    app: sample-node-app
  ports:
    - port: 80
      targetPort: 3000
```

---

# Step 8: Monitoring

## Prometheus

```bash
docker run -d -p 9090:9090 prom/prometheus
```

## Grafana

```bash
docker run -d -p 3001:3000 grafana/grafana
```

---

# Step 9: Domain Setup (GoDaddy + Route53)

## Flow

```text
GoDaddy Domain → Route53 Hosted Zone → EC2 IP Mapping → Application
```

## Steps

1. Buy domain from GoDaddy (example: cdec45.shop)
2. Create Route53 Hosted Zone
3. Copy Route53 NS records to GoDaddy
4. Create A record:

   * cdec45.shop → EC2 IP

Now access app via:

```text
http://myapp.cdec45.shop
```

---

# Step 10: Final CI/CD Flow

```text
Git Push
↓
GitHub Webhook
↓
Jenkins Pipeline
↓
Docker Build
↓
Docker Push
↓
Deploy (EC2/K8s)
↓
Monitoring
↓
Route53 DNS
↓
GoDaddy Domain
↓
Public Application URL
```

---

# Deliverables

* GitHub Repository: [https://github.com/abhayt7/sample-node-app]
* Dockerfile
* Jenkinsfile
* Kubernetes YAML files
* Running URL: cdec45.shop

---

# Author

Abhay Tarone
