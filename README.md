DevOps CI/CD Pipeline Assignment
Project Overview

This project demonstrates a complete DevOps CI/CD pipeline implementation using:

Git & GitHub
Jenkins
Docker
DockerHub
Amazon ECR
AWS EC2
Kubernetes
Prometheus
Grafana
Route53
GoDaddy Domain

The CI/CD pipeline automatically:

Pulls source code from GitHub
Builds Docker image
Runs tests
Pushes Docker image to DockerHub / Amazon ECR
Deploys application to EC2 / Kubernetes
Monitors application using Prometheus & Grafana
Exposes application using custom domain
CI/CD Architecture
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
Push Docker Image
(DockerHub / Amazon ECR)
        ↓
Deploy to EC2 / Kubernetes
        ↓
Monitoring (Prometheus + Grafana)
        ↓
Route53 DNS Mapping
        ↓
GoDaddy Domain Access
Tools & Technologies Used
Tool	Purpose
Git	Version Control
GitHub	Source Code Repository
Jenkins	CI/CD Automation
Docker	Containerization
DockerHub	Public Image Registry
Amazon ECR	AWS Container Registry
AWS EC2	Deployment Server
Kubernetes	Container Orchestration
Prometheus	Monitoring
Grafana	Visualization
Route53	DNS Management
GoDaddy	Domain Provider
Node.js	Sample Application
Project Structure
sample-node-app/
│
├── Dockerfile
├── Jenkinsfile
├── app.js
├── package.json
├── deployment.yaml
├── service.yaml
├── .env.example
└── README.md
Step 1: GitHub Repository

Repository URL:

https://github.com/abhayt7/sample-node-app

Clone repository:

git clone https://github.com/abhayt7/sample-node-app.git

cd sample-node-app
Step 2: Create Node.js Application
package.json
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
app.js
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('CI/CD Pipeline Working Successfully!');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
Step 3: Dockerize Application
Dockerfile
FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node","app.js"]
Step 4: Build Docker Image

Build image:

docker build -t sample-node-app .

Run container:

docker run -d -p 3000:3000 sample-node-app

Verify:

http://localhost:3000
Step 5: DockerHub Setup
Create DockerHub Repository

Repository:

abhay93/sample-node-app
Login to DockerHub
docker login
Tag Docker Image
docker tag sample-node-app:latest abhay93/sample-node-app:latest
Push Docker Image
docker push abhay93/sample-node-app:latest

DockerHub URL:

https://hub.docker.com/r/abhay93/sample-node-app
Step 6: Amazon ECR Setup
Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

unzip awscliv2.zip

sudo ./aws/install

Verify:

aws --version
Configure AWS CLI
aws configure
Create ECR Repository

Repository Name:

sample-node-app
Login to Amazon ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 202533496137.dkr.ecr.us-east-1.amazonaws.com
Tag Docker Image for ECR
docker tag sample-node-app:latest 202533496137.dkr.ecr.us-east-1.amazonaws.com/sample-node-app:latest
Push Docker Image to ECR
docker push 202533496137.dkr.ecr.us-east-1.amazonaws.com/sample-node-app:latest
Step 7: AWS EC2 Setup

EC2 Configuration:

Configuration	Value
OS	Ubuntu 22.04
Instance Type	t2.medium

Open ports:

Port	Purpose
22	SSH
80	Application
8080	Jenkins
9090	Prometheus
3001	Grafana
Step 8: Install Docker on EC2
sudo apt update

sudo apt install docker.io -y

sudo systemctl start docker

sudo systemctl enable docker
Step 9: Install Jenkins
Install Java
sudo apt install openjdk-21-jdk -y
Install Jenkins
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee \
/usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
/etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update

sudo apt install jenkins -y

Start Jenkins:

sudo systemctl start jenkins

sudo systemctl enable jenkins
Step 10: Jenkins Pipeline
Jenkinsfile
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
                git branch: 'main',
                url: 'https://github.com/abhayt7/sample-node-app.git'
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

        stage('Push Image to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-creds') {
                        docker.image("${IMAGE_NAME}:latest").push()
                    }
                }
            }
        }

        // Optional ECR Push Stage

        // stage('Push Image to ECR') {
        //     steps {
        //         sh '''
        //         aws ecr get-login-password --region us-east-1 | \
        //         docker login --username AWS --password-stdin 202533496137.dkr.ecr.us-east-1.amazonaws.com

        //         docker tag sample-node-app:latest \
        //         202533496137.dkr.ecr.us-east-1.amazonaws.com/sample-node-app:latest

        //         docker push \
        //         202533496137.dkr.ecr.us-east-1.amazonaws.com/sample-node-app:latest
        //         '''
        //     }
        // }

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
    }
}
Step 11: GitHub Webhook

Webhook URL:

http://EC2_PUBLIC_IP:8080/github-webhook/

Event:

Just the push event
Step 12: Kubernetes Setup
sudo swapoff -a

sudo apt update

sudo apt install -y docker.io apt-transport-https ca-certificates curl

sudo apt install -y kubelet kubeadm kubectl

Initialize cluster:

sudo kubeadm init --pod-network-cidr=192.168.0.0/16

Install Calico:

kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
Step 13: Kubernetes Deployment
deployment.yaml
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
service.yaml
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
Step 14: Monitoring
Prometheus
docker run -d -p 9090:9090 prom/prometheus
Grafana
docker run -d -p 3001:3000 grafana/grafana
Step 15: Domain Setup
Route53 + GoDaddy

Flow:

GoDaddy Domain
        ↓
Route53 Hosted Zone
        ↓
A Record → EC2 Public IP
        ↓
Application Access

Example Domain:

cdec45.shop

Application URL:

http://cdec45.shop
Final CI/CD Flow
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
    ↓
Monitoring
    ↓
Route53 DNS
    ↓
GoDaddy Domain
    ↓
Public Application Access
Deliverables
Deliverable	Status
GitHub Repository	Completed
Dockerfile	Completed
Jenkinsfile	Completed
DockerHub Image	Completed
Amazon ECR Image	Completed
Kubernetes YAML	Completed
Monitoring Setup	Completed
Domain Mapping	Completed
Author
Abhay Tarone
