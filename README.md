### ACIT-3495 Project1

**Group 2**
- Herman Luo
- Jonathan Parras

## Pre-requisites
- Docker
- Docker Compose

# Setup
1. Rename `.env.<appname>-sample` files to `.env.<appname>`
1. Update environment variables in the `.env` files to your own configurations

# Start up
If initial startup, run `docker compose up --build`

Otherwise, run `docker compose up`

## Troubleshooting
If you do not see your changes after rebuilding the custom **web** image, try these steps: 
1. Run `docker prune container` to remove stopped containers
1. Run `docker prune image -a` to remove all images
1. (Optional/Dangerous) Run `docker volume prune -a` to remove **all volumes** (i.e. all data will be lost)
1. Run `docker compose build --no-cache` 
1. Run `docker compose up`

## Stack components
- Node.js app
- MongoDB server
- MongoDB Express (web interface for MongoDB)
- MySQL server
- Processing service (Python)

### Features completed
- Docker Compose file
  - Database health checks
  - Container startup dependencies via database health checks
- Environment variable files
- MySQL Migration container
- Web app
  - Dockerfile
  - MySQL connection
  - Submit data to MySQL
  - Basic authentication
  - Index and Results page
  - Fetch MySQL data (may be unneeded and removed later)
  - Mongo connection and fetch data (grades and min-max values)
- Databases
  - Initial database creation
  - Initial table creation
- CI/CD
  - Build job for Web app image (manual trigger)
- Analytics Service
  - Dockerfile
  - Fetch data from MySQL database and send to MongoDB
  - Process the data to get the minimum and maximum values


## Cloud and Kubernetes deployment

### AWS cluster

1. Create the AWS cluster with this command

```eksctl create cluster --name=<clustername> -- region=<regionname> --node-type=<node> --managed```

Example of the command above:

```eksctl create cluster --name=project2 ---region=us-west-2 --node-type=t3.small --managed```

2. Creation of the cluster will take around 15 minutes

3. Once the cluster is ready, you can now enter kubectl commands in your cli

### Deploy the App
1. From the root directory, run the following:
```./k8s-deploy.sh```

### Teardown the App
1. From the root directory, run the following:
```./k8s-teardown.sh```

### Test the self healing capabilities of the frontend

1. Delete one of the web pods

```kubectl delete pod <podname> -n acit3495prj2```

2. Watch the pod get deleted and k8s to create a new pod

```kubectl get pods --watch -n acit3495prj2```

### Delete cluster
1. Enter the command below to delete cluster

```eksctl delete cluster --name=<clustername> --region=<regionname>```