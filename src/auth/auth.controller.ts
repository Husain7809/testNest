import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createUserData: CreateAuthDto) {
    return this.authService.create(createUserData);
  }

  @Post('/login')
  findAndLogin(@Body() createUserData: CreateAuthDto) {
    return this.authService.findAndLogin(createUserData);
  }
}
