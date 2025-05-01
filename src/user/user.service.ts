import { USER_CONFIG_NAME, UserConfig } from 'src/shared/config/user.config';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import { UserTokenDto, UserTokensDto } from './dto/user-token.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserTokenType } from './enum/user-token-type.enum';
import { UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { isObjectIdOrHexString, Types, UpdateQuery } from 'mongoose';
import { UserTokenPayload } from './interface/user-token-payload.interface';

@Injectable()
export class UserService {
  private readonly userConfig: UserConfig;
  constructor(
    private readonly configService: ConfigService,
    private readonly repository: UserRepository,
  ) {
    console.log(this.configService)
    this.userConfig = this.configService.get<UserConfig>(
      USER_CONFIG_NAME,
    ) as UserConfig;
  }

  async registerUser(user: CreateUserDto): Promise<UserTokensDto> {
    const existingUser = await this.repository.findOne(
      {
        username: user.username,
      }
    );
    if (existingUser) {
      throw new ConflictException(
        `User with username ${user.username} already exists.`,
      );
    }
    const hashedPassword = await bcrypt.hash(
      user.password,
      this.userConfig.passwordSaltRounds,
    );
    const newUser = await this.repository.create({
      ...user,
      password: hashedPassword,
    });

    return {
      access: this.generateAccessToken(newUser),
      refresh: this.generateRefreshToken(newUser),
    };
  }

  async validateUser(
    userCreds: Pick<CreateUserDto, 'username' | 'password'>,
  ): Promise<UserTokensDto> {
    const user = await this.repository.findOne(
      {
       username: userCreds.username,
      }
    );
    if (!user || !user.password)
      throw new UnauthorizedException('Invalid user username or password');

    const isPasswordValid = await bcrypt.compare(
      userCreds.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid user username or password');
    }
    return {
      access: this.generateAccessToken(user),
      refresh: this.generateRefreshToken(user),
    };
  }

  async getAccessToken(refreshToken: string): Promise<UserTokenDto> {
    let tokenPayload: jwt.JwtPayload;
    try {
      tokenPayload = jwt.verify(
        refreshToken,
        this.userConfig.jwtSecret,
      ) as jwt.JwtPayload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    if (
      !tokenPayload.userId ||
      tokenPayload.tokenType !== UserTokenType.REFRESH_TOKEN
    ) {
      throw new UnauthorizedException(
        'Bearer token is not a valid access token',
      );
    }

    const user = await this.getUserById(tokenPayload.userId);
    if (!user) {
      new UnauthorizedException(
        'refresh token is not valid for requested user.',
      );
    }
    return this.generateAccessToken(user);
  }

  async getUserById(
    userId: string,
  ): Promise<UserDocument | null> {
    return this.repository.findOne(
      {
        _id: new Types.ObjectId( userId),
      }
    );
  }

  async updateUser(
    userId: string,
    userToUpdate: UpdateUserDto,
  ): Promise<UserDocument> {
    if (!isObjectIdOrHexString(userId)) {
      throw new UnauthorizedException('Invalid userId');
    }
    const mongoUserId = new mongoose.Types.ObjectId(userId);
    await this.repository.findOne({
      _id: mongoUserId,
    });
    return this.repository.updateByUserId(mongoUserId, userToUpdate);
  }

  async updateUserWithQuery(
    id: Types.ObjectId,
    updateQuery: UpdateQuery<UserDocument>,
  ): Promise<UserDocument> {
    return this.repository.updateByUserId(id, updateQuery);
  }

  private generateAccessToken(user: UserDocument): UserTokenDto {
    const tokenPayload: UserTokenPayload = {
      tokenType: UserTokenType.ACCESS_TOKEN,
      userId: user._id.toString(),
      username: user.username,
    };
    const accessToken = jwt.sign(
      tokenPayload,
      this.userConfig.jwtSecret,
      {
        expiresIn: this.userConfig.accessJwtExpiresIn,
      },
    );

    return {
      token: accessToken,
      expiresIn: this.userConfig.accessJwtExpiresIn,
      expiresOn: new Date().getTime() + this.userConfig.accessJwtExpiresIn,
    };
  }

  private generateRefreshToken(user: UserDocument): UserTokenDto {
    const tokenPayload: UserTokenPayload = {
      tokenType: UserTokenType.REFRESH_TOKEN,
      userId: user._id.toString(),
      username: user.username,
    };

    const refreshToken = jwt.sign(tokenPayload, this.userConfig.jwtSecret, {
      expiresIn: this.userConfig.refreshJwtExpiresIn,
    });
    return {
      token: refreshToken,
      expiresIn: this.userConfig.refreshJwtExpiresIn,
      expiresOn: new Date().getTime() + this.userConfig.refreshJwtExpiresIn,
    };
  }
}
