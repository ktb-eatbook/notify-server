import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { IPGuard } from './guard';

import * as dotenv from "dotenv"
dotenv.config()

const logger: Logger = new Logger("Bootstrap")

const port = parseInt(process.env.SERVER_PORT ?? "3000")

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions : CorsOptions = {
    origin: ["http://localhost:5173","https://ktb-book-keeper.netlify.app"],
    methods: ["POST", "OPTIONS"],
    credentials: false,
    allowedHeaders: ["Authorization", "Content-Type"]
  }

  app.enableCors(corsOptions)

  app.useGlobalGuards(new IPGuard())

  await app.listen(port)
  .then(_=> {
    logger.log(`Listen server from port: ${port}`)
  })
  .catch(e => {
    logger.error(`Server do not listen\nReason: ${e}`)
  })
}
bootstrap();
