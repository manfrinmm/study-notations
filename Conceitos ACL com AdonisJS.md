## Introdução

- ACL, Access Control List. A onde os usuários passam a ter permissões e papeis no sistema.
- Com isso eles podem ter acesso ou não a determinadas funcionalidades.

- Iniciar o servidor em development mode: `adonis serve --dev`.

## Dependencies

- `adonis install adonis-acl` -> Este módulo permite trabalhar com ACL dentro do Adonis.

## Adicionando a configuração ao projeto:

- Editar o arquivo `start/app.js`:

```js
const providers = ["adonis-acl/providers/AclProvider"];
const aceProviders = ["adonis-acl/providers/CommandsProvider"];

const aliases = {
  Role: "Adonis/Acl/Role",
  Permission: "Adonis/Acl/Permission",
};
```

- providers: Isso serve para que possamos usar as funcionalidades de acl dentro do adonis.
- aceProviders: Adicionar os comandos de acl dentro das linhas de comandos do adonis.
- aliases: Simplificar a forma de referência os comandos.

- Editar o arquivo `start/kernel.js`:

```js
const globalMiddleware = ["Adonis/Acl/Init"];

const namedMiddleware = {
  is: "Adonis/Acl/Is",
  can: "Adonis/Acl/Can",
};
```

- globalMiddleware: Será um middleware que executará em todas as requisições.
- namedMiddleware: Nomear um middleware que executará em todas as requisições.
  - is: Trabalha com a ideia se é uma Role/Papel de um usuário.
  - can: Trabalha com a ideia de Permissão do usuário, se ele pode executar determinada ação.

## Adicionando Traits dentro de um Model:

Traits: São funcionalidades criadas no Modelo que servem para trabalhar em cima de um `model`.

```js
  static get traits(){
    return [
      "@provider:Adonis/Acl/HasRole",
      "@provider:Adonis/Acl/HasPermission",
    ]
  }
```

## Iniciando as migrations da ACL:

- `adonis acl:setup` -> Irá criar as migrations de um `model`.

Depois migrar elas para o banco de dados com:

- `adonis migration:run`

# Projeto

Um mini-blog

## Criando `CRUD` para as `Permissions`:

- `adonis make:controller Permission`

Editando o arquivo `app/Controllers/Http/PermissionController.js`:

```js
const Permission = use("Permission");

class PermissionController {
  async index() {
    const permissions = await Permission.all();

    return permissions;
  }

  async store({ request }) {
    const data = request.only(["name", "slug", "description"]);

    const permission = await Permission.create(data);

    return permission;
  }

  async update({ request, params }) {
    const data = request.only(["name", "slug", "description"]);

    const permission = await Permission.findOrFail(params.id);

    permission.merge(data);

    await permission.save();

    return permission;
  }

  async destroy({ params }) {
    const permission = await Permission.findOrFail(params.id);

    permission.delete();
  }
}

module.exports = PermissionController;
```

- `slug` -> Vai referenciar o nome da tabela que essa Permission será direcionada.

  Exemplo:

  ```json
  {
    "name": "Create post",
    "slug": "create_posts",
    "description": "Create post on blog"
  }
  ```

  ```json
  {
    "name": "Read post",
    "slug": "read_posts",
    "description": "Read post on blog"
  }
  ```

  ```json
  {
    "name": "Update post",
    "slug": "update_posts",
    "description": "Update post on blog"
  }
  ```

  ```json
  {
    "name": "Delete post",
    "slug": "delete_posts",
    "description": "Delete post on blog"
  }
  ```

Criando rotas:

```js
Route.resource("/permissions", "PermissionController")
  .apiOnly()
  .middleware("auth");
```

## Criando `CRUD` para as `Roles`:

- `adonis make:controller Role`.

Editando o arquivo `app/Controllers/Http/PermissionController.js`:

```js
const Role = use("Role");

class RoleController {
  async index() {
    // Irá carregar todas as `roles` e as `permissions` relacionadas à elas.
    const roles = await Role.query().with("permissions").fetch();

    return roles;
  }

  async show({ params }) {
    const role = await Role.findOrFail(params.id);

    await role.load("permissions");

    return role;
  }

  async store({ request }) {
    const { permissions, ...data } = request.only([
      "name",
      "slug",
      "description",
      "permissions",
    ]);

    const role = await Role.create(data);

    if (permissions) {
      // `role.permissions()` faz referência das `permissions` com as `roles`.
      // Dessa forma com o método attach, anexa todas as `permissions` passadas
      // pelo request.
      await role.permissions().attach(permissions);
    }

    // Caso exista `permissions` relacionadas a `role`, elas também serão carregas.
    await role.load("permissions");

    return role;
  }

  async update({ request, params }) {
    const { permissions, ...data } = request.only([
      "name",
      "slug",
      "description",
      "permissions",
    ]);

    const role = await Role.findOrFail(params.id);

    role.merge(data);

    await role.save();

    if (permissions) {
      // O método `sync` é a junção de `detach` com `attach`.
      await role.permissions().sync(permissions);

      // `detach` -> Remove as relações.
      // `attach` -> Adiciona as relações.
    }

    await role.load("permissions");

    return role;
  }

  async destroy({ params }) {
    const role = await Role.findOrFail(params.id);

    await role.delete();
  }
}
```

- As Roles podem ter permissions relacionadas à elas.
- Então um moderador pode ter as `permissions` (create posts,read posts). Para não precisar verificar todas as vezes que este usuário tem uma `role`, podemos simplesmente atribuir essas permissões à ele.

Exemplo de roles:

```json
{
  "name": "Administrator",
  "slug": "administrator",
  "description": "Administrator of blog"
}
```

```json
{
  "name": "Moderator",
  "slug": "moderator",
  "description": "Moderator of blog",
  "permissions": [1, 2, 3, 4]
}
```

```json
{
  "name": "Update post",
  "slug": "update_posts",
  "description": "Update post on blog"
}
```

```json
{
  "name": "Delete post",
  "slug": "delete_posts",
  "description": "Delete post on blog"
}
```

Criando rotas:

```js
Route.resource("/roles", "RolesController").apiOnly().middleware("auth");
```

## Ajustando controller de `User` para poder aceitar as `Roles` e `Permissions`:

alterando o arquivo de `UserController`:

```js
class UserController {
  async store({ request }) {
    const { permissions, roles, ...data } = request.only([
      "username",
      "email",
      "password",
      "permissions",
      "role",
    ]);

    const user = await User.create(data);

    if (roles) {
      // Este relacionamento existe pelo fato de ter configurado o `trait` anteriormente no modulo.
      await user.roles().attach(roles);
    }

    if (permissions) {
      await user.permissions().attach(permissions);
    }

    await user.loadMany(["roles", "permissions"]);

    return user;
  }

  async update({ request, params }) {
    const { permissions, roles, ...data } = request.only([
      "username",
      "email",
      "password",
      "permissions",
      "role",
    ]);

    const user = await User.findOfFail(params.id);

    user.merge(data);

    await user.save();

    if (roles) {
      // Este relacionamento existe pelo fato de ter configurado o `trait` anteriormente no modulo.
      await user.roles().sync(roles);
    }

    if (permissions) {
      await user.permissions().sync(permissions);
    }

    await user.loadMany(["roles", "permissions"]);

    return user;
  }
}
```

## Validando as rotas de acordo com as `Roles` e `Permissions`:

Modificando o arquivo de `routes.js`:

```js
routes
  .resource("/posts", "PostController")
  .apiOnly()
  .except(["index", "show"])
  .middleware(["auth", "is:(administrator || moderator)"]);
```

O middleware `is` irá verificar em todas as rotas se o usuário que está acessando esta rota possui a `role` de `administrator` ou `moderator`.

Já o método `except` não irá incluir os métodos que forem passados à ele nos resources da rota. Dessa forma para um usuário que não tem essas permissões poderem acessar essas rotas, será necessário:

```js
routes
  .get("/posts", "PostController.index")
  .middleware(["auth", "can:read_posts"]);

routes
  .get("/posts/:id", "PostController.show")
  .middleware(["auth", "can:read_posts"]);
```

O middleware `can` irá verificar se o usuário que está acessando esta rota possui o a `permission` de `read_posts`.

## Usando o ACL inline no Controller:

- Criar a permission de `Read private post`.

- Modificando o arquivo de `routes.js`:

  ```js
  routes
    .get("/posts", "PostController.index")
    .middleware(["auth", "can:(read_posts || read_private_posts)"]);

  routes
    .get("/posts/:id", "PostController.show")
    .middleware(["auth", "can:(read_posts || read_private_posts)"]);
  ```

Isso irá falar que o usuário poderá ver posts públicos e privados.

- Modificando o `PostController.js`:

  ```js
  class PostController {
    async index({ request, auth }) {
      const user = await auth.getUser();

      if (await user.can("read_private_posts")) {
        const posts = await Post.all();

        return posts;
      }

      const posts = await Post.query().where({ type: "public" }).fetch();

      return posts;
    }

    async show({ response, params, auth }) {
      const post = await Post.findOrFail(params.id);

      if (post.type === "public") {
        return post;
      }

      const user = await auth.getUser();

      if (await user.can("read_private_posts")) {
        return post;
      }

      return response.status(403).send({
        error: {
          message: "Você não tem permissão de leitura.",
        },
      });
    }
  }
  ```
