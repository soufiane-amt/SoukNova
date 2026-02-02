import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';

@Injectable()
export class AuthOrAdminGuard implements CanActivate {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly adminGuard: AdminGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const authResult = await this.authGuard.canActivate(context);
      if (authResult) return true;
    } catch {}

    // Try AdminGuard
    try {
      const adminResult = await this.adminGuard.canActivate(context);
      if (adminResult) return true;
    } catch {}

    // Neither passed
    return false;
  }
}
