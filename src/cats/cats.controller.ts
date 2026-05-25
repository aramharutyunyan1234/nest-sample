import { Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/roles.enum';
import { RolesGuard } from '../common/guard/roles.guard';
import { AuthGuard } from '../common/guard/auth.guard';

@Controller('cats')
@UseGuards(AuthGuard, RolesGuard) // Order matters! Auth runs first, then Roles.
export class CatsController {
  @Post('create')
  @Roles(Role.User, Role.Admin) // Only admins can access this route
  create() {
    console.log('cfcccccccccccccccccc');
    return 'This action adds a new cat';
  }
}
