import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MESSAGE_RESPONSE } from 'src/decorators/message-response.decorator';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  author: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        author: 'Dodoon | website: not yet | Best health and beauty products',
        statusCode: context.switchToHttp().getResponse().statusCode,
        message:
          this.reflector.get<string>(MESSAGE_RESPONSE, context.getHandler()) ||
          '',
        data: data,
      })),
    );
  }
}
