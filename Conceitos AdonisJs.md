# Introdução

AdonisJs é um Framework.

- Quando utilizar:

  - Para aplicações grandes ou que tem potencial para crescer.
  - Aplicações monolíticas.

- Instalando a CLI:
  - `yarn global add @adonisjs/cli`
- Iniciando um projeto:
  - `adonis new appName --yarn --api-only`
  - `--yarn` instalar os pacotes via yarn.
  - `--api-only` instalar um projeto somente como uma api.
- Iniciando o servidor:
  - Entre na pasta do projeto e rode `adonis serve --dev`
    - `--dev` serve para ativara função do `nodemon`.

## Configurando ESLint para o AdonisJs

Dev Dependencies:

- `eslint`

Executar `yarn eslint --init`:

- `Use a popular style guide` -> Essa é a styles que o adonis usa.
- `Standard`
- `JSON`
- `N`

Copie as dependências que ele listou exceto `eslint` e instale via `yarn`.

- Editando arquivo `eslintrc.json`:

```json
{
  "globals": {
    "use": "true"
  }
}
```

## Configurando base de dados

Entre no arquivo `config/database.js` e escolha qual banco de dados usar e instale a dependência necessária.

Depois modifique o arquivo `.env` para fazer a conexão.

Feito isso rode as migrations: `adonis migration:run`

## Envio de Emails

- run `adonis install @adonisjs/mail`

Editar arquivo `start/app.js`:

```js
const providers = [
  "@adonisjs/mail/providers/MailProvider",
  "@adonisjs/framework/providers/ViewProvider",
];
```

Criar arquivo `resources/views/emails/template_name_email.edge`

exemplo de uso:

```js
const Mail = use("Mail");

class UserController {
  async store({ request }) {
    const data = request.only(["email", "username", "password"]);
    const user = await User.create(data);

    await Mail.send("emails.template_name_email", {}, (message) => {
      message
        .to(user.email)
        .from("<from-email>")
        .subject("Welcome to yardstick");
    });

    return "Registered successfully";
  }
}

module.exports = UserController;
```

- O segundo parâmetro `{}` do método `Mail.send` será usado para indicar quais variáveis serão usadas no template de email.

## Background jobs

### Configurando

- `yarn add adonis-kue`
- `adonis install @adonisjs/redis`
- registrar provider:

  - `"adonis-kue/providers/KueProvider"`
  - `"@adonisjs/redis/providers/RedisProvider"`

- registrar AceProvider: `adonis-kue/providers/CommandsProvider`
- Criar uma const `Jobs`:
  ```js
  const jobs = ["App/Jobs/NewTaskMail", "App/Jobs/ForgotPasswordMail"];
  ```
- Incluir `jobs` no export: `module.exports = { providers, aceProviders, aliases, commands, jobs }`

### Criando um job

- `adonis make:job JobName`

### Executando um job

```js
const Kue = use("Kue");
const Job = use("App/Jobs/JobName");

Kue.dispatch(Job.key, { DataForJob });
```

### Iniciar o serviço de jobs

- `adonis kue:listen`

## Tips

- Listar todas as rotas da aplicação: `adonis route:list`
- Execute `adonis make:model File -m -c`
  - `-m` Cria automaticamente a migration de `File`
  - `-c` Cria automaticamente o controller de `File`

## Monitorando falhas

Neste caso irei utilizar o [Sentry](https://sentry.io/welcome/)

## Transactions

Ela serve para criar um wrapper envolta de uma funcionalidade e se qualquer coisa falhar, ele reverte todas as ações realizadas.

Deve usar ela quando há mais de uma operação no banco de dados, em um mesmo método, e precisam que elas terminem para garantir sucesso.

- Exemplo:

  ```js
  const Database = use("Database");

  const User = use("App/models/User");

  class UserController {
    async store({ request }) {
      const data = request.only(["username", "email", "password"]);
      const addresses = request.input("addresses");

      const trx = await Database.beginTransaction();

      const user = await User.create(data, trx);

      await user.addresses().createMany(addresses, trx);

      await user.load("addresses");

      await trx.commit();

      return user;
    }
  }

  module.exports = UserController;
  ```
