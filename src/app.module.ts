import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { PROJECT_MODULES } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/core/auth/guards/auth.guard';

@Module({
  imports: [...PROJECT_MODULES],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
