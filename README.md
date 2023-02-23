# Getting Started

This project was created just for fun. The goal was learning while playing with docker, docker compose, nginx, react and node.

The project is composed by three services. The API, the WEB and a NGINX in charge or routing all the requests.

## Available Scripts

All the scripts are using `docker compose` to serve the applications. You can run:

### `make start`

Runs all the services.

### `make start-web`

Runs the production web served by an nginx.

### `make start-web-hmr`

Runs the web in development mode with hot reloading.

### `make start-api`

Runs the api served by node.

### `make file-sync-setup`

To install the `docker-sync` app used to improve the development experience with docker in OSX.

### `make file-sync-clear`

To clean the `docker-sync` files.

### `make destroy`

To remove all the docker containers and images created by this project in node.

### `make destroy-all`

USE WITH CAUTION
To remove all the docker containers and images.
