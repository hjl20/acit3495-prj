#!/usr/bin/env bash

# kubectl get pods
# kubectl get pods,svc,cm,secret,pv,pvc

kubectl create namespace acit3495prj2
kubectl config set-context --current --namespace=acit3495prj2

kubectl create configmap mongo-init-script --from-file=mongo-init.js
kubectl apply -f kubernetes/mysql-config.yml
kubectl apply -f kubernetes/mysql-secret.yml
kubectl apply -f kubernetes/mongo-config.yml
kubectl apply -f kubernetes/mongo-secret.yml
kubectl apply -f kubernetes/web-config.yml
kubectl apply -f kubernetes/web-secret.yml

kubectl apply -f kubernetes/mysql.yml
kubectl apply -f kubernetes/mongo.yml

# migration wait until mysql ready (this should work with the current cmds)
# web waits until migration completed (this should work with init container)
kubectl apply -f kubernetes/web.yml

# todo: test analytics
# kubectl apply -f kubernetes/analytics.yml

# kubectl get svc

# delete all resources and namespace
# kubectl delete pv mongo-pv mysql-pv
# kubectl delete namespace acit3495prj2