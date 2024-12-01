import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/']);
      return false;
    }

    const role = this.userService.getUserRole();
    if (route.data['role'] && role !== route.data['role']) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}