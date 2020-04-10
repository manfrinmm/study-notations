## o que é TypeScript

- É uma linguagem baseada em JS.
- Adiciona tipagem.
- Acessar as features mais recentes do JS.
- Funciona também como um babel.
- Não é fortemente tipado.

## Pq TypeScript?

- auxilia no IntelliSense do editor.

## Mitos e verdades

- TypeScript diminui produtivo: No começo é verdade, pois não está acostumado.
- TypeScript é transformar JavaScript em Java ou C#: Mito.
- O mercado não usa TypeScript: Mito.
- O TypeScript substitui o JavaScript por completo: Mito, pois TS apenas adiciona uma sintaxe.

## Pq é necessário adicionar tipagem?

- Para saber qual a estrutura de um dado ou função.

## Como criar a própria tipagem

- Criar uma pasta `services` -> conjunto isolado de funções que executam alguma regra de negócio e retornam algum resultado.
- Dentro dela criar um arquivo com o nome da funcionalidade:
  - `/NomeDaFuncionalidade.ts` Cada funcionalidade deve retornar uma única função.

## Quando adicionar tipagem?

- Adicionar quando está trabalhando com funções de uma lib em outro arquivo, ou seja, usar funções de uma lib fora do contexto a onde foi declarada, pois o IntelliSense não irá compreender que a função usada é para fazer a referência a lib em questão.

- O editor também irá avisar quando será preciso adicionar uma tipagem, pois o tipo `any` não é bom.

# Aplicação

## Para que serve a `interface`

- Define o tipo do objeto recebido por parâmetro.

## Libs de dependência base

- typescript -> pode ser instalada como dev dependencies

## Arquivos de configuração base

- `tsconfig.json` -> configurações do ts

comandos

`tsc path` -> `path` é o caminho para onde estar o arquivo de inicialização. Esse comando faz a transpilação do TS para JS

`tsc --init` -> Cria o arquivo de configuração base o TS.

`tsc` -> Vai automaticamente encontrar um arquivo index.ts e transpilar para JS. PRECISA TER O ARQUIVO `tsconfig.json` configurado anteriormente.
