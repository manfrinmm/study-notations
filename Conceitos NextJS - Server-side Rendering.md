## Introdução

- Ele é usado para que os robots de indexação possa indexar o nosso site também. Pois ele não habilita o JS na nossa página, e como o `React` é renderizado com JS, nada será mostrada ao Robô e por sua vez não irá indexar a nossa página.
- O HTML já é renderizado como a resposta, pois do jeito tradicional é que o conteúdo HTML seja gerado com JS, mas isso só acontece no parte do cliente.

Criando o projeto

- `yarn init -y`;

Instalando as Dependências

- `next`
- `react`
- `react-dom`

Criando estruturas de pastas:

- Criar arquivo `pages/index.js`

- `scripts`:
  ```json
  {
    "dev": "next", // Usado para ambiente de desenvolvimento. A cada vez que editarmos algum código JS, ele irá gerar uma build e mostrar essa altera com live reload.
    "start": "next start", // Depois de gerar a build irá rodar o next a partir da build gerada.
    "build": "next build" // Gerar a build dos arquivos já transpilados.
  }
  ```

## Páginas e navegação

Para garantir que dados sejam carregados de funções AJAX ao carregar a página (`componentDidMount()`). Nas páginas (somente nelas), temos a propriedade estática `PageName.getInitialProps = async () => { }`, dentro dela podemos fazer qualquer requisição que o backend irá conseguir mostrar esse dado em tela.

### Para fazer um link entre páginas:

```js
import Link from "next/link";

<Link href="/">
  <a>Voltar</a>
</Link>;
```

A tag `a` dentro do `Link` serve para que possamos sempre estilizar o `a`, não o `Link`.

### Observações

- A primeira página requisitada pelo servido é carregado por ele.
- As páginas seguintes são carregadas pelo cliente.

### Configurando o Head através das páginas

```js
import Head from "next/head";

<Head>
  // Aqui poderia colocar todas as tags que ficam dentro do `head` do `HTML`
</Head>;
```

### Configurando documento global

- Ele vai ser a base que irá montar todas as páginas da aplicação.

- Criar arquivo `pages/_document.js`.

```js
import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          // Todo `Head` que tiver dentro da nossa aplicação será anexado à
          esse.
          <style>{`body { background: #069 }`}</style>
        </Head>
        <body>
          <Main /> // Vai conter a página da nossa aplicação.
          <NextScript /> // Todo `script` que tiver dentro da nossa aplicação será
          anexado à esse.
        </body>
      </html>
    );
  }
}
```

Todas as vezes que houver alteração dentro desse arquivo é necessário refazer a `build` ou rodar novamente `yarn dev`.

### Utilizando HOCs (High Ordem Components )

High Ordem Components é uma função que retorna outra função e dentro dessa outra função passamos um componente para ela.

Geralmente se utiliza essa arquitetura quando precisa compartilhar funcionamentos entre os componentes (Páginas)

- Cadastrar todos os `HOCs` da aplicação: `src/hocs/nomeHOCs.js`

#### Integrando o Google Analytics com React

Dependências:

- `react-ga`

---

- `src/hocs/withAnalytics.js`

- Estrutura base de HOC com analytics implementado dentro do método `componentDidMount()`:

  ```js
  import React, { Component } from "react";
  import { loadGetInitialProps } from "next/dist/lib/utils";
  import ReactGA from "react-ga";

  export default () => (Composed) =>
    class extends Component {
      static getInitialProps(ctx) {
        // getInitialProps é nome da função que a página tem, caso não seja passado o Next não irá ter mais controle sobre a função e não saberá que ela está sendo executada.
        return loadGetInitialProps(Composed, ctx);
      }

      componentDidMount() {
        ReactGA.initialize("ID_ANALYTICS");
        ReactGA.pageview(window.location.pathname);
      }

      render() {
        return <Composed {...this.props} />;
      }
    };
  ```

Integrando isso à página:

```js
import withAnalytics from "../src/hocs/withAnalytics";

const Home = () => <div> Hello World </div>;

export default withAnalytics()(Home);
```

### Recursos estáticos

O certo é que o cliente importe os arquivos estáticos da aplicação.

Para que o Node não importe, crie uma pasta `static` e lá dentro coloque os arquivos.

Importando uma imagem:

```js
<img src="/static/name.jpg" />
```

**IMPORTANTE**, sempre é necessário começar com `/static` e lá dentro o caminho até o arquivo desejado.

### Servidor customizado

Dependências:

- `next-routes`;

É necessário reescrever a lógica de como next se comporta dentro do servido:

- Criar arquivo `server.js`:

```js
const { createServer } = require("http");
const next = require("next");
const routes = require("./routes");

const app = next({ dev: process.env.NODE_ENV !== "production" }); // Isso informa se estamos em ambiente de produção ou de desenvolvimento.

const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer(handler).listen(3000);
});
```

- Criar arquivo `routes.js`:

```js
const routes = require("next-routes");

module.exports = routes()
  .add("route", "nameOfFile")
  .add("/", "home")
  .add("/users/:username", "detail");
```

### Recebendo parâmetros das rotas

```js
const Detail = ({ user }) => (
  <div>
    <h1>{user.login}</h1>
    <img src={user.avatar_url} width="200" />
  </div>
);

Detail.getInitialProps = async ({ query }) => {
  // dentro da propriedade `query` terá os parâmetros passado à rota. SOMENTE depois de configurar o servidor customizado e os arquivos de rotas.
  const response = await axios.get(`
    https://api.github.com/users/${query.username}
  `);

  return { user: response.data };
};
```

- Alterar os `scripts`:
  - `dev` para `node server.js`.
  - `start` para `NODE_ENV=production&node server.js`.

Criando o arquivo de configuração do next:

- `next.config.js`:
  ```js
  module.exports = {
    useFileSystemPublicRoutes: false, // Essa configuração permite que a configuração de rotas seja entendida apenas pelo arquivo de `routes.js`. Caso contrário os arquivos dentro da pasta `pages` seriam as rotas.
  };
  ```

### Estilização com `styled-components`

É interessante que na primeira página requisitada pelo cliente seja renderizada com os estilos também no servidor.

Dependências

- `styled-components`.
- `babel-plugin-styled-components` (Dev Dependencies).

Configurando o `babel` para que possa transpilar os arquivos JS. Dessa forma ele irá criar arquivos que o Servidor e o Browser entenda.

- `.babelrc`:

```json
{
  "presets": ["next/babel"],
  "plugins": [
    [
      "babel-plugin-styled-components",
      {
        "ssr": true,
        "displayName": true,
        "preprocess": false
      }
    ]
  ]
}
```

- Alterar o arquivo `_document.js`:

```js
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />)
    );

    const styleTags = sheet.getStyleElement();

    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>
          // Todo `Head` que tiver dentro da nossa aplicação será anexado à
          esse.
          {this.props.styleTags} // Aqui ele irá colocar todas as tags de estilos
          dentro do primeiro carregamento da página.
        </Head>
        <body>
          <Main /> // Vai conter a página da nossa aplicação.
          <NextScript /> // Todo `script` que tiver dentro da nossa aplicação será
          anexado à esse.
        </body>
      </html>
    );
  }
}
```

### Definindo caminho raiz

Dependências

- `babel-plugin-root-import` (Dev Dependencies).

Alterar o arquivo `.babelrc`:

```json
{
  "presets": ["next/babel"],
  "plugins": [
    [
      "babel-plugin-root-import",
      {
        "rootPathPrefix": "~",
        "rootPathSuffix": "src"
      }
    ]
  ]
}
```

Criar o arquivo `jsconfig.json`:

```json
{
  "compileOptions": {
    "baseUrl": "./",
    "paths": {
      "~/*": ["./src/*"]
    }
  }
}
```

Para aplicar, deverá restarta o servidor que possa ler as novas configurações do babel.

# Aplicação

- Listas todos os membros de uma organização do github com um link para a página DETAIL.
- Para cada página alterar o title da página.
- Implementar o Google Analytics em todas as páginas.
- Importar uma imagem de background para a página HOME.
