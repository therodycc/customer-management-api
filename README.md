<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

Api de  desarrollado con el siguiente Stack:

- PostgresDB
- NestJS

```bash
Node v18.14.2
docker-compose.yml v3.9
Postgres v16
Nest v10.3.2
```

### Especificaciones Generales

- Base URL: https://localhost:3000
- Formato de Respuesta: JSON
- Autenticación: Token (JWT) by cookies

### Run MinIO local

```bash
  docker run -p 9000:9000 -p 9001:9001 \
    --name minio \
    -e "MINIO_ROOT_USER=my-root-user" \
    -e "MINIO_ROOT_PASSWORD=my-root-password" \
    -v /Users/macbookpro2017/minio/data:/data \
    -v /Users/macbookpro2017/minio/config:/root/.minio \
    quay.io/minio/minio server /data --console-address ":9001"
```

### Ejecutar en local

```bash
git clone git@github.com:repository-name/customer-management-api.git
```

```bash
npm i
```

```bash
yarn start:local
```

### Environments

```bash
```

### Endpoints (Documentation)

```bash
/api/docs
```

Estructura del Módulo

```bash
src/
├── [nombre-del-modulo]/
│   ├── controllers/         # Controladores para manejar las solicitudes HTTP
│   ├── dto/                 # Data Transfer Objects para validaciones y transformación de datos
│   ├── entities/            # Entidades que representan las tablas de la base de datos
│   ├── repositories/        # Repositorios para acceso a datos
│   ├── services/            # Servicios con la lógica de negocio
│   ├── mapper/              # (Opcional) Transformadores entre entidades y DTOs
│   └── [nombre-del-modulo].module.ts # Configuración del módulo
```
# customer-management-api
