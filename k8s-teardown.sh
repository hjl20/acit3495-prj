#!/usr/bin/env bash

# Delete all resources and namespace
kubectl delete pv mongo-pv mysql-pv
kubectl delete namespace acit3495prj2