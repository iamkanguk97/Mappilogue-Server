import { isDefined } from 'src/helpers/common.helper';
import { Reflector } from '@nestjs/core';
import {
  CACHE_KEY_METADATA,
  CACHE_MANAGER,
  CACHE_TTL_METADATA,
  CacheInterceptor,
} from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { Cache } from 'cache-manager';
import { CustomCacheService } from 'src/modules/core/custom-cache/services/custom-cache.service';
import { Request } from 'express';
import { CACHE_PERSISTANT_TTL } from 'src/constants/constant';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  private readonly CACHE_EVICT_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE'];

  // 캐시를 하지 않을 API 경로 저장
  private readonly CACHE_EVICT_PATHS = [];

  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    @Inject('Reflector') protected readonly reflector: Reflector,
    private readonly customCacheService: CustomCacheService,
  ) {
    super(cacheManager, reflector);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const key = this.trackBy(context);
    const ttl =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ??
      CACHE_PERSISTANT_TTL;

    // if (!key) {
    //   return next.handle();
    // }

    const request = context.switchToHttp().getRequest<Request>();
    const userId = request['user']?.id;
    const keyPrefix = `[userId_${userId}]`;
    const method = request.method;

    // GET 요청 이외의 다른 요청인 경우에는 캐시 제거
    if (this.CACHE_EVICT_METHODS.includes(method)) {
      const cacheKey = key.includes('[userId_')
        ? `${keyPrefix}${request.url}`
        : key;

      return next
        .handle()
        .pipe(tap(() => this.customCacheService.delValue(cacheKey)));
    }

    try {
      const value = await this.customCacheService.getValue(key);
      if (isDefined(value)) {
        return of(value);
      }

      return next.handle().pipe(
        tap(async (response) => {
          await this.customCacheService.setValueWithTTL(key, response, ttl);
        }),
      );
    } catch {
      return next.handle();
    }
  }

  protected trackBy(context: ExecutionContext): string {
    /**
     * @comment cacheMetadata: Controller @CacheKey()로 등록한 key임.
     */

    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
    const cacheMetadata = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (!isHttpApp || isDefined(cacheMetadata)) {
      return cacheMetadata;
    }

    const request = context.getArgByIndex(0);
    const userId = request['user'].id;
    const keyPrefix = `[userId_${userId}]`;

    // if (!this.isRequestCacheable(context)) {
    //   return undefined;
    // }

    return `${keyPrefix}${httpAdapter.getRequestUrl(request)}`;
  }
}
