import { createApp } from './app';
import { ENV } from './config/env';
import { LocalStorageService } from './services/storage.service';

const app = createApp();

// Inicializar almacenamiento y asegurar que los datos existan en disco
LocalStorageService.readStore();

app.listen(ENV.PORT, () => {
  console.log(`\n======================================================`);
  console.log(`✦ RITMO // SERVIDOR LOCAL BACKEND INICIADO`);
  console.log(`✦ URL API: http://localhost:${ENV.PORT}/api`);
  console.log(`✦ Almacenamiento en disco: ${ENV.DATA_FILE_PATH}`);
  console.log(`======================================================\n`);
});
