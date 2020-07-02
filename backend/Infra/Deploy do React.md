## Deploy do ReactJs no Google Storage

- Criar o nome do bucket com o mesmo nome do domínio no qual o site irá ser hospedado. Isso ajudará nas configurações mais tarde.
- Criar conta de serviço:
  - Nome: Mais descritivo possível, pois ela será utilizada pelo github actions
  - Permissão: Pode deixar sem nenhuma, pois irá configurar uma mais tarde.
- Configurar acesso ao Storage:
  - Permissão: `Administrador de objeto do Storage`
  - Editar configurações de site:
    - Sufixo da página: index.html
    - Página de erro 404: index.html

### Configurando domínio e IP fixo

Criando load balance:

- Nome: Deixar o nome mais descritivo possível.
- Configuração de back-end:
  - Criar um bucket de back-end:
    - Nome: Deixar o nome mais descritivo possível.
    - Selecionar o bucket.
    - Ativar cloud CDN.
- Configuração de front-end:
  - Selecionar protocolo https.
  - Criar um endereço IP fixo.
  - Redirecionar o domínio para esse IP.
  - Criar certificado.

### Utilizando o Github Actions

Key de acesso do storage:

- Código convertido: `cat nome_do_arquivo_baixado | base64`;

Criando secrets:

- Servidor:
  - Name: GCP_PROJECT
  - Value: ID_DO_PROJETO
- Servidor_Porta:
  - Name: GCP_SA_KEY
  - Value: CÓDIGO_CONVERTIDO

Criando Workflow:

- Arquivo de exemplo:

```yaml
name: CI

on:
  push:
    branches: [master]

env:
  BUCKET: nomeDoBucket

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v1
        with:
          node-version: 12.x

      - name: Install dependencies
        run: yarn install

      # - name: Run tests
      #   run: yarn test --watchAll false

      - name: Build
        run: yarn build

      - uses: GoogleCloudPlatform/github-actions/setup-gcloud@master
        with:
          version: "290.0.1"
          project_id: ${{ secrets.GCP_PROJECT }}
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          export_default_credentials: true

      - name: Upload filed to bucket
        run: gsutil -m rsync -R ./build gs://"$BUCKET"

      - name: Allow public access
        run: gsutil -m acl ch -R -u AllUsers:R gs://"$BUCKET"

      # Set cache meta for static files
      - name: Set Cache-Control
        run: gsutil -m setmeta -h "Cache-Control:public, max-age=15768000" gs://"$BUCKET"/**/*.{png,svg,css,js}

      # Set cache meta for index.html
      - name: Set Cache-Control
        run: gsutil setmeta -h "Cache-Control:no-cache, no-store" gs://"$BUCKET"/index.html
```
