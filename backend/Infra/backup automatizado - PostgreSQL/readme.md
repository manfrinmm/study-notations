## Backups automáticos do PostgreSQL - Docker

O script `backup_postgresql_to_drive.js` localizado nesta pasta, contém a implementação dessa funcionalidade.

Essa implementação possui as seguintes funcionalidades:

- Definição da pasta local para armazenar os backups;
- Geração do nome do arquivo de backup (com base na hora local gerada);
- Exclusão de arquivos antigos tanto local quanto remoto;

Os arquivos são enviados **remotamente** para uma conta do **Google Drive**.

## Configurando API Google Drive

Crie uma conta de serviço e faça o download do arquivo JSON contendo as credenciais da conta de serviço.

Basta acessar [esse tutorial](https://www.labnol.org/google-api-service-account-220404) para mais informações.

## Como executar o script

- Certifique-se de ter o Node.js instalado em seu sistema.
- Crie uma nova pasta em seu sistema onde você deseja armazenar o script de backup.
- Abra um editor de texto e copie o código do script fornecido anteriormente para um novo arquivo. Salve o arquivo com a extensão ".js" (por exemplo, backup_postgresql.js) dentro da pasta que você criou.
- No terminal, navegue até a pasta onde você salvou o arquivo do script.
  - Execute o seguinte comando para instalar as dependências necessárias (googleapis):
    - `npm install googleapis`
- Certifique-se de ter as credenciais da conta de serviço do Google Cloud (arquivo JSON) e coloque-o na mesma pasta do script de backup. Certifique-se de que o caminho para o arquivo de credenciais está correto no código do script.
- Abra o arquivo do script em um editor de texto e atualize as configurações conforme suas necessidades, como o nome do banco de dados PostgreSQL, ID da pasta no Google Drive, caminho da pasta local etc.
- Salve as alterações no arquivo do script.
- No terminal, execute o seguinte comando para iniciar o backup:
  - `node backup_postgresql.js`
- Isso executará o script e iniciará o backup do banco de dados PostgreSQL, enviando-o para o destino configurado (Google Drive, no caso do exemplo).

## Como configurar o crontab

- Digite `crontab -e` no terminal e aperte enter
- Adicione o seguinte comando na ultima linha:
  - `0 0 * * * node ~/caminho_ate_o_script`
