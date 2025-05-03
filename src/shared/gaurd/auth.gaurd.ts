import { USER_CONFIG_NAME, UserConfig } from '../config/user.config';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { UserTokenType } from '../../user/enum/user-token-type.enum';
import { UserService } from '../../user/user.service';
import { IS_PUBLIC_KEY } from '../../shared/decorator/no-auth.decorator';

import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache, // Inject CacheManager
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('Bearer access token is missing.');
    }
    try {
      const userConfig = this.configService.get<UserConfig>(USER_CONFIG_NAME);
      if (!userConfig) {
        throw new Error('User config is not defined');
      }
      const tokenPayload = jwt.verify(
        token,
        userConfig.jwtSecret,
      ) as jwt.JwtPayload;

      if (
        !tokenPayload?.userId ||
        tokenPayload.tokenType !== UserTokenType.ACCESS_TOKEN
      ) {
        throw new Error('Bearer token is not a valid access token');
      }

      // Check if the user is cached
      const cachedUser = await this.cacheManager.get(
        `user:${tokenPayload.userId}`,
      );
      if (cachedUser) {
        request['user'] = cachedUser;
        return true;
      }

      const user = await this.userService.getUserById(tokenPayload.userId);
      if (!user) {
        new Error('User doesnt exist for request token');
      }

      // Cache the user data
      await this.cacheManager.set(
        `user:${tokenPayload.userId}`,
        user,
        userConfig.accessJwtExpiresIn,
      ); // Cache for 5 minutes

      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
