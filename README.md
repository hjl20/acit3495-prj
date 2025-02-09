### ACIT-3495 Project1

**Group 2**
- Herman Luo
- Jonathan Parras

## Pre-requisites
- Docker
- Docker Compose

## Components
- MongoDB server
- MongoDB Express - web interface for MongoDB
- MySQL server

## Features completed
- Docker Compose file
- Environment variable files
- Web app
  - Basic authentication
  - Index and Results page
- Databases
  - Initial database creation

## TODO
- Web app
  - Dockerfile
  - DB connections
  - Save user data
  - Fetch statistics results
- Analytics service
  - Dockerfile
  - DB connections
  - Calculate statistics
  - Save statistics results
- Databases
  - Setup tables

# Setup
1. Rename `.env.<appname>-sample` files to `.env.<appname>`
1. Update environment variables in the `.env` files to your own configurations 
1. Run `docker compose up`
