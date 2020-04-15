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
