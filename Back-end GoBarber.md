# Estrutura base

Iniciar um projeto com `yarn init -y`.

## Ferramentas

- `express`
- `typescript` (dev dependencies)
- `@types/express` (dev dependencies)
- `ts-node-dev (dev` dependencies) -> Seria um `nodemon` para arquivos TS e também converte o código TS para JS.

Dev dependencies

- `ESLint`
- `eslint-import-resolver-typescript` -> Habilitar para o código a importação de arquivos TS.
- `prettier`
- `eslint-config-prettier`
- `eslint-plugin-prettier`

VS Code

- `EditorConfig` (Extensão do VS Code)
- `Debug` Integrado com VS Code

### Inciar o arquivo de configuração typescript `yarn tsc --init`.

- Alterar configurações no arquivo `tsconfig.json`:
  - outDir:"./dist"
  - rootDir: "./src"

### Configurar o ts-node-dev:

- Adicionar o script `"dev:server":"ts-node-dev --inspect --transpileOnly --ignore-watch node_modules ./src/server.ts"` ao `package.json`.
  - `--transpileOnly` serve apenas para fazer a transpilação, sem olhar erros no código.
  - `--ignore-watch node_modules` evitar que o `ts-node-dev` tente compilar os módulos dentro da pasta `node_modules`.
  - `--inspect` serve para que o debugger consiga se conectar na aplicação.

### Configurar o EditorConfig

- Criar o arquivo `.editorconfig`.

Adicionar esse código:

```Properties
root = true

[*]
end_of_line = lf
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

```

### Configurar o ESLint

ESLint serve para manter um padrão de código.

Inicializar a configuração `yarn eslint --init`.
Seleção das respostas

- `To check syntax, find problems, and force code style`.
- `JavaScript modules (import/export)`.
- `Node of these`.
- `Yes`.
- `Node`.
- `Use a popular style guide`.
- `Airbnb`.
- `JSON`.
- `N`.

Ao final ele irá mostrar uma linha com todas as dependências necessárias. Copie ela, remova a dependência `eslint` e instale via `yarn`.

Modificando e adicionando dados no arquivo `.eslintrc.json`:

```json
  "extends":[
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  "plugins":[
    "@typescript-eslint",
    "prettier"
  ]
  "rules":{
    "prettier/prettier": "error",
    "import/extensions":[
      "error",
      "ignorePackages",
      {
        "ts":"never"
      }
    ]
  },
  "settings":{
    "import/resolver":{
      "typescript":{}
    }
  }
```

Modificando e adicionando dados no arquivo `.eslintignore` -> Esse arquivo serve para que o eslint não monitore os arquivos selecionados:

```ignore
/*.js
node_modules
dist
```

Adicionar essas configurações no VS code para que todas as vezes que um arquivo for salvo, seja salvo de acordo com as configurações do eslint configurado.

```JSON
"[javascript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "[javascriptreact]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "[typescript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  },
  "[typescriptreact]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  }
```

### Configurar o Prettier

Prettier serve para deixar o código com uma leitura melhor.

Modificando e adicionando dados no arquivo `.prettierrc`:

```json
{
  "singleQuote": false,
  "tailingComma": "all",
  "arrowParens": "avoid"
}
```

### Técnica de Debug

Modificando e adicionando dados no arquivo `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "protocol": "inspector",
      "restart": true,
      "name": "Debug",
      "skipFiles": ["<node_internals>/**"],
      "outFiles": ["${workspaceFolder}/**/*.js"]
    }
  ]
}
```

## Estrutura de arquivos

- src
  - routes
    - index.ts
  - server.ts
