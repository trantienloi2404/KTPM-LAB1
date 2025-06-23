import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/auth-request.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: AuthRequestDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Username already exists',
    type: ApiResponseDto
  })
  async register(
    @Body() authRequest: AuthRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponseDto<string | null>> {
    const apiResponse = await this.authService.register(authRequest);
    
    if (apiResponse.data) {
      this.setAuthCookie(response, apiResponse.data);
    }
    
    response.status(apiResponse.statusCode);
    return apiResponse;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: AuthRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    type: ApiResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    type: ApiResponseDto
  })
  async login(
    @Body() authRequest: AuthRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponseDto<string | null>> {
    const apiResponse = await this.authService.login(authRequest);
    
    if (apiResponse.data) {
      this.setAuthCookie(response, apiResponse.data);
    }
    
    response.status(apiResponse.statusCode);
    return apiResponse;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Logged out successfully',
    type: ApiResponseDto
  })
  async logout(
    @Res({ passthrough: true }) response: Response,
  ): Promise<ApiResponseDto<null>> {
    // Clear the auth cookie
    response.clearCookie('auth_token', {
      path: '/',
      httpOnly: true,
    });
    
    response.status(HttpStatus.OK);
    return new ApiResponseDto(200, 'Logged out successfully', null);
  }

  private setAuthCookie(response: Response, token: string): void {
    response.cookie('auth_token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      sameSite: 'strict',
    });
  }
} 