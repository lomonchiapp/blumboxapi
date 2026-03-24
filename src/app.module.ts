import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import configuration from "./config/configuration";
import { envValidationSchema } from "./config/env.validation";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ShipmentsModule } from "./shipments/shipments.module";
import { HealthModule } from "./health/health.module";
import { ProblemJsonExceptionFilter } from "./common/filters/problem-json.filter";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    PrismaModule,
    AuthModule,
    ShipmentsModule,
    HealthModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: ProblemJsonExceptionFilter }],
})
export class AppModule {}
