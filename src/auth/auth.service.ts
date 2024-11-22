import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      console.log(email);
      const user: User = await this.usersService.findOneByEmail(
        email.toLowerCase().trim(),
      );

      if (!user) {
        throw new NotFoundException(
          'User not found, Verify your credentials or contact your administrator to register',
        );
      }
      const isMatch = await bcrypt.compare(pass, user?.password);
      if (!isMatch) {
        throw new NotFoundException(
          'User not found, Verify your credentials or contact your administrator to register',
        );
      }
      if (!user.name || !user.email) {
        throw new UnauthorizedException(
          'Please complete your account information to continue',
        );
      }
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(user: Partial<User>) {
    try {
      const verifiedUser: User = await this.validateUser(
        user.email,
        user.password,
      );

      const payload = { ...verifiedUser };

      return {
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw error;
    }
  }
}
