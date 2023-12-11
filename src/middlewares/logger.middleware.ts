import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('loggerMiddleware');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = new Date().getTime();

    this.logger.debug(
      `[API Request Info] ${method} ${originalUrl} - ${userAgent} ${ip}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const endTime = new Date().getTime();

      const logFormat = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`;

      this.setLogCreateMethodByStatusCode(statusCode, logFormat);
      this.logger.debug(`API RUNNING TIME: ${endTime - startTime}ms`);
    });

    next();
  }

  /**
   * @summary statusCode가 400번대 이상인 경우에는 Error, 아니면 Debug 결정해주는 함수
   * @author  Jason
   *
   * @param   { number } statusCode
   * @param   { string } format
   */
  setLogCreateMethodByStatusCode(statusCode: number, format: string): void {
    if (statusCode / 100 >= 4) {
      this.logger.error(format);
      return;
    }
    this.logger.debug(format);
  }
}
