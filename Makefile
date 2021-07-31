#!/usr/bin/make -f

PROJECT_NAME := rummikub

start_server: ## Run the application
	cd server && npm run start:watch

start_web: ## Run the application
	cd web && npm run start

test_web: ## Run the application
	cd web && npm run test

start_web_docker: ## Run the web application
	docker-sync start -c web/docker/dev/docker-sync.yml
	docker compose -f web/docker/dev/docker-compose.yml -p rummikub-web run --rm -p 3000:3000 node

build: ## Run the application
	docker compose -f ./docker-compose.yml -p rummikub up --build

build_web: ## Run the web application
	docker compose -f web/docker-compose.yml -p rummikub-web up --build

build_server: ## Run the server application
	docker compose -f server/docker-compose.yml -p rummikub-server up --build

down: ## Destroy the application
	docker compose -p rummikub down

down-web: ## Destroy the web application
	docker compose -f web/docker-compose.yml -p rummikub-web down

down-server: ## Destroy the server application
	docker compose -f server/docker-compose.yml -p rummikub-server down

file-sync-setup:  ## Install docker-sync to update files in the container
	sudo gem install docker-sync -n /usr/local/bin

file-sync-clear: ## Stop to update files in the container
	docker-sync stop -c ./docker/dev/docker-sync.yml

destroy: ## Destroy project containers
	docker stop $$(docker ps -a -q --filter="name=$(PROJECT_NAME)") || true
	docker rm $$(docker ps -a -q --filter="name=$(PROJECT_NAME)") || true
	docker rmi $$(docker images -q --filter="reference=$(PROJECT_NAME)*") || true
	docker rmi $$(docker images -q --filter="reference=eugenmayer/unison") || true

destroy-all: ## Destroy all docker containers
	docker stop $$(docker ps -a -q) || true
	docker rm $$(docker ps -a -q) || true
	docker rmi $$(docker images -q) || true

help: ## Display this help text
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
