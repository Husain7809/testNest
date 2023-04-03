import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly userService: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async create(createUserData: CreateAuthDto) {
    try {
      const { email, password } = createUserData;
      const salt = await bcrypt.genSalt();
      const newPass = await bcrypt.hash(password, salt);
      const user = await this.userService.save({ email, password: newPass });
      return {
        success: true,
        message: user,
      };
    } catch (e) {
      console.log();
      if (e.errno == 1062) {
        throw new Error('Duplicate record found');
      } else {
        throw new Error(e.message);
      }
    }
  }

  async findAndLogin(createUserData: CreateAuthDto) {
    try {
      const { email, password } = createUserData;
      const user = await this.userService.findOne({ where: { email } });
      if (user && (await bcrypt.compare(password, user.password))) {
        const payLoad = { email };
        const token = this.jwtService.sign(payLoad);
        return {
          success: true,
          token,
          message: 'Login SuccessFully...',
        };
      } else {
        return 'Username or password is invalid';
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
