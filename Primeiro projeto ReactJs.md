# Iniciando projeto

- `create-react-app name-project --template=typescript` -> Já vem um projeto configurado, ou seja, não precisa configurar webpack. A Flag `--template` dizemos qual template queremos usar, nesse caso o typescript.

- `yarn start` -> Irá iniciar o projeto.

## Configurando EditorConfig

```properties
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
end_of_line = lf

```

## Configurando ESLint e Prettier

Dev Dependencies

- `eslint`.
- `eslint-import-resolver-typescript`.
- `prettier`.
- `eslint-config-prettier`.
- `eslint-plugin-prettier`.
- `eslint-plugin-import-helpers`

- Remover a propriedade `eslintConfig` do arquivo `package.json`.

- `yarn eslint --init`:
  - Use a popular style guide (`Airbnb`).

Ao final ele irá mostrar uma linha com todas as dependências necessárias. Copie ela, remova a dependência `eslint`, seleciona a ultima versão do `eslint-plugin-react-hooks` e instale via `yarn -D`.

Modificando e adicionando dados no arquivo `.eslintignore`:

```Ignore
**/*.js
node_modules
build
```

Modificando e adicionando dados no arquivo `.eslintrc.json`:

```json
{
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "plugins": ["react-hooks", "prettier", "eslint-plugin-import-helpers"],
  "rules": {
    "prettier/prettier": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/camelcase": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".tsx"] }],
    "import/prefer-default-export": "off",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true
      }
    ],
    "import-helpers/order-imports": [
      "warn",
      {
        "newlinesBetween": "always",
        "groups": ["/^react/", "module", ["parent", "sibling", "index"]],
        "alphabetize": { "order": "asc", "ignoreCase": true }
      }
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "ts": "never",
        "tsx": "never"
      }
    ]
  },
  "settings": {
    "import/resolver": {
      "typescript": {}
    }
  }
}
```

Criando e Modificando o arquivo `.prettierrc`:

```json
{
  "singleQuote": false,
  "trailingComma": "all",
  "arrowParens": "avoid"
}
```

## Criando Rotas

Dependencies

- `react-router-dom`.
- `@types/react-router-dom` (Dev Dependencies).

Criar arquivo `routes/index.tsx`:

```tsx
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Dashboard from "~/pages/Dashboard";
import Repository from "~/pages/Repository";

const Routes: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Dashboard} />
      <Route path="/repository" component={Repository} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
```

- Elementos:
  - `BrowserRouter` -> Usar rotas de navegadores.
  - `Switch` -> Garante que apenas uma rota seja chamada a cada requisição
  - `Route` -> A rota (`path`) que será chamada e qual componente será renderizado(`component`).

# Aplicação

Github Explorer

Global style:

```ts
import { createGlobalStyle } from "styled-components";

// Fonte Roboto: bold 700 e regular 400;

import githubBackground from "~/assets/github-background.svg";

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline: 0;
    border-box: box-sizing;
  }

  body{
    background: #f0f0f5 url(${githubBackground}) no-repeat 70% top;
    -webkit-font-smoothing: antialiased;
    
  }

  body, input, button {
    font: 16px Roboto, sans-serif;
  }

  #root {
    max-width: 960px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  button {
    cursor: pointer;
  }
`;
```
