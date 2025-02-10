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

### Features completed
- Docker Compose file
  - Database health checks
  - Container startup dependencies via database health checks
- Environment variable files
- MySQL Migration container
- Web app
  - Dockerfile
  - MySQL connection
  - Basic authentication
  - Index and Results page
  - Fetch MySQL data (may be unneeded and removed later)
- Databases
  - Initial database creation
  - Initial table creation
- CI/CD
  - Build job for Web app image (manual trigger)

### TODO
- Web app
  - Mongo connection
  - Save user data
  - Fetch statistics results
- Analytics service
  - Dockerfile
  - DB connections
  - Calculate statistics
  - Save statistics results
- CI/CD
  - Deploy job