import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

export function createApp() {
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging básico de peticiones en consola
  app.use((req, _res, next) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[API ${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    }
    next();
  });

  // Montar prefijo de API
  app.use('/api', routes);

  // Manejo de errores global
  app.use(errorHandler);

  return app;
}
