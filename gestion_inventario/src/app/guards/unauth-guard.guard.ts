import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UnauthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.userService.isAuthenticated()) {
      const role = this.userService.getUserRole();

      if (role === 'admin') {
        this.router.navigate(['/home/electronicComponent']);
      } else if (role === 'user') {
        this.router.navigate(['/home/viewComponents']);
      } else {
        this.router.navigate(['/home']);
      }

      return false;
    }
    return true;
  }
}
