#!/usr/bin/env bash

# Namespace
kubectl create namespace acit3495prj2
kubectl config set-context --current --namespace=acit3495prj2

# ConfigMaps and Secrets
kubectl create configmap mongo-init-script --from-file=mongo-init.js
kubectl apply -f kubernetes/mysql-config.yml
kubectl apply -f kubernetes/mysql-secret.yml
kubectl apply -f kubernetes/mongo-config.yml
kubectl apply -f kubernetes/mongo-secret.yml
kubectl apply -f kubernetes/app-config.yml
kubectl apply -f kubernetes/web-secret.yml

# DBs
kubectl apply -f kubernetes/mysql.yml
kubectl apply -f kubernetes/mongo.yml

# Apps
kubectl apply -f kubernetes/web.yml
kubectl apply -f kubernetes/analytics.yml

kubectl get svc