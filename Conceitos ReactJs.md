## Programação declarativa

Declara qual resultado é espera, ou seja, não é especifica para o browser como
exibir algum elemento, mas sim qual é sua condição de existência.

## Babel / Webpack

O browser não entende todo código JSX.

- O Babel converte (transpilar) o código JS (React) de uma forma que o browser entenda.
- Webpack
  - Criação do bundle, arquivo com todo código da aplicação.
  - Converte o código JSX de uma forma que o browser entenda.
  - Para cada tipo de arquivo precisa de uma maneira diferente de conversão.
  - Loaders:
    - babel-loader -> necessário para converter arquivos js para que o browser entenda.
    - style-loader -> necessário para inserir o style dentro do JSX.
    - css-loader -> necessário para converter arquivos css para que o browser entenda.
    - file-loader -> necessário para converter arquivos files para que o browser entenda.
    - image-loader -> necessário para converter arquivos files para que o browser entenda.

## Aplicação

### Dependências de libs bases

- @babel/core
- @babel/preset-env
- @babel/preset-react
- @babel/cli
- @babel/plugin-transform-runtime -> Permite a utilização de funções ASYNC AWAIT, pode ser instalado como dev dependencies
- babel-loader
- style-loader
- css-loader
- webpack
- webpack-cli
- webpack-dev-server -> (Ouvir alterações nos arquivos e gerar um novo bundle), pode ser instalado como uma dependência de desenvolvimento.

### Dependências de arquivos bases

- `babel.config.js` armazena as configurações relacionadas ao babel, a maneira como o código js é convertido para um código que o browser entenda.
  - `presets` conjunto de configurações criados por terceiros.
    - `@babel/preset-env` vai converter um código mais recente para um mais antigo (que os browsers entendam) com base no ambiente da aplicação.
    - `@babel/preset-react` converter o JSX para uma maneira que o browser entenda.
- `webpack.config.js` armazena as configurações relacionadas ao webpack e os loaders
  - `entry` arquivo de entrada, ou seja, primeiro arquivo carregado pela aplicação.
  - `output` arquivo de saída, ou seja, a onde será o arquivo armazenado dps da transpilação.
    - `path` caminho até a pasta.
    - `filename` nome do arquivo (bundle.js).
  - `devServer`
    - `contentBase` caminho a onde contém os arquivos públicos da aplicação.
  - `module`
    - `rules` armazena um loader para cada tipo de arquivo.
      - `test` qual o tipo de arquivo deve procurar, no caso para pegar todos .js (/\.js\$/).
      - `exclude` quais arquivos devem ser ignorado, no caso node_modules (/node_modules/).
      - `use` qual loader será usado.
        - `loader` nome do loader

Comandos

Gerar os arquivos transpilados: `webpack --mode development`

Liga o servidor para escutar alterações nos arquivos js: `webpack-dev-server --mode development`

### Componentização

JSX: HTML dentro do Javascript
Todo arquivo que tenha um componente deve começar com letra maiúscula.

Fragment `<> </>` -> faz com que mais de dois elementos em um componente se torne um só sem alterar a dom com uma `div`

- Componente
  - Qualquer bloco de código que é independente e pode ser reutilizado em várias partes da aplicação.
- Propriedade
  - Qualquer atributo passado para o componente, pode ser acessado através das `props` do parâmetro do componente.
  - Caso o componente tem algum conteúdo dentro de sua tag, essa propriedade passa a se chamar `children`.
- Estado e Imutabilidade
  - Estado.
    - Sempre que ele é alterado o componente é renderizado novamente com a atualização do estado.
  - Imutabilidade
    - Não é possível alterar um estado da variável ou acessar ela de forma direta.
    - Para poder alterar, é necessário criar um novo estado e atribuir ele ao estado anterior.
