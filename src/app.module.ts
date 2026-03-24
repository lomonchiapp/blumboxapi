import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
import { EventEmitterModule } from "@nestjs/event-emitter";
import configuration from "./config/configuration";
import { envValidationSchema } from "./config/env.validation";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ShipmentsModule } from "./shipments/shipments.module";
import { BranchesModule } from "./branches/branches.module";
import { CustomersModule } from "./customers/customers.module";
import { HealthModule } from "./health/health.module";
import { PreAlertsModule } from "./pre-alerts/pre-alerts.module";
import { ReceptionsModule } from "./receptions/receptions.module";
import { CalculatorModule } from "./calculator/calculator.module";
import { RateTablesModule } from "./rate-tables/rate-tables.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { AuditModule } from "./common/audit/audit.module";
import { ProblemJsonExceptionFilter } from "./common/filters/problem-json.filter";
import { RequestLoggerMiddleware } from "./common/middleware/request-logger.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuditModule,
    AuthModule,
    ShipmentsModule,
    BranchesModule,
    CustomersModule,
    PreAlertsModule,
    ReceptionsModule,
    CalculatorModule,
    RateTablesModule,
    NotificationsModule,
    HealthModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: ProblemJsonExceptionFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .exclude("health/(.*)")
      .forRoutes("*");
  }
}
