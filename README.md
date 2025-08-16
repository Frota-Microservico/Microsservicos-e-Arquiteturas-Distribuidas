# Microsserviços e Arquiteturas Distribuídas

## Para rodar localmente
É preciso alterar crair o banco dentro do container:

```console
docker exec -it postgres_gerenciador_frota psql -U gerenciador_frota_user
```

```console
CREATE DATABASE gerenciador_frota OWNER gerenciador_frota_user;
```
