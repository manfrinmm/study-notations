## Db

- `docker run --name container_name -e REDIS_PASSWORD=senha -d -p 6379:6379 bitnami/redis:latest`

# Dockerfile

É uma coleção de instruções para criar uma imagem.

## Criando

```Dockerfile
FROM image

RUN comando_para_ser_executado

WORKDIR definir_pasta_padrão

COPY arquivos_para_serem_copiados destino_para_ser_colado

USER define_qual_usuário_será_utilizado

EXPOSE porta_que_será_utilizada_para_acessar_o_container

CMD ["comando","para","ser","executado"]
```

- `FROM` indica qual imagem irá ser utilizada. Essa `image` será buscar no dockerHub.

- `WORKDIR` indica qual pasta da sua maquina todos os comandos a baixos serão executados.

- `COPY` todos arquivos selecionados serão colados em `definir_pasta_padrão`, que foi definido no comando `WORKDIR`.

- `CMD` define quais comandos serão executados e o local. CMD é único para cada Dockerfile, ele também pode ser sobrescrito pelo `docker-composer`.

## Executando

- `docker build -t container_name caminho_do_Dockerfile`

- `container_name` nome para o container a onde irá executar seu Dockerfile.

## Exemplo01

Criamos um arquivo chamado `.dockerignore`, onde conterá todos os arquivos/pasta que serão ignorados na cópia. Conteúdo do dockerignore:

      node_modules
      .dockerignore
      DockerFile
      *.log

```Dockerfile
  FROM node:lts-alpine

  RUN mkdir -p /home/node/api/node_modules && chown -R node:node /home/node/api

  WORKDIR /home/node/api

  COPY package.json yarn.* ./

  USER node

  RUN yarn

  COPY --chown=node:node . .

  EXPOSE 3333

  CMD ["node","scr/index"]
```

- `FROM` -> Criando um Dockerfile com a imagem do node-alpine. Essa imagem não possui o usuário root, bom para manter a segurança.

- `RUN` -> Criamos o diretório para que a aplicação funcione e que eles sejam criados com o usuário `node`, que não tem permissão de root.

- `WORKDIR` -> Definimos a pasta /home/node/api como caminho padrão.

- `COPY` -> Nesse comandos copiamos o `package.json` e o `yarn`.

  > Esse `*` no `yarn.` serve para que copie também todos os arquivos referentes ao yarn. Isso serve também para os mecanismos de cache do docker.

- `USER` -> Definimos o usuário `node` para executar a aplicação.

- `RUN` -> Instala todas as dependência com `yarn`. Lembrando que essa imagem já possui o yarn instalado.

- `COPY` -> Depois de instalar as dependências iremos copiar o restante dos arquivos. Tudo o que será copiado pertencerá ao usuário node.

- `EXPOSE` -> Definimos a porta `3333` para acessar a aplicação.

Executando

- `docker build -t leader-api .`

## Exemplo02

```Dockerfile
  FROM node:alpine

  WORKDIR /usr/app

  COPY package*.json ./
  RUN npm

  COPY . .

  EXPOSE 3333

  CMD ["npm","start"]
```

dockerignore:

```.dockerignore
node_modules
```

- Criando imagem:
  - `docker build -t docker-node .`
- Utilizando imagem:
  - `docker run -p 3333:3333 -d docker-node`

# Docker Compose

É um orquestrador de container. Ele define como um container deve se comportar.

```YAML
version: "3"

services:
  container-name:
    build: .
    image: image-name
    container-name: nome-do-container
    command: comando-para-ser-executado-quando-container-subir
    volumes:
      - .:/home/node/api
      - /home/node/api/node_modules
    ports: "3333:3333"
volumes:

networks:
```

- `version` indica qual versão será utilizada do manisfesto.

Existem três tipos de configurações dentro do docker composer:

- `services` são referentes as configurações de containers:

  - `container-name` nome do container:
    - `build` caminho para o `Dockerfile`.
    - `image` também é possível criar as configurações de um container aqui mesmo, passando todas as configurações que existem dentro do `Dockerfile`.
    - `container-name` nome que será dado ao container.
  - `volumes` mapeando as pastas.
  - `ports` porta que será exposta do container.

- `volumes` parte de armazenamento, persistindo dados.

- `network` forma dos containers "conversarem" entre si.

## Exemplo01

```YAML
version: "3"

services:

  leader-redis:
    image: bitnami/redis:latest
    container-name: leader-redis
    env_file:
      - env.testing
      - env.staging
    environment:
      - ALLOW_EMPTY_PASSWORD=no
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    volumes:
     - leader-redis-data:/data
     networks:
      - leader-network

  leader-api:
    build: .
    container-name: leader-api
    volumes:
      - .:/home/node/api
      - /home/node/api/node_modules
    ports: "3333:3333"
    depends_on: leader-redis
    networks:
      - leader-network

volumes:
 - leader-redis-data:

networks:
  leader-network:
    driver: bridge
```

- `environment` lê o arquivo `.env` e busca as variáveis de lá.

## Executando

- `docker-compose up`

## Exemplo02

```YAML
version: "3"

services:

  leader-api:
    build: .
    command: npm start
    ports: "3000:3000"
    container-name: leader-api
    volumes:
      - .:/usr/app
```

- `volumes` está espelhando a pasta atual `.` e passando todas as informações para a pasta `/usr/app`

## Executando

- `docker-compose up`

# Docker Machine
