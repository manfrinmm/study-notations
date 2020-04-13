# Criando um servidor

Caso a conexão caia e precise finalizar o processo node

- `lsof -i :porta` -> Descobre todos os processos que estão rodando na `porta`. Selecione o `PID` do processo.

- `kill -9 PID` -> Irá encerrar o processo com o `PID`.

## Modos de acesso

- Via `ssh`:
  - `ssh username@ip-address`.
  - No primeiro acesso o usuário irá ser o mesmo do id_rsa.pub (ssh key).
- Dicas de ssh:

  - `sudo nano /etc/ssh/sshd_config`
  - Adicione essas configurações ao arquivo.

        ClientAliveInterval 30
        TCPKeepAlive yes
        ClientAliveCountMax 99999

  - `sudo service sshd restart` -> É necessário reiniciar o serviço de ssh.

## Primeiro acesso

- `apt update` -> para atualizar todos os pacotes instalados.
- `apt upgrade` -> para atualizar todos as dependências instalados.

- `adduser deploy` -> Criar um novo usuário chamado "deploy".

- `usermod -aG sudo deploy` -> Da acesso de administrador para o usuário "deploy"

---

Permitir acessar o usuário "deploy" de forma direta:

- `cd /home/deploy/` -> entrar na pasta do usuário.
- `mkdir .ssh` -> Criar uma pasta "ssh".
- `cd .ssh` -> Entrar na pata "ssh".
- `cp ~/.ssh/authorized_keys .` -> Copia o arquivo "authorized_keys" para a pasta atual.
- `chown deploy:deploy authorized_keys` -> Troca o dono do arquivo "authorized_keys" para o usuário "deploy".

---

Instalando o git

- `add-apt-repository ppa:git-core/ppa`.
- `apt update`.
- `apt install git`.

---

[Instalar Node](https://github.com/nodesource/distributions/blob/master/README.md)

---

[Instalar o docker](https://docs.docker.com/engine/install/ubuntu/)

## Clonando aplicação

- Aplicação em MONOREPO:
  - `git init`.
  - `git remote add -f origin URL_DO_REPOSITÓRIO_MONO_REPO`.
  - `git config core.sparseCheckout true`.
  - `git sparse-checkout set "CAMINHO_DA_APLICAÇÃO_A_PARTIR_DO_REPOSITÓRIO_RAIZ"`.
  - `git pull origin master`.
- Aplicação comum:
  - `git clone URL_DO_REPOSITÓRIO`.

## Configurando variáveis ambiente

- `cp .env.example .env`

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

## Configurando aplicação

- Criar dois novos `scripts` dentro do `package.json`

  - Aplicação configurado com `sucrase`:
    - `build:sucrase ./src -d ./dist --transforms imports`
    - `start:node dist/server.js`
  - Aplicação configurado sem `sucrase`:
    - `start:node src/server.js`

- ## [Habilitando o firewall](https://www.hostinger.com.br/tutoriais/firewall-ubuntu-ufw/) - Não é obrigatório.

  - `sudo apt-get install ufw` -> Instalar o `ufw` para configurar o firewall.
  - `sudo ufw enable` -> Habilitar o `ufw`.
  - `sudo ufw allow PORTA/PROTOCOLO` -> Liberar a `PORTA`.
  - `sudo ufw deny PORTA/PROTOCOLO` -> Bloquear a `PORTA`.

## Configurando NGINX

Ele é uma ferramenta de PROXY reverso.

Ele vai fazer o redirecionamento de porta.

Por padrão ele já é configurado para rodar na porta 80.

- `sudo apt install nginx` -> Irá instalar o nginx.
- `sudo nano /etc/nginx/sites-available/default` -> Editar o arquivo de configuração do nginx.

O arquivo deve ficar nesse formato:

```nginx
  server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

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

- `sudo nginx -t` -> Testa os arquivos de configuração e verifica se estão certos.
- `sudo service nginx restart` -> Reiniciar o serviço do nginx.

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

## Configurando buddy

# Configurando Docker

- `sudo groupadd docker`
- `sudo usermod -aG docker $USER`

## Criando serviços do Docker

- `docker run --name postgres -e POSTGRES_PASSWORD=senhaEscolhida -p 5432:5432 -d -t postgres`

- `docker run --name mongo -p 27017:27017 -d -t mongo`

- `docker run --name redis -p 6379:6379 -d -t redis:alpine`

## Criando base de dados para o Postgres

- `docker exec -i -t postgres /bin/sh`
- `su postgres`
- `psql`
- `\dt`
- `CREATE DATABASE nomeDaDatabase;` -> nomeDaDatabase DEVE ser minúsculo.
- `\q`
- `exit`
- `exit`

Criar um volume postgresql
`docker run --name postgres -e POSTGRES_PASSWORD=senhaEscolhida -p 5432:5432 -d -t -v /home/deploy/ateste:/var/lib/postgresql/data postgres`
