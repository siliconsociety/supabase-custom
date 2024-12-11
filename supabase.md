# AKS & ACR

## 1. Start with supabase official repo `/docker`

## 2. Confirm Docker Desktop is running

## 3. Copy Env
```shell
cd docker
cp .env.example .env
```
Customize `.env` as needed.

## 4. Build Images
```shell
docker compose up -d
```

## 5. Tag and Push

### supabase/edge-runtime:v1.65.3
```shell
docker tag supabase/edge-runtime:v1.65.3 supabase.azurecr.io/supabase-edge && \
docker push supabase.azurecr.io/supabase-edge
```

### darthsim/imgproxy:v3.8.0
```shell
docker tag darthsim/imgproxy:v3.8.0 supabase.azurecr.io/supabase-imgproxy && \
docker push supabase.azurecr.io/supabase-imgproxy
```

### supabase/gotrue:v2.164.0
```shell
docker tag supabase/gotrue:v2.164.0 supabase.azurecr.io/supabase-gotrue && \
docker push supabase.azurecr.io/supabase-gotrue
```

### timberio/vector:0.28.1-alpine
```shell
docker tag timberio/vector:0.28.1-alpine supabase.azurecr.io/supabase-vector && \
docker push supabase.azurecr.io/supabase-vector
```

### supabase/supavisor:1.1.56
```shell
docker tag supabase/supavisor:1.1.56 supabase.azurecr.io/supabase-supavisor && \
docker push supabase.azurecr.io/supabase-supavisor
```

### supabase/realtime:v2.33.58
```shell
docker tag supabase/realtime:v2.33.58 supabase.azurecr.io/supabase-realtime && \
docker push supabase.azurecr.io/supabase-realtime
```

### postgrest/postgrest:v12.2.0
```shell
docker tag postgrest/postgrest:v12.2.0 supabase.azurecr.io/supabase-postgrest && \
docker push supabase.azurecr.io/supabase-postgrest
```

### supabase/postgres:15.6.1.139
```shell
docker tag supabase/postgres:15.6.1.139 supabase.azurecr.io/supabase-postgres && \
docker push supabase.azurecr.io/supabase-postgres
```

### kong:2.8.1
```shell
docker tag kong:2.8.1 supabase.azurecr.io/supabase-kong && \
docker push supabase.azurecr.io/supabase-kong
```

### supabase/storage-api:v1.11.13
```shell
docker tag supabase/storage-api:v1.11.13 supabase.azurecr.io/supabase-storage-api && \
docker push supabase.azurecr.io/supabase-storage-api
```

### supabase/postgres-meta:v0.84.2
```shell
docker tag supabase/postgres-meta:v0.84.2 supabase.azurecr.io/supabase-postgres-meta && \
docker push supabase.azurecr.io/supabase-postgres-meta
```

### supabase/studio:20241202-71e5240
```shell
docker tag supabase/studio:20241202-71e5240 supabase.azurecr.io/supabase-studio && \
docker push supabase.azurecr.io/supabase-studio
```

### supabase/logflare:1.4.0
```shell
docker tag supabase/logflare:1.4.0 supabase.azurecr.io/supabase-logflare && \
docker push supabase.azurecr.io/supabase-logflare
```
