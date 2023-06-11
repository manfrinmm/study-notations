// Importar bibliotecas necessárias
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configurar as credenciais da conta de serviço
const credentials = require("./caminho/para/credenciais.json");

// Configurar o cliente OAuth2
const client = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ["https://www.googleapis.com/auth/drive"],
);

// Definir os detalhes do backup
const database = "myDatabase"; // Nome do banco de dados PostgreSQL
const userDb = "userDb"; // Usuário do banco de dados PostgreSQL
const containerName = "containerName"; // Nome do container que está o banco de dados PostgreSQL
const backupFolderId = "seu_folder_id"; // ID da pasta no Google Drive onde os backups serão armazenados
const localBackupFolder = "backup"; // Caminho para a pasta local onde os backups serão armazenados
const maxBackupFiles = 7; // Número máximo de arquivos de backup a serem mantidos

// Criar a pasta local para armazenar os backups, se não existir
if (!fs.existsSync(localBackupFolder)) {
  fs.mkdirSync(localBackupFolder);
}

// Executar o pg_dump para criar o backup
const backupFile = `bkp_${new Date().toJSON()}.sql.gz`;
const backupFilePath = path.join(localBackupFolder, backupFile);
execSync(
  `docker exec ${containerName} pg_dump -U ${userDb} ${database} | gzip >  ${backupFilePath}`,
);

// Enviar o arquivo de backup para o Google Drive
const drive = google.drive({ version: "v3", auth: client });
drive.files.create(
  {
    resource: {
      name: backupFile,
      parents: [backupFolderId],
    },
    media: {
      body: fs.createReadStream(backupFilePath),
    },
  },
  (err, res) => {
    if (err) {
      console.error("Erro ao enviar o backup para o Google Drive:", err);
    } else {
      console.log("Backup enviado com sucesso para o Google Drive.");
      // Excluir arquivos mais antigos que maxBackupFiles da pasta local
      const filesToDeleteLocal = fs
        .readdirSync(localBackupFolder)
        .sort()
        .slice(0, -maxBackupFiles);
      filesToDeleteLocal.forEach((file) => {
        const filePath = path.join(localBackupFolder, file);
        fs.unlinkSync(filePath);
        console.log(`Arquivo ${file} excluído da pasta local.`);
      });

      // Listar arquivos no Google Drive
      drive.files.list(
        {
          q: `'${backupFolderId}' in parents`,
          fields: "files(id, name, modifiedTime)",
        },
        (err, res) => {
          if (err) {
            console.error("Erro ao listar arquivos no Google Drive:", err);
          } else {
            const files = res.data.files;
            if (files.length > maxBackupFiles) {
              // Ordenar arquivos por data de modificação
              files.sort((a, b) =>
                a.modifiedTime.localeCompare(b.modifiedTime),
              );
              const filesToDeleteDrive = files.slice(
                0,
                files.length - maxBackupFiles,
              );
              filesToDeleteDrive.forEach((file) => {
                drive.files.delete(
                  {
                    fileId: file.id,
                  },
                  (err, res) => {
                    if (err) {
                      console.error(
                        `Erro ao excluir arquivo ${file.name} do Google Drive:`,
                        err,
                      );
                    } else {
                      console.log(
                        `Arquivo ${file.name} excluído do Google Drive.`,
                      );
                    }
                  },
                );
              });
            }
          }
        },
      );
    }
  },
);
