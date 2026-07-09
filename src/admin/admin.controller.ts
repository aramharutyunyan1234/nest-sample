import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guard/auth.guard';
import { RolesGuard } from '../common/guard/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/decorators/roles.enum';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {}
