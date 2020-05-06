# Arquitetura e DDD

- Separar pastas de aquivos no mesmo tipo de arquivos:
  - src
    - config
    - database
    - errors
    - middlewares
    - models
    - repositories
    - routes
    - services

Domínio: Qual a área de conhecimento daquele módulo/arquivo.

Nem sempre será possível manter essa arquitetura, logo será necessário separar arquivos pelos seus domínios.

## DDD: Domain Driven Design (metodologia, apenas no back-end)

## TDD: Test Driven Design (metodologia, front-end e back-end)

## Isolamento de responsabilidades:

- pastas:
  - modules: São arquivos/pastas que não independente em sua regra de negócio, ou seja, não depende de outros arquivos para "existir"
  - shared: Coisas que são compartilhadas em mais de um modulo.
    - infra: Todas as informações que são do projeto ou de libs.

### Personalizando as pastas

Adicionando essas configurações nas configurações do vs code:

```json
{
  "material-icon-theme.folders.associations": {
    "infra": "app",
    "entities": "class",
    "schemas": "class",
    "typeorm": "database",
    "repositories": "mappings",
    "http": "container",
    "migrations": "tools",
    "modules": "components",
    "implementations": "core",
    "dtos": "typescript",
    "fakes": "mock"
  },
  "material-icon-theme.files.associations": {
    "ormconfig.json": "database",
    "tsconfig.json": "tune"
  }
}
```

### Camada de Domínio

Armazena as regras de negócio

- Técnicas da aplicação.
- Envio de e-mails.

### Camada de Infra

São as ferramentas que escolhemos com a camada de domínio.

- Irá ficar a parte do banco de dados.
- Quais ferramentas estão sendo utilizadas nas técnicas da aplicação.
- Como será o envio de e-mails.

## Configurando imports

instalar `tsconfig-paths` (dev dependencies)

editar o arquivo `tsconfig.json` e `package.json`:

```json
{
  "baseUrl": "./src",
  "paths": {
    "@modules/*": ["modules/*"],
    "@config/*": ["config/*"],
    "@shared/*": ["shared/*"]
  }
}
```

```json
{
  "dev:server": "ts-node-dev -r tsconfig-paths/register --inspect --transpileOnly --ignore-watch node_modules ./src/shared/infra/http/server.ts"
}
```

`-r tsconfig-paths/register` irá converter todos os caminhos adicionados no tsconfig.json para que a aplicação entenda.

## Injeção de dependência

Isso fará não será mais necessário passar o objeto de repository para os services.

- Instalar `tsyringe`
- Criar um arquivo `shared/container/index.ts`:

  ```ts
  import { container } from "tsyring";

  import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
  import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";

  container.registerSingleton<IAppointmentsRepository>(
    "AppointmentsRepository",
    AppointmentsRepository
  );
  ```

  `registerSingleton` serve para que o `AppointmentsRepository` tenha uma única instância dessa classe, dessa forma, somente essa instância irá existir durante todo o clico de vida da aplicação.

- Modificando o service:

  ```ts
  import { injectable, inject } from "tsyring";

  @injectable() // Isso deve ser colocado para toda classe que tiver injeção de dependências.
  class CreateAppointmentService {
    constructor(
      @inject("AppointmentsRepository") // Id da injeção.
      private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({
      date,
      user_id,
      provider_id,
    }: IRequest): Promise<Appointment> {
      const appointmentDate = startOfDay(date);

      const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
        appointmentDate
      );

      if (findAppointmentInSameDate) {
        throw Error("Appointment not available");
      }

      const appointment = this.appointmentsRepository.create({
        date: appointmentDate,
        user_id,
        provider_id,
      });

      return appointment;
    }
  }
  ```

- Habilitando:

  - Importe arquivo `shared/container/index.ts` no arquivo server.ts:

  ```ts
  import "@shared/container";
  ```

  - Modificando no controller `const createSession = container.resolve(AuthenticateSessionService)`:

  ```ts
  import { Request, Response } from "express";

  import { container } from "tsyringe";

  import AuthenticateSessionService from "@modules/users/services/AuthenticateSessionService";

  class SessionController {
    public async create(req: Request, res: Response): Promise<Response> {
      const { email, password } = req.body;

      const createSession = container.resolve(AuthenticateSessionService);

      const { user, token } = await createSession.execute({ email, password });

      return res.status(201).json({ user, token });
    }
  }

  export default new SessionController();
  ```

# Testes e TDD

Teste automatizados, garante que nossa aplicação continue funcionando independente do número de modificações (novas funcionalidades e devs no time).

1. Testes unitários (TDD): Testam funcionalidades (principalmente das camadas bem isoladas de serviços) especificas da aplicação (Essas funções precisam ser funções puras).

   1.1 `Funções puras` são aquelas que não dependem de outra parte da aplicação, ou seja, não dependem de serviços externos.

   1.1.1 Elas jamais faram uma chamada à uma API externa, não existe efeito colateral.

2. Testes de integração : Testam uma funcionalidade completa, passando por várias camadas da aplicação.

   2.2 Exemplo: Fazer o teste na criação do usuário, logo faria todo o fluxo que poderia percorrer essa criação.

3. Testes E2E: São testes que simula a ação do usuário dentro da aplicação. Esse seria um teste mais voltado para a interface.

   2.2 Exemplo:

   1. Clique no input de email
   2. Preencha matheus_123@h.com
   3. Clique no input de senha
   4. Preencha 123456
   5. Clique no botão "Logar"
   6. Espero que a página tenha enviado o usuário para o dashboard

## TDD (Test Driven Development)

- Cria primeiro o teste.
- Fala como quer que a funcionalidade funcione.

### Como funciona

- Primeiro o teste irá falhar.
- Faça o teste passar.
- Refatore o código.

### Configurando o Jest

- Instalar `yarn add -D jest @types/jest`;
- Rode `yarn jest --init`;
  - Selecione `limpar o mock` para cada teste nas perguntas.

Escrever os testes em TS:

- Instalar `yarn add -D ts-jest`
- Modificando arquivo `jest.config.js`:

```js
module.exports = {
  preset: "ts-jest",
};
```

- Modificando arquivo `.eslintrc.json`:

```json
{
  "env": {
    "jest": true
  }
}
```

Caminho a onde o jest irá procurar pelos tests:

- Modificando arquivo `jest.config.js`:

```js
module.exports = {
  testMatch: ["**/*.spec.ts"],
};
```

Fazendo jest entender os talhos (`@`) dos imports:

- Modificando arquivo `jest.config.js`:

```js
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/",
  }),
};
```

Configurando Coverage:

- Modificando arquivo `jest.config.js`:

```js
module.exports = {
  collectCoverage: true,

  collectCoverageFrom: ["<rootDir>/src/modules/**/services/*.ts"],

  coverageDirectory: "coverage",

  coverageReporters: ["text-summary", "lcov"],
};
```
