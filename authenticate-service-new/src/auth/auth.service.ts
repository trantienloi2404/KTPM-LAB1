import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { AuthRequestDto } from './dto/auth-request.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(authRequest: AuthRequestDto): Promise<ApiResponseDto<string | null>> {
    const existingUser = await this.userRepository.findOne({
      where: { username: authRequest.username },
    });

    if (existingUser) {
      return new ApiResponseDto(409, 'Username already exists', null);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(authRequest.password, saltRounds);

    // Create and save user
    const user = this.userRepository.create({
      username: authRequest.username,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = this.generateToken(savedUser.username, savedUser.id);

    return new ApiResponseDto(201, 'Registered successfully', token);
  }

  async login(authRequest: AuthRequestDto): Promise<ApiResponseDto<string | null>> {
    const user = await this.userRepository.findOne({
      where: { username: authRequest.username },
    });

    if (!user) {
      return new ApiResponseDto(401, 'Invalid credentials', null);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(authRequest.password, user.password);
    
    if (!isPasswordValid) {
      return new ApiResponseDto(401, 'Invalid credentials', null);
    }

    // Generate JWT token
    const token = this.generateToken(user.username, user.id);

    return new ApiResponseDto(200, 'Login successful', token);
  }

  private generateToken(username: string, userId: number): string {
    const payload = { username, sub: userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });
  }
} 