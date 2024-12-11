# AgentOps Python API Docker

1. Create Microsoft.ContainerRegistry: pythonapi

```shell
az login
az acr login --name pythonapi

docker build -t pythonapi:latest .
docker tag pythonapi:latest pythonapi.azurecr.io/pythonapi
docker push pythonapi.azurecr.io/pythonapi
```
