import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocValidateUser } from './docs/validate.swagger.decorator';
import { ApiDocLogin } from './docs/auth.swagger.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiDocValidateUser(User)
  @Post('validate')
  validate(@Request() req) {
    const user = req.user as User;
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiDocLogin()
  async signIn(@Body() signInDto: LoginDto) {
    console.log('entrando');
    return this.authService.login({
      email: signInDto.email,
      password: signInDto.password,
    });
  }
}