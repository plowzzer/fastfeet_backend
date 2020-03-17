# Fastfeet - Backend

### Sobre o projeto:

Parte Backend do desenvolvimento da aplicação do Fastfeet (https://github.com/plowzzer/Fastfeet)

### 💻 Instalação, execução e desenvolvimento

- To run the development server: `yarn dev`
- Rode os comandos abaixo para instalar as imagens do Docker
- Copie o `.env.exemple` para `.env` com as suas variaveis de ambiente
- Rode `yarn sequelize db:migrate` para executar as migrations;

#### Docker files:

`docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres`
`docker run --name redisFestfeet -p 6379:6379 -d -t redis:alpine`
