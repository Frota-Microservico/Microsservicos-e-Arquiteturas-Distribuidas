# Microsserviços e Arquiteturas Distribuídas

## Para rodar localmente

Abrir a pasta do projeto, rodar "docker compose --build -d"

É preciso alterar criar o banco dentro do container:

```console
docker exec -it postgres_gerenciador_frota psql -U gerenciador_frota_user
```

```console
CREATE DATABASE gerenciador_frota OWNER gerenciador_frota_user;
```
INSERT INTO usuarios (name, email, pass, isadmin, createdAt, updatedAt) VALUES ('Admin','superadmin@test.com','12345678',true,NOW(),NOW());

Após isso dar cd frontend, rodar os seguintes comandos "npm i" "npm run dev"

Abrir o navegador na pagina: http://localhost:3008/login
