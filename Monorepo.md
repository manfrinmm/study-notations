## Introdução

Pegar sua aplicação que está separadas em outros repositórios e juntar em um único repositório.

Vantages:

- Compartilhamentos de node_modules (dependências) - yarnWorkSpaces
- Compartilhamentos de lógicas dentro da aplicação.

Desvantagens:

- O CRA não tem uma compatibilidade muito bom com yarnWorkSpaces

## Configurando o yarnWorkSpaces:

Modificando o arquivo `package.json`:

```json
{
  "name": "live-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": {
    "packages": ["server", "clients/*"]
  }
}
```

- `workspaces/packages` informa quais pacotes você tem dentro da sua aplicação.

Adicionar um `packageName/package.json` dentro de cada pacote:

```json
{
  "name": "@clients/user",
  "version": "1.0.0",
  "private": true
}
```

## Adicionando dependencies nos packages:

- `yarn workspace @clients/user add react react-dom`
- `yarn workspace @clients/admin add react react-dom`

## Criando arquivos compartilhados

- Criar uma pasta `shared` e lá dentro coloque todos os arquivos que serão compartilhados

- Criar um arquivo `shared/package.json` informando qual pasta quer compartilhar:

```json
{
  "name": "shared/components",
  "version": "1.0.0",
  "private": true
}
```

**Lembrando que os arquivos que ficam dentro da pasta `shared` também precisam de dependências, logo é necessário deixar elas no arquivo `shared/package.json`**

Modificando o arquivo `package.json` encontrado na pasta root do projeto:

```json
{
  "name": "live-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": {
    "packages": ["server", "clients/*", "shared/*"]
  }
}
```

Feito isso, rode `yarn` para linkar todas as mudanças que foram feitas.

Agora basta importar o arquivo na pasta `shared` a onde for necessário:

```js
import { Header } from "@shared/components";
```
