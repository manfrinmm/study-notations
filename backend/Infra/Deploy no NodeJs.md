# Convertendo código TS -> JS

## Babel

- `yarn add -D @babel/cli @babel/core @babel/node @babel/preset-env @babel/preset-typescript babel-plugin-module-resolver babel-plugin-transform-typescript-metadata @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties`

- Criar arquivo de configuração do babel `babel.config.js`:

```js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        // Vai ser os paths declarados dentro do arquivo `tsconfig.json`
        alias: {
          "@modules": "./src/modules",
          "@config": "./src/config",
          "@shared": "./src/shared",
        },
      },
    ],
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};
```

- executando conversão: `babel src --extensions \".js,.ts\" --out-dir dist --copy-files`

## Alterando arquivo `ormconfig.json`

- Alterar todos os caminhos `src` para `dist`

## Executando Migrations

- `yarn ./node_modules/.bin/typeorm migration:run`

# Criando um servidor

## Modos de acesso

- Via `ssh`:
  - `ssh username@ip-address`.
  - No primeiro acesso o usuário irá ser o mesmo do id_rsa.pub (ssh key).
- Dicas de ssh:

  - `sudo nano /etc/ssh/sshd_config`
  - Adicione essas configurações ao arquivo:

        ClientAliveInterval 30
        TCPKeepAlive yes
        ClientAliveCountMax 99999

  - `sudo service sshd restart` -> É necessário reiniciar o serviço de ssh.

## Configurações

### Primeiro acesso

- `apt update` -> para atualizar todos os pacotes instalados.
- `apt upgrade` -> para atualizar todos as dependências instalados.

- `adduser deploy` -> Criar um novo usuário chamado "deploy".

- `usermod -aG sudo deploy` -> Da acesso de administrador para o usuário "deploy"

#### Permitir acessar o usuário "deploy" de forma direta:

- `cd /home/deploy/` -> entrar na pasta do usuário.
- `mkdir .ssh` -> Criar uma pasta "ssh".
- `cd .ssh` -> Entrar na pata "ssh".
- `cp ~/.ssh/authorized_keys .` -> Copia o arquivo "authorized_keys" para a pasta atual.
- `chown deploy:deploy authorized_keys` -> Troca o dono do arquivo "authorized_keys" para o usuário "deploy".

### Pacotes necessários

- **git**
- **NodeJs**
- **Docker**

### Configurando Docker

Usar o comando `docker` sem o `sudo`:

- `sudo groupadd docker`
- `sudo usermod -aG docker $USER`

### [Habilitando o firewall](https://www.hostinger.com.br/tutoriais/firewall-ubuntu-ufw/) - Somente se for necessário.

Ele é necessário quando a porta da sua aplicação não estiver liberado para acessos externos.

- `sudo apt-get install ufw` -> Instalar o `ufw` para configurar o firewall.
- `sudo ufw allow 22` -> Habilitar porta do ssh.
- `sudo ufw enable` -> Habilitar o `ufw`.
- `sudo ufw allow PORTA/PROTOCOLO` -> Liberar a `PORTA`.
- `sudo ufw deny PORTA/PROTOCOLO` -> Bloquear a `PORTA`.

## Configurando aplicação

### Clocando aplicação

- Aplicação em MONOREPO:
  - `git init`
  - `git remote add -f origin URL_DO_REPOSITÓRIO_MONO_REPO`
  - `git config core.sparseCheckout true`
  - `git sparse-checkout set "CAMINHO_DA_APLICAÇÃO_A_PARTIR_DO_REPOSITÓRIO_RAIZ"`
  - `git pull origin master`
- Aplicação comum:
  - `git clone URL_DO_REPOSITÓRIO`

### Configurando variáveis ambiente

- `cp .env.example .env`

- Preencher todos os dados necessários.

      - Database
        - DB_HOST=localhost
        - DB_USER=docker
        - DB_PASS=senhaEscolhida
        - DB_NAME=nomeDaDatabase
      - Mongo
        - MONGO_URL=mongodb://localhost:27017/nomeDaDatabase
      - Redis
        - REDIS_HOST=localhost
        - REDIS_PORT=6379

---

### Adicionando scripts (Caso ainda não tenha)

- Criar dois novos `scripts` dentro do `package.json`
  - Aplicação configurado com `sucrase`:
    - `"build": "sucrase ./src -d ./dist --transforms imports"`
    - `"start": "node dist/server.js"`
  - Aplicação configurado sem `sucrase`:
    - `"start": "node src/server.js"`

## Criando serviços do Docker

- `docker run --name postgres -e POSTGRES_PASSWORD=senhaEscolhida -p 5432:5432 -d postgres`

- `docker run --name mongo -p 27017:27017 -d mongo`

- `docker run --name redis -p 6379:6379 -d redis:alpine`

### Bitnami (Images com segurança aprimorada (default))

chown 1001:1001 -R docker

- `docker run --name postgres -e POSTGRESQL_PASSWORD=senhaEscolhida -e POSTGRESQL_USERNAME=postgres -e POSTGRESQL_DATABASE=gobarber -p 35432:5432 -d bitnami/postgresql:latest`

- `docker run --name mongo -e MONGODB_USERNAME=gobarber -e MONGODB_PASSWORD=senhaEscolhida2 -e MONGODB_DATABASE=gobarber -p 47017:27017 -d bitnami/mongodb:latest`

- `docker run --name redis -e REDIS_PASSWORD=senhaEscolhida3 -p 56379:6379 -d bitnami/redis:latest`

### Dicas

- Colocar portas diferentes para evitar acesso indesejados à base de dados.
- Colocar senhas diferentes para cada banco.

### Criando database para o PostgreSQL

- `docker exec -i -t postgres /bin/sh`
- `su postgres`
- `psql`
- `\dt`
- `CREATE DATABASE nomeDaDatabase;` (nomeDaDatabase DEVE ser minúsculo)
- `\q`
- `exit`
- `exit`

---

```bash
CREATE DATABASE "nome-da-database" WITH OWNER "postgres" ENCODING "UTF8";
```

## Configurando NGINX

Ele é uma ferramenta de PROXY reverso.

Ele vai fazer o redirecionamento de portas.

Por padrão ele já é configurado para rodar na porta 80.

- `sudo apt install nginx` -> Irá instalar o nginx.
- `sudo vim /etc/nginx/sites-available/default` -> Editar o arquivo de configuração do nginx.

O arquivo deve ficar nesse formato:

```nginx
  server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name URL_REQUEST;

    location / {
      proxy_pass http://localhost:3333;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
  }
```

ou para configurar mais de um server_name

```nginx
  server {
    server_name URL_REQUEST;

    location / {
      proxy_pass http://localhost:3333;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }
  }
```

Configuração:

- `location /api` -> Informa o que deve acontecer quando acessar a rota `endereço-ip-do-servidor/api`
- `proxy_pass` -> Qual endereço deve ser acessado dentro do servidor.

---

Revisando arquivo de configuração:

- `sudo nginx -t` -> Testa os arquivos de configuração e verifica se estão certos.
- `sudo service nginx restart` -> Reiniciar o serviço do nginx.

## Configurando Apache

Ele é uma ferramenta de PROXY reverso. Uma alternativa ao Nginx.

Ele vai fazer o redirecionamento de portas.

- Vá até esta pasta do apache `cd /usr/local/apache`
- Entre na pasta `conf/userdata`.
- Aqui faremos a seguinte estrutura:

```bash
.
├── ssl
│   └── 2_4
│       └── username
│           └── site.url
│              └── reverseproxy.conf
├── std
│   └── 2_4
│       └── username
│           └── site.url
│              └── reverseproxy.conf
```

O arquivo `reverseproxy.conf` deve ficar nesse formato:

```apache
ProxyPreserveHost On
ProxyPass / http://localhost:3333/
ProxyPassReverse / http://localhost:3333/


```

Rebuild de configuração `/usr/local/cpanel/scripts/rebuildhttpdconf`

Restart apache `/usr/local/cpanel/scripts/restartsrv_httpd`

---

WHM -> Configuração do Apache -> Pre main include:

```apache
<VirtualHost *:80>
  ServerName api.ropropulm.devmatheus.com
  ServerAlias www.api.ropropulm.devmatheus.com

  ProxyPreserveHost On
  ProxyPass / http://localhost:4333/
  ProxyPassReverse / http://localhost:4333/
</VirtualHost>

<VirtualHost *:443>
  ServerName api.ropropulm.devmatheus.com
  ServerAlias www.api.ropropulm.devmatheus.com

  ProxyPreserveHost On
  ProxyPass / http://localhost:4333/
  ProxyPassReverse / http://localhost:4333/

  SSLEngine on
  SSLCertificateFile /var/cpanel/ssl/system/certs/api_ropropulm_devmatheus_com_a8bf2_98e25_1681791413_aec5a4110e2de673ed5cc07ce1d152b9.crt
  SSLCertificateKeyFile /var/cpanel/ssl/system/keys/a8bf2_98e25_95762843a6f6ca186ed0f6b5144f84ee.key
</VirtualHost>
```

---

Esse procedimento ainda precisa validado, contudo esse caminho foi utilizado para uma aplicação hospedada em um servidor que possui apache e cpanel instalados e configurados.

## Configurando o Certbot

Add Certbot PPA

- `sudo apt-get install software-properties-common`.
- `sudo add-apt-repository universe`.
- `sudo add-apt-repository ppa:certbot/certbot`.
- `sudo apt-get update`.

Install Certbot

- `sudo apt-get install certbot python-certbot-nginx`

Modo de configuração

- `sudo certbot --nginx` -> Irá instalar o certificado e configurar o arquivo nginx automaticamente.
- `sudo certbot certonly --nginx` -> Irá apenas instalar o certificado.

Teste de renovação do certificado.

- `sudo certbot renew --dry-run`

## Configurando pm2

Serve para poder continuar a aplicação em modo background.

- `sudo npm install -g pm2` -> Instalando como uma dependência global do servidor.

- `pm2 start path-to-file` -> Informa qual arquivo deve ser executado.

- `pm2 startup systemd` -> Iniciar o serviço do pm2 juntamente com o sistema operacional.

- `pm2 start --name "client-admin" "yarn start-admin"` -> Ou pode executar um script

- `pm2 save` -> Sempre que adicionar um novo processo para o pm2 executar, deve salvar ele utilizando esse comando.

## Configurando integração contínua

### Utilizando o Buddy

- Inicie um novo projeto.
- Selecione um repositório.

#### Configurando pipeline

- `Trigger mode: On Push` -> Essa pipeline será executada sempre que tiver uma nova alteração (push) no repositório.

- `single branch -> master`. Irá "escutar" as alterações apenas na branch `master`.

---

Copiando código para o servidor:

- `Source path` -> O que será copiado do repositório.
- Selecione o servidor(cloud) que está utilizando e faça os passos necessários.
- Método de acesso: `ssh`.
- `Remote path: ~/app` -> A onde será colocado o que foi copiado do repositório. Nesse caso será colado na pasta `app`.

---

Executando comandos após ter copiado os arquivos:

- `npm install`
- `npm run build`
- `npx sequelize db:migrate` -> Irá executado a migration, nesse caso do sequelize.
- `pm2 restart server` -> Irá restart o serviço que o pm2 está executando, nesse caso o nome dele é `server`
- `Working directory: ~/app` -> A onde será executado os comandos dados acima.

### Utilizando o Github Actions

Criar uma chave no servidor:

- `cd .ssh`
- `ssh-keygen`:
  - fileName: `github_actions`
- Adicionar o conteúdo da chave `github_actions.pub` dentro do arquivo `authorized_keys`
- Adicionar o conteúdo da chave `github_actions` como valor da chave `SSH_KEY` do github.

Criando secrets:

- Servidor:
  - Name: SSH_HOST
  - Value: IP_DO_SERVIDOR
- Servidor_Porta:
  - Name: SSH_PORT
  - Value: PORTA_DE_ACESSO_DO_SERVIDOR_VIA_SSH
- Usuário:
  - Name: SSH_USER
  - Value: NOME_DO_USUÁRIO
- Chave de acesso:
  - Name: SSH_KEY
  - Value: CONTEÚDO DA CHAVE `github_actions`

Criando Workflow:

- Arquivo de exemplo:

```yaml
name: CI

on:
  push:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      # Instalar NodeJs
      - name: Setup Node.js environment
        uses: actions/setup-node@v1.4.2
        with:
          node-version: 12.x

      - name: Get yarn cache directory path
        id: yarn-cache-dir-path
        run: echo "::set-output name=dir::$(yarn cache dir)"

      - uses: actions/cache@v2
        id: yarn-cache # use this to check for `cache-hit` (`steps.yarn-cache.outputs.cache-hit != 'true'`)
        with:
          path: ${{ steps.yarn-cache-dir-path.outputs.dir }}
          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-

      # Instalar as depedências NPM/Yarn
      - name: Install dependencies
        run: yarn

      # Executar a build
      - name: Run build
        run: yarn build

      # Copiar código para o Servidor
      - name: Copy code to Server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          port: ${{ secrets.SSH_PORT }}
          key: ${{ secrets.SSH_KEY }}
          source: ".,!node_modules"
          target: "~/app"

      # Instalar as depedências NPM/YARN no Servidor
      # Executar as migrations Typeorm
      # Restart no servidor NodeJs
      - name: Run production scripts on Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          port: ${{ secrets.SSH_PORT }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd ~/app
            yarn
            ./node_modules/.bin/typeorm migration:run
            pm2 restart service_name
```

- Arquivo de exemplo para monorepo:

```yml
name: CI

on:
  push:
    branches: [master]
    paths:
      - "server/**"

  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: "./server"

    steps:
      - uses: actions/checkout@v3

      - name: Setup NodeJs
        uses: actions/setup-node@v2
        with:
          node-version: 14.x

      - name: Get yarn cache directory path
        id: yarn-cache-dir-path
        run: echo "::set-output name=dir::$(yarn cache dir)"

      - uses: actions/cache@v3
        id: yarn-cache # use this to check for `cache-hit` (`steps.yarn-cache.outputs.cache-hit != 'true'`)
        with:
          path: ${{ steps.yarn-cache-dir-path.outputs.dir }}
          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-

      - name: Install Dependencies
        run: yarn

      - name: Run Build
        run: yarn build

      - uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          port: ${{ secrets.SSH_PORT }}
          key: ${{ secrets.SSH_KEY }}
          username: ${{ secrets.SSH_USER }}
          source: "server/*, !server/src, !server/docs, !server/node_modules"
          target: "~/apps/my-table-control"

      - uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          port: ${{ secrets.SSH_PORT }}
          key: ${{ secrets.SSH_KEY }}
          username: ${{ secrets.SSH_USER }}
          script: |
            cd ~/apps/my-table-control/server
            yarn --production
            yarn prisma migrate deploy
            pm2 reload api-my-table-control
```

# Inicializando aplicação

- Instale as dependências do projeto.
- Rode o script de build.
- Rode o script de migrations.
- Rode o script de inicializar a aplicação.

# Utils

Caso a conexão caia e precise finalizar o processo node

- `lsof -i :porta` -> Descobre todos os processos que estão rodando na `porta`. Selecione o `PID` do processo.

- `kill -9 PID` -> Irá encerrar o processo com o `PID`.

## Trabalhando ainda...

## Docker

Criar um volume postgresql
`docker run --name postgres -e POSTGRES_PASSWORD=senhaEscolhida -p 5432:5432 -d -t -v /home/deploy/ateste:/var/lib/postgresql/data postgres`
