import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"],
  });

  app.enableCors({ origin: true });

  app.setGlobalPrefix("v1", {
    exclude: [
      { path: "health/live", method: RequestMethod.GET },
      { path: "health/ready", method: RequestMethod.GET },
      { path: "docs", method: RequestMethod.GET },
      { path: "docs-json", method: RequestMethod.GET },
      { path: "openapi.json", method: RequestMethod.GET },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Blumbox Courier API")
    .setDescription(
      "API REST multi-tenant para tracking de envíos. Autenticación: `X-Api-Key` + `X-Tenant-Id`, o Bearer JWT desde `POST /v1/auth/token`."
    )
    .setVersion("1.0.0")
    .addApiKey({ type: "apiKey", name: "X-Api-Key", in: "header" })
    .addApiKey({ type: "apiKey", name: "X-Tenant-Id", in: "header" })
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document, {
    jsonDocumentUrl: "openapi.json",
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.warn(`Blumbox API listening on http://localhost:${port}`);
  console.warn(`OpenAPI: http://localhost:${port}/docs`);
}

bootstrap();
