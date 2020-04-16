# Aplicação

## Parte 1

### Três maneiras de lidar com banco de dados.

- Driver nativo do banco de dados.
- Query builder (Knex).
- ORM (Object Relational Mapping; sequelize (usado para JS) e typeORM (usado para TS)).

### Instalando as dependências

- `typeorm`
- `reflect-metadata` -> É necessário quando se usa a sintaxe de `decorators`. E para "ativar", basta importar essa lib no arquivo `server.ts` da aplicação.
- `pg` -> Driver do postgreSQL.

### Docker

Controle de serviço externo da aplicação

Manter um ambiente isolado.

- `dockerfile`

  - É a receita para gente montar nossa própria imagem.

  Formato:

  ```docker file
    # Partimos de uma imagem existente
    from node:10

    # Definimos a pasta e copiamos os arquivos
    WORKDIR /usr/app
    COPY . ./

    # Instalamos as dependências
    RUN yarn

    # Qual posta queremos expor?
    EXPOSE 3333

    # Executados nossa aplicação
    CMD yarn start
  ```

Criando a instância de um postgreSQL :
`docker run --name container_name -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`

### Configurando o TypeORM

- Criar o arquivo (`ormconfig.json`) na pasta raiz do projeto para a configuração.

  - Configuração da base de dados:

    ```json
    {
      "type": "postgres",
      "host": "192.168.0.100",
      "port": 5432,
      "username": "docker",
      "password": "docker",
      "database": "gobarber",
      "entities": ["./src/app/models/*.ts"],
      "migration": ["./src/database/migrations/*.ts"],
      "cli": {
        "migrationDir": "./src/database/migrations"
      }
    }
    ```

### Criando a conexão com o banco de dados

- Criar arquivo (`src/database/index.ts`):

  ```ts
  import { createConnection } from "typeorm";

  createConnection(); // Essa função automaticamente irá procurar um arquivo "ormconfig.json" e irá carregar todas as informações necessárias da base de dados.
  ```

  basta importar esse arquivo no `server.ts` da aplicação.

### Criando uma migration

Elas servem para controlar as versões das tabelas dentro do banco de dados.

Ela contém os arquivos de criação/alteração.

**IMPORTANTE**, só é possível alterar uma migration de forma direta, caso ela não tenha sido enviada para outros devs ou para o ambiente de produção.
Caso precise alterar, é necessário criar uma nova migration com as alterações desejadas.

**IMPORTANTE**, Toda migration em seu método `down` deve fazer o inverso do método `up` na ordem inversa.

**Exemplo:**

```ts
export default class NomeDaMigration implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("table_names", "provider");

    await queryRunner.addColumn(
      "table_names",
      new TableColumn({
        name: "name",
        type: "varchar",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("table_names", "name");

    await queryRunner.addColumn(
      "table_names",
      new TableColumn({
        name: "provider",
        type: "varchar",
      })
    );
  }
}
```

Adicionar um `script` no `package.json` para que todo comando feito pela cli do `typeorm` seja feito com TS

```json
{
  "typeorm": "ts-node-dev ./node_modules/typeorm/cli.js"
}
```

- `yarn typeorm migration:create -n NomeDaMigration` -> cria uma nova migration com o nome `NomeDaMigration`.
- `yarn typeorm migration:run` -> Roda as migrations pendentes.
- `yarn typeorm migration:revert` -> Desfazer a ultima migration.

Alterar a `rule` do eslint de ser obrigatório o uso de `this` dentro de uma classe:

```json
{ "class-methods-use-this": "off" }
```

Exemplo de arquivo da migration:

```TS
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export default class NomeDaMigration implements MigrationInterface{
    public async up(queryRunner: QueryRunner):Promise <void>{
      await queryRunner.createTable(
        new Table({
            name: "table_names", // O nome sempre deve ser no plural.
            columns:[
             {
                name: "id",
                type: "varchar",
                isPrimary: true,
                generationStrategy: "uuid",
                default: "uuid_generate_v4()" // Essa função é executada pelo próprio postgreSQL.
             },
             {
                name: "name",
                type: "varchar",
                isNullable: false
             },
             {
                name: "email",
                type: "varchar",
                isNullable: false
             },
             {
                name: "date",
                type: "timestamp with time zone", // salva a data e informa qual o timezone
                isNullable: false
             }
            ]
        })
      )
    }

    public async down(queryRunner:QueryRunner):Promise <void>{
      await queryRunner.dropTable("table_names");
    }
  }

```

### Relacionar um model com uma tabela do banco de dados

Habilitar o uso de `decorators`. Alterar o arquivo `tsconfig.json`:

    "experimentDecorators": true,
    "emitDecoratorMetadata": true

Desabilitar a inicialização de propriedades em uma classe. Alterar o arquivo `tsconfig.json`:

      "strictPropertyInitialization": false

`Entity("table_names")` indica que todas as vezes que esse model for salvo, ele será salvo também dentro da tabela "table_names". Essa função deve estar logo acima da classe, ou seja, sem espaço entre elas.

Agora devemos falar qual propriedade é a chave primária com `PrimaryGeneratedColumn("type")`.

Agora devemos indicar quais dados deverão ser salvos na tabela com a propriedade `Column("type")`. Por padrão o `type` é `varchar`.

```ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("table_names")
class ClassName {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @column("timestamp with time zone")
  date: Date;

  /**
   * Pelo fato de estar usando o typeORM, não é mais necessário uma classe do model ter o método constructor, pois agora para instânciar um objeto, será usado uma outra função, que será implementada dentro dos repositories.
   */
}
```

### Criando um `repository`

Cria-se um `repository` somente quando se tem um método personalizado para uma Entidade.
Caso não tenha, basta importar do `typeorm` o método `getRepository()`;

```ts
import ModelName from "./path/to/model/ModelName";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ModelName)
class ModelNamesRepository extends Repository<ModelName> {
  public async findByDate(date: Date): Promise<ModelName | null> {
    const findModelName = await this.findOne({
      where: { date },
    });

    return findModelName || null;
  }
}

export default ModelNamesRepository;
```

### Criando um `service`

```ts
import { getCustomRepository } from "typeorm";

import ModelName from "./path/to/model/ModelName";
import ModelNamesRepository from "./path/to/repositories/ModelNamesRepository";

interface Request {
  date: Date;
}

class CreateModelNameService {
  public async execute({ date }: Request): Promise<ModelName> {
    const modelNamesRepository = getCustomRepository(ModelNamesRepository);

    const findModelNameInSameDate = await modelNamesRepository.findByDate(date);

    const modelName = modelNamesRepository.create(date);

    await modelNamesRepository.save(modelName);

    return modelName;
  }
}

export default CreateModelNameService;
```

## Parte 2

### Criando model de usuário

- Dados ("users")
  - id: uuid
  - name: varchar
  - email: varchar; isUnique: true
  - password_hash: varchar
  - avatar: varchar; isNullable: true
  - created_at: timestamp; default: "now()"
  - updated_at: timestamp; default: "now()"

Dentro do model, o typeorm importa os decorators `CreateDateColumn()` e `UpdateDateColumn()`.

**### Criando relacionamento entre models (PRECISA VERIFICAR MELHOR QUAIS O MELHORES MÉTODOS)**

- Definindo `foreignKey`:

  ```ts
  await queryRunner.createForeignKeys(
    "table_names",
    new TableForeignKey({
      columnNames: ["user_id", "provider_id"],
      referencedTableName: "users",
      referencedColumnNames: ["id"],
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    })
  );
  ```

Propriedades para `onDelete` e `onUpdate`:

- `SET NULL` -> Ao ser deletado, coloque null como valor;
- `CASCADE` -> Ao ser atualizado/deletado, coloque o valor atualizado/(delete a linha inteira);
- `RESTRICT` -> vai bloquear a operação e não deixar o dado ser deletado ou atualizado;

- Definindo `Relação` no model:

```ts
@ManyToOne(()=>ModelName)
@JoinColumn({name:"provider_id"}) // Especifica qual coluna está relacionado com `provider`
provider: ModelName
```

### Criptografando a password user

Dependências

- `bcryptjs`
- `@types/bcryptjs` (Dev dependencies)

```ts
import { hash, compare } from "bcryptjs";

// Cria o hash da senha
const password_hash = await hash(password, 8);

// Compara a criptografia de senha
const password_compare = await compare(password, password_hash);
```

### Autenticação

Dependências

- `jsonwebtoken`;
- `@types/jsonwebtoken` (Dev dependencies);

- Criando um token:
  `SECRET_KEY`: Pode ser obtida uma string aleatória neste [link](http://www.md5.cz)

```ts
import { sign } from "jsonwebtoken";

const token = sign({}, "SECRET_KEY", {
  subject: user.id,
  expiresIn: "7d",
});
```

- Verificando um token:

```ts
import { verify } from "jsonwebtoken";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

const decoded = verify(token, "SECRET_KEY");

const {} = decoded as TokenPayload; // Se faz essa referência para forçar que todo dado que for obtido através da desestruturação do `decoded`, seja um valor de tipo válido para o TS.
```

Colocar um middleware (`ensureAuthenticated.ts`) em todas as rotas que necessitam de autenticação:

```ts
import ensureAuthenticated from "./path/to/middlewares/ensureAuthenticated";

usersRouter.use(ensureAuthenticated);
```

### Sobrescrever tipos de uma biblioteca

- Criar um aqui em `@types/nome_lib.d.ts`

```ts
declare namespace Express {
  // Tudo que estiver entre essas chaves será anexado à lib do express
  export interface Request {
    user: {
      id: string;
    };
  }
}
```

### Envio de arquivos

Dependências

- `multer`
- `@types/multer` (Dev Dependencies)

Configurando `multer`:

```ts
import crypto from "crypto";
import multer from "multer";

export default {
  storage: multer.diskStorage({
    destination:, // Pasta a onde os arquivos serão armazenados. Use o `path` para informar.
    // Qual é o nome que o arquivo vai receber. Por padrão o nome que ele é recebe é o próprio nome do arquivo. Devemos modificar para não sobrescrever outros arquivos.
    filename (req,file,cb){
      const fileHash  = crypto.randomBytes(10).toString("HEX");
      const fileName = `${fileHash}-${file.originalname}`;

      return cb(null,fileName);
    },
  })
}
```

Para ativar, basta importar esse arquivo de configuração e passar como parâmetro para o multer.

A instância do multer existem 5 métodos:

- `any` -> Permite enviar tanto um único arquivo quanto várias, ou seja, `array` ou `single`.
- `array` -> Permite enviar vários arquivos.
- `fields` -> --
- `none` -> Não permite enviar arquivos.
- `single` -> Permite enviar um único arquivo.

Feito isso, basta acrescentar a instância do multer na rota como um middleware.

```ts
upload.single("nome_do_campo_que_terá_a_imagem");
```

### Atribuir avatar para usuário

- Criar um service `UpdateUserAvatarService`:

  - Recebe `user_id` e `avatarFilename -> req.file.filename`.
  - Verificar se o `user_id` é de um usuário válido.
  - Caso o usuário tenha um avatar anterior. Delete o avatar anterior.

  ```ts
  import path from "path";
  import fs from "fs";

  if (user.avatar) {
    const userAvatarFilePath = path.join(
      path.resolve(__dirname, "path", "to", "file", "tmp"),
      user.avatar
    );

    const userAvatarFileExists = await js.promises.stat(userAvatarFilePath); // Verifica o estado do arquivo, caso ele exista.
    if (userAvatarFileExists) {
      await js.promises.unlink(userAvatarFilePath);
    }
  }

  user.avatar = avatarFilename;

  await usersRepository.save(user);
  ```

### Mostrando avatar do usuário

```ts
app.use("/files",express.static(path.resolve("path","to","tmp"))
```

### Tratativa de erros dentro da aplicação

- Criar nossa própria classe de erro.
- Criar arquivo `errors/AppError.ts`:

  ```ts
  class AppError {
    public readonly message: string;

    public readonly statusCode: number;

    constructor(message:string,statusCode = 400){
      this.message = message;
      this.statusCode = statusCode
    }

    export default AppError

  ```

### Tratativa de erro global

É um middleware que vai todos os erros dentro da aplicação (Services, Routes, Models, etc...)

Este middleware deve ser colocado depois que as rotas foram declaras:

```ts
import AppError from "./path/to/erros/AppError";
app.use(routes);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    // Se for, é um erro originado pela aplicação.
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});
```

Alterar o eslint rules

```json
{
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      "argsIgnorePattern": "_"
    }
  ]
}
```

Feito isso é necessário instalar uma lib (`express-async-errors`) para que o express capture os erros gerados, pois o uso de `async` não permite isso.

Depois basta importar essa lib após o express

```ts
import express from "express";
import "express-async-errors";
```

### Envio de email
