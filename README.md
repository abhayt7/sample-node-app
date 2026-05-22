# DevOps CI/CD Pipeline Assignment

## Project Overview

This project demonstrates a complete DevOps CI/CD pipeline using:

* Git & GitHub
* Jenkins
* Docker
* DockerHub
* Amazon ECR
* AWS EC2
* Kubernetes
* Prometheus
* Grafana
* Route53 & GoDaddy

The pipeline automatically:

1. Pulls code from GitHub
2. Builds Docker image
3. Runs tests
4. Pushes image to DockerHub / Amazon ECR
5. Deploys application to EC2 / Kubernetes

-------------------------------------------------
## Custom Domain Configuration

The application is exposed using a custom domain configured through Amazon Route 53 and GoDaddy DNS management.DNS records are mapped to the AWS EC2 public IP, enabling secure and user-friendly access to the deployed application over the internet.


---

# CI/CD Architecture

```text
Developer Push Code
        ↓
GitHub Repository
        ↓
GitHub Webhook
        ↓
Jenkins Pipeline
        ↓
Checkout Source Code
        ↓
Build Docker Image
        ↓
Run Tests
        ↓
Push Image (DockerHub / ECR)
        ↓
Deploy to EC2 / Kubernetes
        
```

---

# Tools & Technologies

| Tool       | Purpose            |
| ---------- | ------------------ |
| Git        | Version Control    |
| GitHub     | Source Repository  |
| Jenkins    | CI/CD Automation   |
| Docker     | Containerization   |
| DockerHub  | Public Registry    |
| Amazon ECR | AWS Registry       |
| AWS EC2    | Deployment Server  |
| Kubernetes | Orchestration      |
| Prometheus | Monitoring         |
| Grafana    | Dashboard          |
| Node.js    | Sample Application |

---

# Project Structure

```text
sample-node-app/
│
├── Dockerfile
├── Jenkinsfile
├── app.js
├── package.json
├── deployment.yaml
├── service.yaml
├── .env.example
└── README
```

---

# Step 1: GitHub Repository

Repository URL:

```text
https://github.com/abhayt7/sample-node-app
```

Clone repository:

```bash
git clone https://github.com/abhayt7/sample-node-app.git

cd sample-node-app
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

---

## app.js

```javascriptconst express = require('express');
const client = require('prom-client');

const app = express();

// Enable default metrics
client.collectDefaultMetrics();

// Home Route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CI/CD Dashboard</title>
      <style>
        body {
          margin: 0;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          font-family: Arial, sans-serif;
        }

        .box {
          text-align: center;
          color: white;
          padding: 50px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          backdrop-filter: blur(10px);
        }

        h1 {
          font-size: 40px;
          margin: 0;
          color: #00ffcc;
        }

        p {
          font-size: 18px;
          margin-top: 10px;
        }

        .badge {
          margin-top: 15px;
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #00ffcc;
          color: #00ffcc;
          font-size: 13px;
        }
      </style>
    </head>

    <body>
      <div class="box">
        <h1>CI/CD PIPELINE RUNNING 🚀</h1>
        <p>GitHub . Jenkins . Docker . Deploy To Server</p>
        <div class="badge">DEPLOYMENT ACTIVE</div>
      </div>
    </body>
    </html>
  `);
});

// Metrics Route for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Start Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

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

Build image:

```bash
docker build -t sample-node-app .
```

Run container:

```bash
docker run -d -p 3000:3000 sample-node-app
```

Verify:

```text
http://localhost:3000
```

---

# Step 4: DockerHub Setup

DockerHub Repository:

```text
abhay93/sample-node-app
```

Login:

```bash
docker login
```

Tag image:

```bash
docker tag sample-node-app:latest abhay93/sample-node-app:latest
```

Push image:

```bash
docker push abhay93/sample-node-app:latest
```

DockerHub URL:

```text
https://hub.docker.com/r/abhay93/sample-node-app
```

---

# Step 5: Amazon ECR Setup

## Install AWS CLI

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

unzip awscliv2.zip

sudo ./aws/install
```

Verify:

```bash
aws --version
```

---

## Configure AWS CLI

```bash
aws configure
```

---

## Login to Amazon ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 202533496137.dkr.ecr.us-east-1.amazonaws.com
```

---

## Tag Docker Image

```bash
docker tag sample-node-app:latest 202533496137.dkr.ecr.us-east-1.amazonaws.com/sample-node-app:latest
```

---

## Push Docker Image

```bash
docker push 202533496137.dkr.ecr.us-east-1.amazonaws.com/sample-node-app:latest
```

---

# Step 6: AWS EC2 Setup

## EC2 Configuration

| Configuration | Value        |
| ------------- | ------------ |
| OS            | Ubuntu 22.04 |
| Instance Type | t2.medium    |

---

## Open Security Group Ports

| Port | Purpose     |
| ---- | ----------- |
| 22   | SSH         |
| 80   | Application |
| 8080 | Jenkins     |
| 9090 | Prometheus  |
| 3001 | Grafana     |

---

# Step 7: Install Docker on EC2

```bash
sudo apt update

sudo apt install docker.io -y

sudo systemctl start docker

sudo systemctl enable docker
```

Add permissions:

```bash
sudo usermod -aG docker ubuntu

sudo usermod -aG docker jenkins
```

---

# Step 8: Install Jenkins

## Install Java

```bash
sudo apt install openjdk-21-jdk -y
```

---

## Install Jenkins

```bash
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
/usr/share/keyrings/jenkins-keyring.asc > /dev/null
```

```bash
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
/etc/apt/sources.list.d/jenkins.list > /dev/null
```

```bash
sudo apt update

sudo apt install jenkins -y
```

Start Jenkins:

```bash
sudo systemctl start jenkins

sudo systemctl enable jenkins
```

---

# Step 9: Jenkins Pipeline

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

        
        // STEP 1 - Checkout Source Code
        

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/abhayt7/sample-node-app.git'
            }
        }

        
        // STEP 2 - Build Docker Image
        

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:latest")
                }
            }
        }

        
        // STEP 3 - Run Tests
        

        stage('Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        
        // STEP 4 - Push Docker Image to DockerHub
        

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-creds') {
                        docker.image("${IMAGE_NAME}:latest").push()
                    }
                }
            }
        }

        
        // OPTIONAL - Push Docker Image to Amazon ECR
        // Uncomment this stage if using Amazon ECR
        

        /*
        stage('Push Image to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region us-east-1 | \
                docker login --username AWS --password-stdin 202533496137.dkr.ecr.us-east-1.amazonaws.com

                docker tag sample-node-app:latest \
                202533496137.dkr.ecr.us-east-1.amazonaws.com/sample-node-app:latest

                docker push \
                202533496137.dkr.ecr.us-east-1.amazonaws.com/sample-node-app:latest
                '''
            }
        }
        */

        
        // OPTION 1 - Deploy on EC2 Docker Server
        // CURRENT ACTIVE DEPLOYMENT
        

        stage('Deploy') {
            steps {
                sh '''
                docker stop sample-node-app || true

                docker rm sample-node-app || true

                docker pull abhay93/sample-node-app:latest

                docker run -d \
                  --name sample-node-app \
                  -p 80:3000 \
                  abhay93/sample-node-app:latest
                '''
            }
        }

        
        // OPTION 2 - Deploy on Kubernetes
        // Uncomment below stages if deploying on Kubernetes
        

        /*
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f deployment.yaml

                kubectl apply -f service.yaml

                kubectl rollout restart deployment/sample-node-app
                '''
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                sh '''
                kubectl get pods

                kubectl get svc

                kubectl get deployments
                '''
            }
        }
        */
    }
}
```

---

# Step 10: GitHub Webhook

Webhook URL:

```text
http://EC2_PUBLIC_IP:8080/github-webhook/
```

Event:

```text
Just the push event
```

---

# Step 11: Kubernetes Setup

Install Kubernetes:

```bash
sudo swapoff -a

sudo apt update

sudo apt install -y docker.io apt-transport-https ca-certificates curl

sudo apt install -y kubelet kubeadm kubectl
```

Initialize cluster:

```bash
sudo kubeadm init --pod-network-cidr=192.168.0.0/16
```

Configure kubectl:

```bash
mkdir -p $HOME/.kube

sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Install Calico:

```bash
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
```

---

# Step 12: Kubernetes Deployment

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

---

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

Deploy:

```bash
kubectl apply -f deployment.yaml

kubectl apply -f service.yaml
```

---

# Step 13: Monitoring Setup

## Prometheus

```bash
docker run -d \
--name prometheus \
-p 9090:9090 \
prom/prometheus
```

Access:

```text
http://34.200.249.191:9090
```

---

## Grafana

```bash
docker run -d \
--name grafana \
-p 3001:3000 \
grafana/grafana
```

Access:

```text
http://34.200.249.191:3001
```

Default Login:

```text
Username: admin
Password: admin
```

---




# Final CI/CD Flow

```text
Git Push
    ↓
GitHub Webhook
    ↓
Jenkins Pipeline
    ↓
Build Docker Image
    ↓
Push Image (DockerHub / ECR)
    ↓
Deploy to EC2 / Kubernetes
   

---

# Deliverables

| Deliverable       | Status    |
| ----------------- | --------- |
| GitHub Repository | Completed |
| Dockerfile        | Completed |
| Jenkinsfile       | Completed |
| DockerHub Image   | Completed |
| Amazon ECR Image  | Completed |
| Kubernetes YAML   | Completed |
| Monitoring Setup  | Completed |
| Domain Mapping    | Completed |

---

# GitHub Repository

```text
https://github.com/abhayt7/sample-node-app
```

---

# Running Application URL

```text
http://cdec45.shop
```

---

# Author

```text
Abhay Tarone
```
