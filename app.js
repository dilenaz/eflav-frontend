import { createServer } from 'node:http';
import next from 'next';

const portValue = process.env.PORT || '3000';
const numericPort = Number.parseInt(portValue, 10);
const isNamedPipe = Number.isNaN(numericPort);
const listenTarget = isNamedPipe ? portValue : numericPort;
const hostname = process.env.HOSTNAME || '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

try {
  await app.prepare();
  const server = createServer((request, response) => handle(request, response));
  const onListening = () => console.log(
    isNamedPipe
      ? 'Eflav uygulaması IIS bağlantısı üzerinden çalışıyor.'
      : `Eflav uygulaması ${hostname}:${listenTarget} adresinde çalışıyor.`
  );
  if (isNamedPipe) server.listen(listenTarget, onListening);
  else server.listen(listenTarget, hostname, onListening);

  const shutdown = (signal) => {
    console.log(`${signal} alındı; uygulama güvenli biçimde kapatılıyor.`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 30_000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
} catch (error) {
  console.error('Uygulama başlatılamadı:', error);
  process.exit(1);
}
