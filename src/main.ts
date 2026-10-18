import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(3055, '127.0.0.1');

  console.log('WS_REPRO_READY ws://127.0.0.1:3055/ws');
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
