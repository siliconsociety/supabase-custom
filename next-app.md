# AgentOps Next.js App Docker

1. Create Microsoft.ContainerRegistry: agentops
2. Start Docker Daemon (Docker Desktop)
3. export env vars required for building
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_PROJECT_ID


```shell
az login
az acr login --name agentops

export DOCKER_BUILDKIT=1
docker build \
    --secret id=NEXT_PUBLIC_SUPABASE_URL,env=NEXT_PUBLIC_SUPABASE_URL \
    --secret id=NEXT_PUBLIC_SUPABASE_ANON_KEY,env=NEXT_PUBLIC_SUPABASE_ANON_KEY \
    --secret id=SUPABASE_PROJECT_ID,env=SUPABASE_PROJECT_ID \
    -t agentops:latest .
docker tag agentops:latest agentops.azurecr.io/agentops
docker push agentops.azurecr.io/agentops
```
