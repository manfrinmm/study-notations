## Conceitos NodeJs

- Plataforma que permite usar Javascript fora do navegador.

NPM e YARN

- Permite a instalação de libs de terceiros.

Características

- Arquitetura Event-loop:
  - Baseada em eventos.
  - Call Stack.
- Node single-thread:
  - ou seja, executa apenas em uma thread do processador.
- Non-blocking I/O:
  - Permite a comunicação em tempo real entre cliente e servidor.

Frameworks

- ExpressJs como base:
  - Sem opinião, pode criar a estrutura do código da maneira que quiser.
  - Micro-serviços.
- AdonisJs.
- NestJs.

## Conceitos API REST

Benefícios

- Múltiplos clientes ligado ao mesmo back-end.
- Protocolo de comunicação padronizado.

Rotas:

- Route params não tem nome;
- Query params tem nome, sendo identificado pelo prefixo `?`;

Headers:

- Não tem a ver com o conteúdo da requisição.
- Pode ser usado para autenticação e/ou qualquer informação adicional.

HTTP codes:

- 1xx: Informational
- 2xx: Success
  - 200: Success
  - 201: CREATED
- 3xx: Redirection
  - 301: MOVED PERMANENTLY
  - 302: MOVED
- 4xx: Client Error
  - 400: BAD REQUEST
    - Faltou alguma informação.
  - 401: UNAUTHORIZED
    - Faltou ter permissão.
  - 404: NOT FOUND
- 5xx: Server Error
  - 500: INTERNAL SERVER ERROR
    - o client mandou as informações, mas o back-end não conseguiu processar

## Aplicação

HTTP methods

`GET` Buscar informações do back-end.
`POST` Criar uma informações do back-end.
`PUT/PATCH` Alterar informações do back-end.
`PATCH` Alterar uma única informação no back-end.
`DELETE` Deletar uma informação do back-end.

Tipos de parâmetros

`Query Params (?NOME=VALOR)` Principalmente -> Filtros e paginação.
`Route Params(:NOME)` Identificar recursos (Atualizar/Deletar).
`Request body` Corpo da requisição, geralmente em JSON. Mas para receber o
formato JSON precisa fazer o express "aceitar", basta colocar no código antes das rotas:

```js
app.use(express.json());
```

Middlewares

Todo middleware é bom ter um return, pois qualquer código depois dele (No mesmo bloco) será executado.
