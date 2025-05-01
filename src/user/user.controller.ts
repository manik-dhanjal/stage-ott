import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Request,
    UnauthorizedException,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UserTokenDto, UserTokensDto } from './dto/user-token.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { UserResponseDto } from './dto/user-response.dto';
import { AuthGuard } from '@shared/gaurd/auth.gaurd';
import { NoAuth } from '@shared/decorator/no-auth.decorator';
  import { PickType } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

  @ApiTags('User')
  @Controller({
    version: '1',
    path: 'user',
  })
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @NoAuth()
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User successfully registered', type: UserTokensDto })
    async register(@Body() newUser: CreateUserDto): Promise<UserTokensDto> {
      return this.userService.registerUser(newUser);
    }
  
    @NoAuth()
    @Post('login')
    @ApiOperation({ summary: 'Login a user' })
    @ApiResponse({ status: 200, description: 'User successfully logged in', type: UserTokensDto })
    async login(
      @Body() userCreds:  LoginDto
    ): Promise<UserTokensDto> {
      return this.userService.validateUser(userCreds);
    }
  
    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user details by access token' })
    @ApiResponse({ status: 200, description: 'User details retrieved', type: UserResponseDto })
    async getUserByAccessToken(@Request() req): Promise<UserResponseDto> {
      return UserResponseDto.fromDocument(req.user);
    }
  
    @Get('access-token')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get a new access token using a refresh token' })
    @ApiResponse({ status: 200, description: 'Access token retrieved', type: UserTokenDto })
    @ApiResponse({ status: 401, description: 'Refresh token is missing or invalid' })
    async getAccessToken(@Request() req): Promise<UserTokenDto> {
      const [type, token] = req.headers.authorization?.split(' ') ?? [];
      const refreshToken = type === 'Bearer' ? token : null;
      if (!refreshToken) {
        throw new UnauthorizedException('refresh token is missing');
      }
      return this.userService.getAccessToken(refreshToken);
    }
  
    @Patch()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user details' })
    @ApiResponse({ status: 200, description: 'User successfully updated', type: UserResponseDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateUser(
      @Body() user: UpdateUserDto,
      @Request() {user: { _id: userId } },
    ): Promise<UserResponseDto> {
      const updatedUser = await this.userService.updateUser(userId, user);
      return UserResponseDto.fromDocument(updatedUser);
    }
  }