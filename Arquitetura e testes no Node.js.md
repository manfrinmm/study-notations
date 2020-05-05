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
