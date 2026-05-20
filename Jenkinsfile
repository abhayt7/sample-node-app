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

        stage('Build Docker Image') {
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

        stage('Push Docker Image') {
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

                docker run -d \
                  --name sample-node-app \
                  -p 80:3000 \
                  abhay93/sample-node-app:latest
                '''
            }
        }
    }
}
