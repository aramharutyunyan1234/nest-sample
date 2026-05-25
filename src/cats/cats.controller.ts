import { Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/roles.enum';
import { RolesGuard } from '../common/guard/roles.guard';
import { AuthGuard } from '../common/guard/auth.guard';

@Controller('cats')
@UseGuards(AuthGuard, RolesGuard)
export class CatsController {
  @Post('create')
  @Roles(Role.User, Role.Admin)
  create() {
    console.log('cfcccccccccccccccccc');
    return 'This action adds a new cat';
  }
}
