import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }
  
    const role = this.userService.getUserRole();
    // Si se requiere un rol específico y el usuario no lo tiene
    if (route.data['role'] && role !== route.data['role']) {
      this.router.navigate(['/home']);
      return false;
    }
  
    return true;
  }
}