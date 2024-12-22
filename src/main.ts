import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import { AppModule } from './app.module';

import * as dotenv from "dotenv"
import { Logger } from '@nestjs/common';
dotenv.config()

const logger: Logger = new Logger("Bootstrap")

const port = parseInt(process.env.SERVER_PORT ?? "3000")

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions : CorsOptions = {
    origin: "http://localhost:3000",
    methods: ["POST", "OPTIONS"],
    credentials: false,
    allowedHeaders: ["Authorization", "Content-Type"]
  }

  app.enableCors(corsOptions)

  await app.listen(port)
  .then(_=> {
    logger.log(`Listen server from port: ${port}`)
  })
  .catch(e => {
    logger.error(`Server do not listen\nReason: ${e}`)
  })
}
bootstrap();
