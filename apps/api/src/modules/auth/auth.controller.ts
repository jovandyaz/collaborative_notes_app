import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import type { RequestUser } from '@knowtis/shared-types';

import {
  LoginUserHandler,
  RefreshTokensHandler,
  RegisterUserHandler,
} from './application';
import { CurrentUser, Public } from './decorators';
import type { RefreshTokenDto, RegisterDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { unwrapOrThrow } from './infrastructure';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly registerHandler: RegisterUserHandler,
    private readonly loginHandler: LoginUserHandler,
    private readonly refreshHandler: RefreshTokensHandler
  ) {}

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful, returns tokens' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: RequestUser) {
    const result = await this.loginHandler.login({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl ?? null,
    });
    return unwrapOrThrow(result);
  }

  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.registerHandler.execute(dto);
    return unwrapOrThrow(result);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'New tokens generated' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    const result = await this.refreshHandler.execute(dto.refreshToken);
    return unwrapOrThrow(result);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns current user data' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiBearerAuth()
  @Get('me')
  getProfile(@CurrentUser() user: RequestUser) {
    return { user };
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 204, description: 'Logout successful' })
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout() {
    return;
  }
}
