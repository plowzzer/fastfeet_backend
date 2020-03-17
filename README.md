# Fastfeet - Backend

### Sobre o projeto:

Parte Backend do desenvolvimento da aplicação do Fastfeet (https://github.com/plowzzer/Fastfeet)

### 💻 Instalação, execução e desenvolvimento

- Instale os pacotes com: `yarn`
- Rode `docker-compose up` para montar o ambiente;
- Rode os comandos abaixo para instalar as imagens do Docker
- Copie o `.env.exemple` para `.env` com as suas variaveis de ambiente
- Rode `yarn sequelize db:migrate` para executar as migrations;
- Você pode usar o Insomnia para validar os endpoints e documentação atraves do arquivo `Insomnia.json`
- Para entrar em ambiente de desenvolvimento use `yarn dev`

#### Docker files:

`docker run --name some-postgres -e POSTGRES_PASSWORD=mysecretpassword -d postgres`

`docker run --name redisFestfeet -p 6379:6379 -d -t redis:alpine`
